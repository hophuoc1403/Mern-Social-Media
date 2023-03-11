import express from "express";
import {
  login,
  refresh,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/email/send", verifyEmail);
router.post("/reset-password", resetPassword);

export default router;
