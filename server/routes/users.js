import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  editProfile
} from "../controllers/users.js"

import {verifyToken} from  "../middleware/auth.js"

const router = express.Router()

// Read routes

router.get("/",verifyToken,getUser)
router.get("/friends",verifyToken,getUserFriends)

// update
router.patch("/:id/:friendId",verifyToken,addRemoveFriend)
router.patch("/",verifyToken,editProfile)

export default  router