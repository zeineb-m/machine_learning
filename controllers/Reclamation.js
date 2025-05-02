import { Reclamation } from '../models/Reclamation.js';
import { User } from '../models/User.js';


export const createReclamation = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;

    if (!userId || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reclamation = new Reclamation({
      user: userId,
      subject,
      message,
    });

    await reclamation.save();

    return res.status(201).json({ message: 'Reclamation created', reclamation });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate('user', 'firstName lastName email');
    res.status(200).json(reclamations);
  } catch (error) {
    console.error('Get all error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await Reclamation.findById(id).populate('user', 'firstName lastName email');
    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message, status, response } = req.body; 

    const updated = await Reclamation.findByIdAndUpdate(
      id,
      { subject, message, status, response },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }

    res.status(200).json({ message: 'Reclamation updated', reclamation: updated });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Reclamation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }

    res.status(200).json({ message: 'Reclamation deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
