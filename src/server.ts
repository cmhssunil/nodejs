import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/config";
import userRoutes from "./routes/userRoutes";
import customerRoutes from "./routes/customerRoutes";
import groupRoutes from "./routes/groupRoutes";
import customergroupRoutes from "./routes/customerGroupRoutes";
import authRoutes from "./routes/authRoutes"; // 👉 import authRoutes
import clinicalConsultationRoutes from "./routes/clinicalConsultationRoutes";
import cors from "cors";
import cookieParser from "cookie-parser"; // 👉 import cookie-parser

dotenv.config();

const app = express();

// Enable cors for your requests from frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // 👉 important to parse cookies

// Routes
app.use("/api/auth", authRoutes); // 👉 auth routes
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/customergroup", customergroupRoutes);
app.use("/api/clinical-consultations", clinicalConsultationRoutes);

const PORT = process.env.PORT || 5001;

// Database connection and server start
sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error("Database error:", err));
