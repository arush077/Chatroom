import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

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
const userLastActivity = new Map();

const getUserPresence = (userId) => {
  const lastActivity = userLastActivity.get(userId);
  if (!lastActivity) return 'offline';

  const now = Date.now();
  const diff = now - lastActivity;

  if (diff < 60000) return 'active';
  if (diff < 300000) return 'idle';
  return 'offline';
};

const broadcastPresence = () => {
  const usersWithPresence = Array.from(users.values()).map(user => ({
    ...user,
    presence: getUserPresence(user.id),
    lastSeen: userLastActivity.get(user.id) || null
  }));
  io.emit('presenceUpdate', { users: usersWithPresence });
};

setInterval(broadcastPresence, 5000);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', ({ username }) => {
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);

    if (!sanitizedUsername || sanitizedUsername.length < 2) {
      socket.emit('error', { message: 'Username must be 2-20 characters' });
      return;
    }

    const existingUser = Array.from(users.values()).find(u => 
      u.username.toLowerCase() === sanitizedUsername.toLowerCase()
    );
    if (existingUser) {
      socket.emit('error', { message: 'Username already taken' });
      return;
    }

    const user = {
      id: socket.id,
      username: sanitizedUsername,
      presence: 'active',
      lastSeen: null
    };

    users.set(socket.id, user);
    userLastActivity.set(socket.id, Date.now());

    const userMessages = messages.slice(-100).map(msg => ({
      ...msg,
      reactions: msg.reactions || {},
      replyTo: msg.replyTo || null,
      status: 'seen'
    }));

    const allUsers = Array.from(users.values()).map(u => ({
      ...u,
      presence: getUserPresence(u.id),
      lastSeen: userLastActivity.get(u.id) || null
    }));

    socket.emit('joined', {
      user: user,
      users: allUsers,
      messages: userMessages
    });

    socket.broadcast.emit('userJoined', {
      user: user,
      users: allUsers
    });

    socket.broadcast.emit('notification', {
      type: 'join',
      username: sanitizedUsername
    });

    broadcastPresence();
  });

  socket.on('activity', () => {
    const user = users.get(socket.id);
    if (user) {
      userLastActivity.set(socket.id, Date.now());
      if (user.presence !== 'active') {
        user.presence = 'active';
        broadcastPresence();
      }
    }
  });

  socket.on('message', (data) => {
    const user = users.get(socket.id);
    if (!user || !data.message?.trim()) return;

    userLastActivity.set(socket.id, Date.now());
    user.presence = 'active';

    socket.broadcast.emit('userStoppedTyping', { userId: socket.id });

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: socket.id,
      username: user.username,
      message: data.message.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
      replyTo: data.replyTo || null,
      status: 'sent'
    };

    messages.push(message);
    if (messages.length > 500) messages.shift();

    io.emit('message', message);

    setTimeout(() => {
      const msgIndex = messages.findIndex(m => m.id === message.id);
      if (msgIndex !== -1) {
        messages[msgIndex].status = 'delivered';
        io.emit('messageStatus', { messageId: message.id, status: 'delivered' });
      }
    }, 500);
  });

  socket.on('typing', () => {
    const user = users.get(socket.id);
    if (user) {
      userLastActivity.set(socket.id, Date.now());
      socket.broadcast.emit('userTyping', { userId: socket.id, username: user.username });
    }
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStoppedTyping', { userId: socket.id });
  });

  socket.on('addReaction', ({ messageId, emoji }) => {
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const user = users.get(socket.id);
    if (!user) return;

    const username = user.username;
    
    if (!messages[msgIndex].reactions[username]) {
      messages[msgIndex].reactions[username] = [];
    }

    const existingIndex = messages[msgIndex].reactions[username].indexOf(emoji);
    if (existingIndex === -1) {
      messages[msgIndex].reactions[username].push(emoji);
    } else {
      messages[msgIndex].reactions[username].splice(existingIndex, 1);
      if (messages[msgIndex].reactions[username].length === 0) {
        delete messages[msgIndex].reactions[username];
      }
    }

    io.emit('reactionUpdate', {
      messageId,
      reactions: messages[msgIndex].reactions
    });
  });

  socket.on('markRead', ({ messageId }) => {
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const user = users.get(socket.id);
    if (!user) return;

    messages[msgIndex].status = 'seen';
    io.emit('messageStatus', { messageId, status: 'seen', userId: socket.id });
  });

  socket.on('markAllRead', () => {
    const user = users.get(socket.id);
    if (!user) return;

    messages.forEach((msg, idx) => {
      if (msg.userId !== socket.id) {
        messages[idx].status = 'seen';
        io.emit('messageStatus', { messageId: msg.id, status: 'seen', userId: socket.id });
      }
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      
      const remainingUsers = Array.from(users.values()).map(u => ({
        ...u,
        presence: getUserPresence(u.id),
        lastSeen: userLastActivity.get(u.id) || null
      }));

      io.emit('userLeft', {
        user: { ...user, presence: 'offline', lastSeen: Date.now() },
        users: remainingUsers
      });

      io.emit('notification', {
        type: 'leave',
        username: user.username
      });

      broadcastPresence();
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});