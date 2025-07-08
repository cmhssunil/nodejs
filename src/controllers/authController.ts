// controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, useremail, phone, password, type } = req.body;
    const user = await User.create({ username, useremail, phone, password, type });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ where: { useremail } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user.id, type: user.type },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // Save refresh token to DB or in-memory store if needed

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      
      const payload = decoded as JwtPayload;
      
      // Verify user still exists in database
      User.findByPk(payload.id).then(user => {
        if (!user) {
          return res.status(403).json({ message: "User no longer exists" });
        }
        
        const newAccessToken = jwt.sign(
          { id: payload.id, type: payload.type },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );
      
        res.json({ accessToken: newAccessToken });
      }).catch(() => {
        res.status(403).json({ message: "User verification failed" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token", error });
  }
};

// ✅ Finally, here's your logout logic:
export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      path: "/api/auth/refresh-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout", error });
  }
};
