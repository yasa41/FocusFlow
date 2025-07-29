import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
})); 
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send(" StudySync API is running...");
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
