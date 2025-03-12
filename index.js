import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import User from './routes/User.js';
import Project from './routes/Project.js';
import fileRoutes from "./routes/Files.js";
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
connectDatabase();

const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.static('public'));

configDotenv();


const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static("file"));


app.use("/api/auth", Auth);
app.use("/api/users", User);
app.use("/api/project", Project);
app.use("/api/files", fileRoutes);


app.get('/generate-bilan', (req, res) => {
  const projectId = req.query.project_id;  
  if (!projectId) {
    return res.status(400).send('Project ID is required');
  }

  exec(`python3 C:\\fichier python\\bilan.py ${projectId}`, (err, stdout, stderr) => {
      if (err) {
          console.error(`Erreur lors de l'exécution du script: ${stderr}`);
          return res.status(500).send('Erreur interne');
      }

      try {
          const bilan = JSON.parse(stdout);  
          res.json(bilan);  
      } catch (e) {
          console.error("Erreur de parsing JSON", e);
          return res.status(500).send('Erreur dans la génération du bilan');
      }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});