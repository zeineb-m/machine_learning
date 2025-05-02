import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import User from './routes/User.js';
import Project from './routes/Project.js';
import fileRoutes from "./routes/Files.js";
import Python from "./routes/python.js";
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";
import { exec } from 'child_process';
import path from "path";
import { fileURLToPath } from "url";
import axios from 'axios';
import grandLivreRoutes from "./routes/GrandLivre.js"; 
import balanceRoutes from "./routes/Balance.js";
import Budget from "./routes/Budget.js";
import BudgetVariance from "./routes/BudgetVariance.js";
import AccountingRoutes from './routes/AccountingTask.js';
import CashFlowRoutes from './routes/CashFlow.js';

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
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static("file"));


app.use("/api/auth", Auth);
app.use("/api/users", User);
app.use("/api/project", Project);
app.use("/api/files", fileRoutes);
app.use("/api/grandLivre", grandLivreRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/budget", Budget);
app.use("/api/budget-variance", BudgetVariance);
app.use("/api/accounting-task", AccountingRoutes);
app.use("/api/cashflow", CashFlowRoutes);

app.use("/python",Python);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});