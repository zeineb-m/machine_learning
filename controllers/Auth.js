import { User } from "../models/User.js";
import jwt from "jsonwebtoken" ;
import bcrypt from "bcrypt" ;


export const registerUser =async (req , res )=> {

    try {
         const {username, email, password} = req.body ;
         if(!username ||!email || !password) {
             res.status(400).json({message:"All fields are required"});
         }
         const existUser = await User.findOne({email})

         if(existUser) {
             return res.status(400).json({message:"User already exists"})
         }

         const hashedPassword = await bcrypt.hash(password , 10 )
         const user = new User({
             username,
             email,
             password : hashedPassword,
         })
         user.save();
         res.status(201).json(user)
         

    }catch(error) {
        res.status(500).json({message: error.message})
    }

}


export const login = async (req , res) => {
try {
const {email , password} = req.body ;

const findUser = await User.findOne({email}) ;
if (!findUser)
    res.status(404).json({message:"User not found"})

const isMatch = await bcrypt.compare(password, findUser.password);

if (!isMatch)
    return res.status(400).json({message:"Invalid credentials"})

const token = jwt.sign({id: findUser._id , isAdmin : findUser.isAdmin}, process.env.JWT_SECRET , {expiresIn: '5d'});

if(token)
    res.status(200).json({token , user: findUser}) ;

}catch(error) {
    res.status(500).json({message: error.message})
}

}