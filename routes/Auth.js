import { registerUser , login, checkMail , forgotPassword , resetPassword } from '../controllers/Auth.js';
import { Router } from 'express';
import { sendEmail, verifyCode } from '../services/emailService.js';


import multer from 'multer';

const router = Router();

// Configuration de multer pour gérer les fichiers téléchargés
const upload = multer({ dest: 'uploads/' });

// Route pour l'inscription
router.post("/register", upload.single("image"), registerUser);
// router.route("/register").post(registerUser) ;
router.route("/login").post(login) ;

router.route("/send").post(sendEmail) ;

router.route("/verify").post(verifyCode) ;
router.route("/check").post(checkMail) ;

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router;