import { Message } from "../models/Message.js";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import express from 'express';


const router = express.Router();

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { content, projectId } = req.body;
    const {senderId} = req.query;

    if (!content || !projectId) {
      return res.status(400).json({ message: "Content and project ID are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify user is part of the project
    if (!project.users.includes(senderId) && project.user.toString() !== senderId) {
      return res.status(403).json({ message: "Unauthorized to send messages in this project" });
    }

    const message = new Message({
      content,
      sender: senderId,
      project: projectId
    });

    await message.save();
    
    // Populate sender info before sending response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all messages for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const {userId} = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify user is part of the project
    if (!project.users.includes(userId) && project.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to view messages in this project" });
    }

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 });

    // Mark messages as read
    const unreadMessages = messages.filter(
      msg => !msg.readBy.includes(userId) && msg.sender._id.toString() !== userId.toString()
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { 
          _id: { $in: unreadMessages.map(msg => msg._id) },
          readBy: { $ne: userId }
        },
        { $addToSet: { readBy: userId } }
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark a message as read
router.patch('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const {userId} = req.query;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    ).populate('sender', 'firstName lastName');

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;