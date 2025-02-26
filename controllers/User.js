import { User } from "../models/User.js"
import bcrypt from "bcrypt" ;
import zxcvbn from 'zxcvbn';
import path from 'path'
import fs from 'fs';
import multer from 'multer';
import { sendEmailClient } from "../services/emailService.js";

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
  const { firstName, lastName, gender, birthDate, phone, email } = req.body;

  try {
      const user = await User.findById(idUser);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Mise à jour uniquement des champs fournis
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (gender) user.gender = gender;
      if (birthDate) user.birthDate = birthDate;
      if (phone) user.phone = phone;
      if (email) user.email = email;

      await user.save();
      res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const addUser = async (req, res) => {
  const { CIN, firstName, lastName, gender, birthDate, phone, email, password, confirmPassword, role } = req.body;

  const validRoles = ['accountant', 'financial manager', 'auditeur', 'manager controller'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide. Veuillez choisir un rôle parmi : accountant, financial manager, auditeur, manager controller." });
  }

  if (!CIN || !firstName || !lastName || !gender || !birthDate || !phone || !email || !password || !confirmPassword) {
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
    const uploadDir = path.resolve('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const imageData = fs.readFileSync(path.resolve(uploadDir, req.file.filename));
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
    role,
  });

  try {
    await newUser.save();

    // Création du contenu HTML personnalisé
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Bienvenue, ${firstName} ! 🎉</h2>
        <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Mot de passe :</strong> ${password}</p>
        <p>Nous vous recommandons de modifier votre mot de passe après votre première connexion.</p>
        <p>Cordialement,<br>L'équipe Support</p>
      </div>
    `;
    // Envoi de l'email avec le contenu HTML
    const subject = "Votre compte a été créé avec succès";
    await sendEmailClient(email, subject, null, htmlContent, [], firstName, email, password);

    res.status(201).json({ message: "Utilisateur enregistré avec succès.", image: image });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
    res.status(500).json({ message: "Échec de l'enregistrement. Veuillez réessayer." });
  }
};

export const toggleUserStatus = async (req, res) => {
  const userId = req.params.id;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      user.isDisabled = !user.isDisabled;
      await user.save();    
      res.status(200).json({
          message: `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully`,
          user
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



export const changePassword = async (req, res) => {
  const userId = req.params.userId;
  const {currentPassword, newPassword } = req.body;
  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};