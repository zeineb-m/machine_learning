import { Project } from '../models/Project.js';
import { User } from '../models/User.js';

// Track active calls
export const activeCalls = new Map();

export const setupCallSocket = (io) => {
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
        if (!project.users.includes(userId) && project.user.toString() !== userId) {
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
};