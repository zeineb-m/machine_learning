import Message from "../models/Message.js";
import User from "../models/User.js";

export const addMessage = async (req , res)=> {
    try {
       const content = req.body.content ;
       if(!content)
        return res.status(400).json({ message: "Content is required" });
        const newMessage = new Message({content}) ;
        await newMessage.save();
        res.status(201).json(newMessage)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const getMessages = async (req , res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const getMessageById = async (req , res) => {
    const id = req.params.id ; 
    try {

        const message = await Message.findById(id);
        if(!message) 
            return res.status(404).json({message: "Message not found"});
        res.status(200).json(message);
    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

export const updateMessage = async (req , res)=> {
    const id = req.params.id ; 
    try {
        const updatedMessage = await Message.findByIdAndUpdate(id, req.body
            , {new: true});
            
        if(!updatedMessage)
            return res.status(404).json({message: "Message not found"});
        res.status(200).json(updatedMessage);
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const deleteMessage = async (req , res)=> {
    const id = req.params.id ;
    try {
    await Message.findByIdAndDelete(id)
    res.status(200).json({message: "Message deleted"})
    }catch(error) {
      res.status(500).json({message: error.message})
    }
}


export const getMessagesByUser = async (req , res)=> {
const idUser = req.params.idUser ; 
try {
const user = await User.findById(idUser); 
if(!user) 
    return res.status(404).json({message: "User not found"});

const messages = await Message.find({user: idUser});

res.status(200).json(messages);

}catch(error) {
    res.status(500).json({message: error.message})
}
}

export const getMessageBetweenUsers= async (req , res)=> {
const idTo = req.params.idTo ;
const myId = req.params.myId ;
try {
const userTo = await User.findById(idTo) ;
const me = await User.findById(myId) ;
if(!userTo || !me) return res.status(404).json({message: "User not found"}) ;

const messages = await Message.find({$or: [{user: myId, recipient: idTo}, {user: idTo, recipient: myId}]})
res.status(200).json(messages);
}catch(error) {
    res.status(500).json({message : error.message})
}
}
