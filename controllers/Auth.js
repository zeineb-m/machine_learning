import { User } from "../models/User.js";
import jwt from "jsonwebtoken" ;
import bcrypt from "bcrypt" ;
import zxcvbn from 'zxcvbn';
import multer from "multer";
import { fileURLToPath } from "url";
import path from 'path'
import fs from 'fs';
import { sendEmailForgetPassword } from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verificationCache = new Map();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Chemin absolu vers le dossier "uploads"
  },
  filename: (req, file, cb) => {
   
    const filename = file.originalname; // Nom original du fichier
    cb(null, filename); // Sauvegarder avec le nom original
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limiter la taille à 5 Mo
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

export const registerUser = async (req, res) => {
  const {
    CIN,
    firstName,
    lastName,
    gender,
    birthDate,
    phone,
    email,
    password,
    confirmPassword,
    projectName,
    projectDescription,
    projectStartDate,
    projectStatus,
  } = req.body;

  
  if (
    !CIN ||  !firstName ||  !lastName || !gender || !birthDate || !phone ||
    !email || !password || !confirmPassword || !projectName || !projectDescription || !projectStartDate
  ) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
  }

  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return res.status(400).json({ message: "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus complexe." });
  }


  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let image = null;
  if (req.file) {
    // Lire le fichier téléchargé en Buffer
    const imageData = fs.readFileSync(path.resolve('uploads', req.file.filename)); // Lire l'image en Buffer

    image = {
      data: imageData,
      contentType: req.file.mimetype, 
    };
  }

  const newUser = new User({
    CIN,
    firstName,
    lastName,
    gender,
    birthDate,
    phone,
    email,
    image, 
    password: hashedPassword,
    project: {
      name: projectName,
      description: projectDescription,
      startDate: projectStartDate,
      status: projectStatus || "planned",
    },
    
  });


  try {
    await newUser.save();
    verificationCache.delete(email); 
    res.status(201).json({ message: "Utilisateur enregistré avec succès.", image: image });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
    res.status(500).json({ message: "Échec de l'enregistrement. Veuillez réessayer." });
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
}};

export const checkMail= async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (user) {
      res.json({ exists: true }); // Email exists
    } else {
      res.json({ exists: false }); // Email does not exist
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while checking the email.' });
  }
}

export const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const resetToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
      );

      const urlSafeToken = encodeURIComponent(resetToken);
      const resetLink = `http://localhost:5173/auth/reset-password?token=${urlSafeToken}`;
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');

      const emailContent = `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
              </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f8faf7;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <!-- Header -->
                  <div style="text-align: center; padding: 30px 0; background-color: #B6D7A8; border-radius: 15px 15px 0 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                      <img src="cid:companyLogo" alt="M7asbi Logo" style="width: 150px; height: auto;"/>
                  </div>
                  
                  <!-- Main Content -->
                  <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                      <h1 style="color: #4a6741; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                          Reset Your Password
                      </h1>
                      
                      <p style="color: #688a5e; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">
                          We received a request to reset your password. Don't worry, we're here to help you regain access to your account.
                      </p>
                      
                      <!-- Reset Button -->
                      <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetLink}" 
                             style="display: inline-block; padding: 15px 30px; background-color: #B6D7A8; color: #4a6741; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(182, 215, 168, 0.3);">
                              Reset Password
                          </a>
                      </div>
                      
                      <p style="color: #688a5e; font-size: 14px; line-height: 20px; margin-bottom: 20px; text-align: center;">
                          This link will expire in 15 minutes for security reasons.
                      </p>
                      
                      <div style="border-top: 1px solid #e8f0e5; margin: 30px 0; padding-top: 30px;">
                          <p style="color: #688a5e; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                              If you didn't request this password reset, you can safely ignore this email.
                          </p>
                      </div>
                  </div>
                  
                  <!-- Footer -->
                  <div style="text-align: center; padding: 20px; color: #688a5e;">
                      <p style="margin: 0 0 10px 0; font-size: 14px;">
                          Best regards,<br/>
                          <span style="color: #4a6741; font-weight: 600;">M7asbi Team</span>
                      </p>
                      <div style="margin-top: 20px; font-size: 12px;">
                          <p style="margin: 5px 0; color: #688a5e;">
                              © ${new Date().getFullYear()} M7asbi. All rights reserved.
                          </p>
                      </div>
                  </div>
              </div>
          </body>
          </html>
      `;

      const plainTextContent = `
          Reset Your Password
          
          We received a request to reset your password. To reset your password, please click the following link:
          ${resetLink}
          
          This link will expire in 15 minutes for security reasons.
          
          If you didn't request this password reset, you can safely ignore this email.
          
          Best regards,
          M7asbi Team
      `;

      const attachments = [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'companyLogo'
      }];

      await sendEmailForgetPassword(
          email,
          "Reset Your Password - M7asbi",
          plainTextContent,
          emailContent,
          attachments
      );

      res.status(200).json({ 
          message: "Password reset link has been sent to your email" 
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing request" });
  }
};

// Function to handle reset password
export const resetPassword = async (req, res) => {
  try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id
      const user = await User.findOne({ _id: decoded.id });

      if (!user) {
          return res.status(400).json({ 
              message: "User not found" 
          });
      }

      // Check password strength
      const passwordStrength = zxcvbn(newPassword);
      if (passwordStrength.score < 3) {
          return res.status(400).json({ 
              message: "Password is too weak. Choose a stronger password." 
          });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
      if (error.name === 'JsonWebTokenError') {
          return res.status(400).json({ message: "Invalid or expired token" });
      }
      console.error(error);
      res.status(500).json({ message: "Error resetting password" });
  }
};