import express from "express";
import {addComment, deletePost, getFreePosts, getUserPosts, likePost} from "../controllers/posts.js"
import {verifyToken} from "../middleware/auth.js";

const router = express.Router()

// Read
router.get("/",verifyToken,getFreePosts)
router.get("/:userId/posts",verifyToken,getUserPosts)


// Update
router.delete("/:id",verifyToken,deletePost)
router.patch("/:id/like",verifyToken,likePost)
router.post("/:id/comment",verifyToken,addComment)
router.patch("/:id/comment",verifyToken,addComment)

export default router