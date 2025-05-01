import AccountingTask from "../models/AccountingTask.js";
import  {User}  from "../models/User.js";

export const createAccountingTask = async (req, res) => {
  try {


    const {userId , title, description, dueDate } = req.body;


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = new AccountingTask({
      title,
      description,
      dueDate,
      createdBy: userId,
    });

    await newTask.save();

    user.tasks.push(newTask._id);

    await user.save();

    res.status(201).json({ message: "Accounting task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating accounting task", error });
  }
};


export const getAccountingTask = async (req, res) => {
    try {
      const id = req.query.userId;
  
      if (!id) {
        return res.status(400).json({ message: "Missing userId" });
      }
  
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const tasks = await AccountingTask.find({ createdBy: id }).sort({ dueDate: 1 });
  
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accounting tasks", error });
    }
  };
  


export const updateAccountingTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, isCompleted } = req.body;

    const updatedTask = await AccountingTask.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, isCompleted },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Accounting task not found" });
    }

    res.status(200).json({ message: "Accounting task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating accounting task", error });
  }
};


export const deleteAccountingTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedTask = await AccountingTask.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Accounting task not found" });
    }

    await user.updateOne({ $pull: { tasks: taskId } });

    res.status(200).json({ message: "Accounting task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting accounting task", error });
  }
};

export const getUpcomingTasks = async (req, res) => {
  try {
    const { userId } = req.query;
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    const upcomingTasks = await AccountingTask.find({
      createdBy: userId,
      dueDate: {
        $gte: today,
        $lte: twoDaysLater
      },
      isCompleted: false
    });

    res.status(200).json(upcomingTasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming tasks", error });
  }
};