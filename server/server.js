import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";        
import { Server } from "socket.io";  

//express 
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/userRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import messageRouter from './routes/messageRoutes.js';

//socket 
import { verifySocketToken } from "./middleware/socketAuth.js";
import socketController from './controllers/socketController.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

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
app.use("/api/user", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/messages",messageRouter);

app.get("/", (req, res) => {
  res.send(" StudySync API is running...");
});

io.use(verifySocketToken);
 
io.on('connection', (socket) => {
  socketController.handleConnection(socket, io);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
