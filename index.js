import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import User from './routes/User.js';
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";


connectDatabase();

const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.static('public'));

configDotenv();


const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/auth", Auth);
app.use("/api/users", User);
app.post('/api/auth/verify-otp', (req, res) => {
    const { otp, secret } = req.body;
    const isValid = speakeasy.authenticator.check(otp, secret);
  
    if (isValid) {
      res.json({ message: 'OTP validé avec succès.' });
    } else {
      res.status(400).json({ message: 'Code OTP invalide.' });
    }
  });


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});