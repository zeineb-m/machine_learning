import { User } from "../models/User.js"
import bcrypt from "bcrypt" ;
import zxcvbn from 'zxcvbn';
import path from 'path'
import fs from 'fs';
import multer from 'multer';
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
    role, // Le rôle est passé ici
  } = req.body;

  // Liste des rôles autorisés
  const validRoles = ['accountant', 'financial manager', 'auditeur', 'manager controller'];

  // Vérification que le rôle fourni est valide
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide. Veuillez choisir un rôle parmi : accountant, financial manager, auditeur, manager controller." });
  }

  // Vérifier que tous les champs obligatoires sont présents
  if (
    !CIN || !firstName || !lastName || !gender || !birthDate || !phone ||
    !email || !password || !confirmPassword
  ) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
  }

  // Vérification de la correspondance des mots de passe
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
  }

  // Vérification de la complexité du mot de passe
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return res.status(400).json({ message: "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus complexe." });
  }

  // Vérification si l'utilisateur existe déjà
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Optionnel : Traitement de l'image si un fichier est envoyé
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

  // Création du nouvel administrateur avec le rôle spécifié
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
    role: role, // Rôle dynamique en fonction de la requête
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "Utilisateur enregistré avec succès.", image: image });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
    res.status(500).json({ message: "Échec de l'enregistrement. Veuillez réessayer." });
  }
};