import { User } from "../models/User.js"

export const getAllUsers = async (req, res) => {
try {
    const users = await User.find()
    res.status(200).json(users)
} catch(error) {
    res.status(500).json({ error: error })
}
   
}

export const getUserById = async (req, res) => {
    const idUser = req.params.id;
    try {
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    }catch(error){
        res.status(500).json({ error: error })
    }
}

export const deleteUserById = async (req, res) => {
    const idUser = req.params.id;
    try {
      const user = await User.findByIdAndDelete(idUser);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({message: "User deleted" });
    } catch(error){
        res.status(500).json({ error: error })
    }
}

export const updateUserById = async (req, res) => {
    const idUser = req.params.id;
    const newContent = req.body ;
    try {

        const user = await User.findByIdAndUpdate(idUser , newContent , {new : true});
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({user , message: "User updated" });

    }catch(error) {
        res.status(500).json({ error: error })
    }
}