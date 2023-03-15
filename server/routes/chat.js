import express from "express";
import { getFirstMessage, getMessage } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/title", verifyToken, getFirstMessage);
router.get("/:roomId", verifyToken, getMessage);

export default router;
