import { useState, useEffect } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatLayout from './components/ChatLayout';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      window.__socket = socket;
    }
  }, [socket, user]);

  const handleJoin = (username) => {
    if (socket) {
      socket.emit('join', { username });
      socket.on('joined', (data) => {
        setUser(data.user);
        window.__socket = socket;
      });
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
      setIsConnected(false);
      setUser(null);
    }
  };

  if (!user) {
    return <JoinScreen socket={socket} onJoin={handleJoin} />;
  }

  return <ChatLayout socket={socket} user={user} onLogout={handleLogout} />;
}

export default App;