import express from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/update-profile", authenticate, updateProfile);

export default router;
