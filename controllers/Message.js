import { Message } from "../models/Message.js";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";

export const sendMessage = async (req, res) => {
  const { content, projectId } = req.body;
  const { senderId } = req.query; // Get senderId from query params

  try {
    // Validate sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify sender is part of the project
    if (!project.users.includes(senderId) && project.user.toString() !== senderId) {
      return res.status(403).json({ message: "You must be a project member to send messages" });
    }

    const message = new Message({
      content,
      sender: senderId,
      project: projectId
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectMessages = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.query; // Get userId from query params

  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify user is part of the project
    if (!project.users.includes(userId) && project.user.toString() !== userId) {
      return res.status(403).json({ message: "You must be a project member to view messages" });
    }

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.query; // Get userId from query params

  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};