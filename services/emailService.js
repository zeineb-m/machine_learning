import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const sendEmailForgetPassword = async (to, subject, text, html, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text, // Use HTML content if provided, otherwise use text
      attachments, // Add attachments support
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

// Fonction pour générer un code de vérification
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

// Stockage temporaire des codes de vérification
const verificationCache = new Map();

export const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Missing required field: email" });
    }

    // Générer un code de vérification
    const verificationCode = generateVerificationCode();
    console.log("Génération du code:", verificationCode, "pour", email);

    // Stocker le code dans le cache avec l'email comme clé
    verificationCache.set(email, verificationCode);
    console.log("Cache après stockage:", verificationCache);

    // Créer un transporteur de messagerie
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Définir les options de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    // Supprimer le code après 5 minutes
    setTimeout(() => {
      console.log("Suppression du code après expiration:", verificationCode);
      verificationCache.delete(email);
    }, 5 * 60 * 1000); // 5 minutes

    res.status(200).json({ message: "Verification code sent successfully" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email." });
  }
};

// Service de vérification du code
export const verifyCode = (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    console.log("Code reçu pour vérification:", verificationCode);
    console.log("Cache actuel :", verificationCache);

    if (!email || !verificationCode) {
      return res.status(400).json({ message: "L'email et le code de vérification sont requis." });
    }

    // Récupérer le code stocké pour cet email
    const storedCode = verificationCache.get(email);

    if (!storedCode || storedCode !== verificationCode) {
      console.log("Code incorrect ou expiré !");
      return res.status(400).json({ message: "Code de vérification invalide ou expiré." });
    }

    // Supprimer le code après vérification réussie
    verificationCache.delete(email);

    return res.status(200).json({ message: "Vérification réussie. Vous pouvez maintenant procéder à l'inscription." });

  } catch (error) {
    console.error("Erreur lors de la vérification du code :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

export const sendEmailClient = async (to, firstName, email, password) => {
  try {
    // Création du transporteur pour Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Utiliser l'email de votre compte Gmail
        pass: process.env.EMAIL_PASS, // Utiliser le mot de passe de votre compte Gmail
      },
    });

    const subject = "Votre compte a été créé avec succès";
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

    // Envoi de l'email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // L'email de l'expéditeur
      to,                            // L'email du destinataire
      subject,                       // Le sujet de l'email
      html: htmlContent,             // Le contenu HTML de l'email
    });

    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Échec de l'envoi de l'email");
  }
};