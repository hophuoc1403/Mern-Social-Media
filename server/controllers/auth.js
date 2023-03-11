import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthClient, OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

// Register user
export const register = async (req, res) => {
  try {
    // let picturePath =req.get("host") + "/assets"  + req.file.filename
    const {
      picturePath,
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });
    console.log(newUser);
    const savedUSer = await newUser.save();
    res.status(201).json(savedUSer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// LOGGING IN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_LIFE }
    );
    delete user.password;
    res.status(201).json({ refreshToken, token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET);

    return res.status(200).json({ accessToken });
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
};

const myOAuth2Client = new OAuth2Client(
  "1035405520449-737opod5dblop954gvltb6btkaqbut54.apps.googleusercontent.com",
  "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"
);

myOAuth2Client.setCredentials({
  refresh_token:
    "1//048PeqMxQJYZ2CgYIARAAGAQSNwF-L9Ir5toMpC9UDe9777yV3EffFGikHykZak65m15aEYw5-ROZAFpv8E2UmNhZMwCuXTC4XEE",
});

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json({ message: "empty email field" });
    }
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    console.log(process.env.ADMIN_EMAIL_ADDRESS);
    const myAccessToken = myAccessTokenObject?.token;

    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        refreshToken:
          "1//048PeqMxQJYZ2CgYIARAAGAQSNwF-L9Ir5toMpC9UDe9777yV3EffFGikHykZak65m15aEYw5-ROZAFpv8E2UmNhZMwCuXTC4XEE",
        accessToken: myAccessToken,
      },
    });


    const verifyToken = jwt.sign({email},"myveryhardstringtoverifyaccount",{expiresIn:"5m"})

    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      to: email,
      subject: "Verify Account Media",
      html: `<button><a href="http://localhost:3000/oauth-verify?token=${verifyToken}">Verify Email</a></button>`,
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
