import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import User from './routes/User.js';
import { Server as SocketIOServer } from 'socket.io';
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";

connectDatabase();

const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.static('public'));

configDotenv();

const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use((req, res, next) => {
  req.io = io;
  return next();
});

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/auth", Auth);
app.use("/api/users", User);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
