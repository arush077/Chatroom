import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map();
const messages = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', ({ username }) => {
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);

    if (!sanitizedUsername || sanitizedUsername.length < 2) {
      socket.emit('error', { message: 'Username must be 2-20 characters' });
      return;
    }

    const existingUser = Array.from(users.values()).find(u => u.username === sanitizedUsername);
    if (existingUser) {
      socket.emit('error', { message: 'Username already taken' });
      return;
    }

    users.set(socket.id, {
      id: socket.id,
      username: sanitizedUsername
    });

    socket.emit('joined', {
      user: users.get(socket.id),
      users: Array.from(users.values()),
      messages: messages.slice(-100)
    });

    socket.broadcast.emit('userJoined', {
      user: users.get(socket.id),
      users: Array.from(users.values())
    });

    socket.broadcast.emit('notification', {
      type: 'join',
      username: sanitizedUsername
    });
  });

  socket.on('message', (data) => {
    const user = users.get(socket.id);
    if (!user || !data.message?.trim()) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: socket.id,
      username: user.username,
      message: data.message.trim(),
      timestamp: new Date().toISOString()
    };

    messages.push(message);
    if (messages.length > 500) messages.shift();

    io.emit('message', message);
  });

  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('userTyping', { username: user.username });
    }
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStoppedTyping');
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);

      io.emit('userLeft', {
        user,
        users: Array.from(users.values())
      });

      io.emit('notification', {
        type: 'leave',
        username: user.username
      });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});