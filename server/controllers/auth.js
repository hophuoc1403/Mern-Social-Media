import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Register user
export const register =async (req,res) =>{
  try{
    // let picturePath =req.get("host") + "/assets"  + req.file.filename
    const {
      picturePath,
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation
    }  = req.body
  const salt = await bcrypt.genSalt()
  const passwordHash = await bcrypt.hash(password,salt)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password : passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile:Math.floor(Math.random() * 1000),
      impressions:Math.floor(Math.random() * 1000)
    })
    console.log(newUser)
    const savedUSer  =await newUser.save()
    res.status(201).json(savedUSer)
  }catch (e) {
    res.status(500).json({error:e.message})
  }
}

// LOGGING IN

export const login = async (req,res) => {
  try{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user) {
      return res.status(400).json({message:"User does not exist"})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({message:"invalid credentials"})
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.TOKEN_LIFE})
    const refreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.REFRESH_LIFE})
    delete user.password;
    res.status(201).json({refreshToken,token,user})
  }catch (e) {
    res.status(500).json({error:e.message})
  }
}

export const refresh = async (req,res) =>{
  const {refreshToken} = req.body
  try{
    const decoded = await jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)
    const accessToken = await jwt.sign({id:decoded._id},process.env.JWT_SECRET)

    return res.status(200).json({accessToken})
  }catch (e) {
    res.status(403).json({error:e.message})
  }
}
