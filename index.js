import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import UserRoute from './routes/User.js';
import ProjectRoute from './routes/Project.js';
import fileRoutes from "./routes/Files.js";
import Python from "./routes/python.js";
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import grandLivreRoutes from "./routes/GrandLivre.js"; 
import balanceRoutes from "./routes/Balance.js";
import Budget from "./routes/Budget.js";
import BudgetVariance from "./routes/BudgetVariance.js";
import AccountingRoutes from './routes/AccountingTask.js';
import CashFlowRoutes from './routes/CashFlow.js';
import MessageRoutes from "./routes/Message.js";
import ReclamationRoutes from "./routes/Reclamation.js";
import { setupMessageSocket } from './sockets/messageSocket.js';
import { setupCallSocket, activeCalls } from './sockets/callSocket.js';
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDatabase();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

setupMessageSocket(io);
setupCallSocket(io);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.static('public'));
configDotenv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static("file"));

app.use("/api/auth", Auth);
app.use("/api/users", UserRoute);
app.use("/api/project", ProjectRoute);
app.use("/api/files", fileRoutes);
app.use("/api/grandLivre", grandLivreRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/budget", Budget);
app.use("/api/budget-variance", BudgetVariance);
app.use("/api/accounting-task", AccountingRoutes);
app.use("/api/cashflow", CashFlowRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/claims", ReclamationRoutes);
app.use("/python", Python);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    activeCalls: activeCalls.size
  });
});

export { io };