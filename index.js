import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import UserRoute from './routes/User.js';
import ProjectRoute from './routes/Project.js';
import fileRoutes from "./routes/Files.js";
import Python from "./routes/python.js";
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";
import { exec } from 'child_process';
import path from "path";
import { fileURLToPath } from "url";
import axios from 'axios';
import grandLivreRoutes from "./routes/GrandLivre.js"; 
import balanceRoutes from "./routes/Balance.js";
import Budget from "./routes/Budget.js";
import BudgetVariance from "./routes/BudgetVariance.js";
import AccountingRoutes from './routes/AccountingTask.js';
import CashFlowRoutes from './routes/CashFlow.js';
import MessageRoutes from "./routes/Message.js";
import ReclamationRoutes from "./routes/Reclamation.js";
import { Server } from "socket.io";
import { Message } from './models/Message.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDatabase();

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Increase timeout for slow connections
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.static('public'));
configDotenv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static("file"));

app.use("/api/auth", Auth);
app.use("/api/users", UserRoute);
app.use("/api/project", ProjectRoute);
app.use("/api/files", fileRoutes);
app.use("/api/grandLivre", grandLivreRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/budget", Budget);
app.use("/api/budget-variance", BudgetVariance);
app.use("/api/accounting-task", AccountingRoutes);
app.use("/api/cashflow", CashFlowRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/claims", ReclamationRoutes);
app.use("/python", Python);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Track active calls
const activeCalls = new Map();

// Socket.IO Logic for messaging
const messageNamespace = io.of('/messages');
messageNamespace.on("connection", (socket) => {
  console.log("A user connected to messaging: " + socket.id);

  // Join project room
  socket.on("join_project", async (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Leave project room
  socket.on("leave_project", (projectId) => {
    socket.leave(projectId);
    console.log(`User ${socket.id} left project ${projectId}`);
  });

  // Handle new messages
  socket.on("send_message", async (data) => {
    try {
      const { content, projectId, senderId } = data;
      
      if (!content || !projectId || !senderId) {
        throw new Error("Missing required fields");
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Verify user is part of the project
      if (!project.users.includes(senderId) && project.user.toString() !== senderId) {
        throw new Error("Unauthorized to send messages in this project");
      }

      const message = new Message({
        content,
        sender: senderId,
        project: projectId
      });
      
      const savedMessage = await message.save();
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'firstName lastName');

      messageNamespace.to(projectId).emit("receive_message", populatedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("message_error", { error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from messaging: " + socket.id);
  });
});

// Socket.IO Logic for calls
const callNamespace = io.of('/call');
callNamespace.on("connection", (socket) => {
  console.log("A user connected to calls: " + socket.id);

  // Store user info
  let userInfo = {
    userId: null,
    projectId: null
  };

  // Join call room for a project
  socket.on("join_call_room", async ({ projectId, userId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Verify user is part of the project
      if (!project.users.includes(userId)) {
        throw new Error("Unauthorized to join call for this project");
      }

      socket.join(projectId);
      userInfo = { userId, projectId };
      console.log(`User ${userId} joined call room for project ${projectId}`);
    } catch (error) {
      console.error("Error joining call room:", error);
      socket.emit("call_error", { error: error.message });
    }
  });

  // Leave call room
  socket.on("leave_call_room", (projectId) => {
    socket.leave(projectId);
    console.log(`User ${socket.id} left call room for project ${projectId}`);
  });

  // Start a new call
  socket.on("start_call", async ({ projectId, callerId, isVideo }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Verify caller is part of the project
      if (!project.users.includes(callerId) && project.user.toString() !== callerId) {
        throw new Error("Unauthorized to start call in this project");
      }

      const caller = await User.findById(callerId).select('firstName lastName');
      if (!caller) {
        throw new Error("Caller not found");
      }

      // Track the active call
      activeCalls.set(projectId, {
        callerId,
        isVideo,
        participants: new Set([callerId])
      });

      // Notify other users in the project
      socket.to(projectId).emit("call_received", {
        callerId,
        callerName: `${caller.firstName} ${caller.lastName}`,
        isVideo
      });

      console.log(`Call started in project ${projectId} by ${callerId}`);
    } catch (error) {
      console.error("Error starting call:", error);
      socket.emit("call_error", { error: error.message });
    }
  });

  // Accept a call
  socket.on("accept_call", async ({ projectId, callerId, calleeId, isVideo }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Verify both users are part of the project
      const isValidCaller = project.users.includes(callerId) || project.user.toString() === callerId;
      const isValidCallee = project.users.includes(calleeId) || project.user.toString() === calleeId;
      
      if (!isValidCaller || !isValidCallee) {
        throw new Error("Unauthorized to accept call in this project");
      }

      // Update active call participants
      const call = activeCalls.get(projectId);
      if (call) {
        call.participants.add(calleeId);
      }

      // Notify caller that call was accepted
      socket.to(projectId).emit("call_accepted", {
        projectId,
        callerId,
        calleeId,
        isVideo
      });

      console.log(`Call accepted in project ${projectId} by ${calleeId}`);
    } catch (error) {
      console.error("Error accepting call:", error);
      socket.emit("call_error", { error: error.message });
    }
  });

  // Reject a call
  socket.on("reject_call", ({ projectId, callerId, calleeId }) => {
    socket.to(callerId).emit("call_rejected", { calleeId });
    console.log(`Call rejected in project ${projectId} by ${calleeId}`);
  });

  // End a call
  socket.on("end_call", ({ projectId, callerId, calleeId }) => {
    // Remove the active call
    activeCalls.delete(projectId);
    
    // Notify all participants
    callNamespace.to(projectId).emit("call_ended", { 
      endedBy: callerId || calleeId 
    });
    
    console.log(`Call ended in project ${projectId}`);
  });

  // WebRTC Signaling
  socket.on("offer", ({ projectId, offer, callerId, calleeId }) => {
    socket.to(calleeId).emit("offer", { 
      projectId, 
      offer, 
      callerId 
    });
  });

  socket.on("answer", ({ projectId, answer, callerId, calleeId }) => {
    socket.to(callerId).emit("answer", { 
      projectId, 
      answer, 
      calleeId 
    });
  });

  socket.on("ice_candidate", ({ projectId, candidate, userId }) => {
    socket.to(projectId).emit("ice_candidate", { 
      candidate, 
      userId 
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected from calls: " + socket.id);
    
    // End any active calls if the user was participating
    if (userInfo.projectId) {
      const call = activeCalls.get(userInfo.projectId);
      if (call && call.participants.has(userInfo.userId)) {
        callNamespace.to(userInfo.projectId).emit("call_ended", { 
          endedBy: userInfo.userId,
          reason: "disconnected"
        });
        activeCalls.delete(userInfo.projectId);
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    activeCalls: activeCalls.size
  });
});

import AnomalyRoutes from './routes/anomaly.js';
app.use('/api/anomaly', AnomalyRoutes);


export { io };