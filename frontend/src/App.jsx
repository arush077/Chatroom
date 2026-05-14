import { useState, useEffect } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatLayout from './components/ChatLayout';
import CinematicIntro from './components/CinematicIntro';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('activity');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    const activityInterval = setInterval(() => {
      newSocket.emit('activity');
    }, 30000);

    return () => {
      clearInterval(activityInterval);
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      window.__socket = socket;
    }
  }, [socket, user]);

  const handleJoin = (userData) => {
    if (userData) {
      setUser(userData);
      window.__socket = socket;
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });
      setSocket(newSocket);
      setIsConnected(false);
      setUser(null);
    }
  };

  const handleEnterChat = () => {
    setIntroComplete(true);
    setTimeout(() => setShowIntro(false), 500);
  };

  if (showIntro && !introComplete) {
    return <CinematicIntro onEnter={handleEnterChat} />;
  }

  if (!user) {
    return <JoinScreen socket={socket} onJoin={handleJoin} />;
  }

  return <ChatLayout socket={socket} user={user} onLogout={handleLogout} />;
}

export default App;