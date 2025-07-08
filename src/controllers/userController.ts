// controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/User";

// ✅ Get logged-in user's profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // The authenticate middleware should attach `userId` to req
    const userId = req.userId; 

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'useremail', 'phone', 'type'] // select only necessary fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error });
  }
};

// ✅ Update logged-in user's profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { username, phone } = req.body; // You can allow more fields if needed

    const user = await User.findByPk(userId);
    console.log("User ID from token:", userId);


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    await user.save();
    console.log("User updated:", user.toJSON());


    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};
