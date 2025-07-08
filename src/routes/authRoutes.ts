import express from "express";
import { loginUser, registerUser, refreshToken, logoutUser } from "../controllers/authController";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router;
