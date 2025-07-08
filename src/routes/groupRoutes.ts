import express from "express";
import {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup
} from "../controllers/groupController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createGroup);
router.get("/", authenticate, getGroups);
router.get("/:id", authenticate, getGroupById);
router.put("/:id", authenticate, updateGroup);
router.delete("/:id", authenticate, deleteGroup);

export default router;
