import express from 'express';
import { configDotenv } from 'dotenv';
import Auth from './routes/Auth.js';
import User from './routes/User.js';
import TicketRoute from './routes/TicketRoute.js';
import { Server as SocketIOServer } from 'socket.io';
import { connectDatabase } from './database/dbConnect.js';
import http from "http";
import cors from "cors";
import { Ticket } from './models/Ticket.js';

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
app.use("/api/tickets", TicketRoute);

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('setName', (name) => {
    users[socket.id] = name;
    io.emit('userConnected', { id: socket.id, name });
    console.log(`${name} connected (${socket.id})`);
  });

  socket.on('typing', (isTyping) => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit('typing', { name, isTyping });
    }
  });

  socket.on('message', (message) => {
    const name = users[socket.id];
    if (name) {
      io.emit('message', { name, message });
      console.log(`${name}: ${message}`);
    }
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      io.emit('userDisconnected', { id: socket.id, name });
      console.log(`${name} disconnected (${socket.id})`);
      delete users[socket.id];
    }
  });

  socket.on('demande' , async () => {
    const tickets = await Ticket.find({capacity: 0});
    io.emit('ticketsWhoHave0Capacity', tickets);
    console.log('Tickets with 0 capacity:', tickets);
  })

});




server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
