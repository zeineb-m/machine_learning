import { Server } from "socket.io";
import { Message } from '../models/Message.js';
import { Project } from '../models/Project.js';

export const setupMessageSocket = (io) => {
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
        if (!project.users.includes(senderId)) {
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
};