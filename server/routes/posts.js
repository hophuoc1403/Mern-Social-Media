import express from "express";
import {addComment, deletePost, editComment, getFreePosts, getUserPosts, likePost} from "../controllers/posts.js"
import {verifyToken} from "../middleware/auth.js";

const router = express.Router()

// Read
router.get("/",getFreePosts)
router.get("/:userId/posts",verifyToken,getUserPosts)


// Update
router.delete("/:id",verifyToken,deletePost)
router.patch("/:id/like",verifyToken,likePost)

router.get("/:id/comment",verifyToken,)
router.post("/:id/comment",verifyToken,addComment)
router.patch("/:id/comment",verifyToken,editComment)

export default router