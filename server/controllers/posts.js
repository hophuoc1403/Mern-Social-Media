import Post from "../models/Post.js"
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import user from "../models/User.js";

// Create

export const createPosts = async (req, res) => {
  try {
    const {userId, description, picturePath} = req.body

    const user = await User.findById(userId)
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: []
    })

    await newPost.save()
    const posts = await Post.find({})
    res.status(201).json(posts)
  } catch (e) {
    console.log("errr")
    res.status(408).json({error: e.message})
  }
}

// Read
export const getFreePosts = async (req, res) => {
  try {
    const pageNumber = +req.query.page || 1
    const limit = req.query.limit || 5

    const pagination =await apiPagination(pageNumber,limit)

    let posts = await Post.find({}).skip(pagination.offset).limit(limit).exec()
     let comment =await Comment.find({}).exec()

    let postWithComment = posts.map((post) =>{
      const currentComment = comment.filter(cmt => {
      if(cmt.postId === post.id) {
      }
       return  cmt.postId === post.id
      })
      // post.comment = currentComment.map(cmt => {
      //   return {message : cmt.message,userId:cmt.userId}
      // })

      let newPost = {...post._doc,comment:currentComment}
      return newPost
    })
    res.status(200).json({posts:postWithComment,pagination})
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const {userId} = req.params
    const post = await Post.find({userId})
    res.status(200).json(post)
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

// update

export const likePost = async (req, res) => {
  try {
    const {id} = req.params
    const {userId} = req.body
    const post = await Post.findById(id)
    let isLiked = false
    for (let i of post.likes) {
      if (i[0] === userId) {
        isLiked = true
      }
    }
    // post.likes.userId = true
    //
    if (isLiked) {
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true)
    }
    await post.save()
    // const updatedPost = await  Post.findByIdAndUpdate(id,{likes:post.likes},{new:true})
    res.status(200).json(post)
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const getComment = async (req,res) => {
  try{
    const {id} = req.params
    const comment = Comment.find({postId:id})
    res.status(200).json(comment)
  }
  catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const addComment = async (req, res) => {
  try {
    const {id} = req.params
    const {message} = req.body
   let userId = req.userId
    const commentAdded = new Comment({
      message,
      userId,
      postId:id,
      commentRoot:req.body.commentRoot ? req.body.commentRoot : null
    })
    await commentAdded.save()
    res.status(200).json({message: "added success"})
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const editComment = async (req, res) => {
  try {
    const {id} = req.params
    const {message} = req.body
   const currentComment = await  Comment.findByIdAndUpdate(id,{message},{returnDocument:"after"})
    return res.json({message:"updated success",currentComment})
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const deletePost = async (req, res) => {
  try {
    const {id} = req.params
    await Post.deleteOne({_id: id}, {returnDocument: 'after'})
    const posts = await Post.find({})
    return res.status(200).json(posts)
  } catch (e) {
    res.status(408).json({error: e.message})
  }
}

export const editPost = async (req, res) => {
  try {
    const {id} = req.params
    const {description} = req.body
    if (req.body.picturePath === undefined) {
      await Post.updateOne({_id: id}, {description}, {returnDocument: "after"})
    } else {
      await Post.updateOne({_id: id}, {description, picturePath}, {returnDocument: "after"})
    }
    const updatedPosts = await Post.findById(id)
    return res.status(200).json(updatedPosts)

  } catch
    (e) {
    res.status(408).json({error: e.message})
  }
}

const apiPagination = async (pageNumber, limit) => {
  const totalPost = await Post.countDocuments().exec()
  let startIndex = (pageNumber - 1) * limit
  let endIndex = pageNumber * limit
  let apiPagination = {
    totalPost,
    hasPrevPage: false,
    hasNextPage: false,
    currentPage:pageNumber,
    offset:startIndex
  }
  if (startIndex > 0) {
    apiPagination.hasPrevPage = true
  }
  if (endIndex < totalPost) {
    apiPagination.hasNextPage = true
  }

  return apiPagination
}