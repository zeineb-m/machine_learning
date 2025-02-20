import { User } from "../models/User.js";
import jwt from "jsonwebtoken" ;
import bcrypt from "bcrypt" ;
import { sendEmail } from "../services/emailService.js";
import zxcvbn from 'zxcvbn';//*pour solidité de password
import multer from "multer";

const verificationCache = new Map();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

export const registerUser = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const {
        firstName,
        lastName,
        gender,
        birthDate,
        phone,
        email,
        CIN,
        password,
        confirmPassword,
        projectName,
        projectDescription,
        projectStartDate,
        projectStatus,
        verificationCode,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !gender ||
        !birthDate ||
        !phone ||
        !email ||
        !CIN ||
        !password ||
        !confirmPassword ||
        !projectName ||
        !projectStartDate
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const passwordStrength = zxcvbn(password);
      if (passwordStrength.score < 3) {
        return res.status(400).json({ message: "Password is too weak. Choose a stronger password." });
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (!verificationCode) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCache.set(email, code);
        await sendEmail(email, "Email Verification", `Your verification code is: ${code}`);
        return res.status(200).json({ message: "Verification code sent. Check your email." });
      }

      const cachedCode = verificationCache.get(email);
      if (!cachedCode || cachedCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        gender,
        birthDate,
        phone,
        email,
        CIN,
        password: hashedPassword,
        project: {
          name: projectName,
          description: projectDescription,
          startDate: projectStartDate,
          status: projectStatus || "planned",
        },
        verification: { verified: true },
        image: req.file
          ? { data: req.file.buffer, contentType: req.file.mimetype }
          : undefined,
      });

      await user.save();
      verificationCache.delete(email);

      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const login = async (req , res) => {
try {
const {email , password} = req.body ;

const findUser = await User.findOne({email}) ;
if (!findUser)
  return  res.status(404).json({message:"User not found"})

const isMatch = await bcrypt.compare(password, findUser.password);

if (!isMatch)
    return res.status(400).json({message:"your password is incorrect"})

const token = jwt.sign({id: findUser._id , role : findUser.role , isAvailable: findUser.isDisabled} ,
     process.env.JWT_SECRET , 
     {expiresIn: '5d'});

if(token)
    res.status(200).json({token , user: findUser}) ;

}catch(error) {
    res.status(500).json({message: error.message})
}

}