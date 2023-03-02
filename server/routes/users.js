import express from "express";
import {
  getUser,
  addRemoveFriend,
  editProfile,
  getFriend
} from "../controllers/users.js"

import {verifyToken} from  "../middleware/auth.js"

const router = express.Router()

// Read routes

router.get("/fiends",verifyToken,getFriend)
router.get("/:id",verifyToken,getUser)

// update
router.patch("/:id/:friendId",verifyToken,addRemoveFriend)
router.patch("/",verifyToken,editProfile)

export default  router