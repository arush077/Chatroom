import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

function ChatLayout({ socket, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('noirchat-sound');
    return saved !== 'false';
  });

  const notificationTimeoutRef = useRef({});

  useEffect(() => {
    if (!socket) return;

    socket.on('joined', (data) => {
      setUsers(data.users);
      setMessages(data.messages || []);
    });

    socket.on('userJoined', (data) => {
      setUsers(data.users);
    });

    socket.on('userLeft', (data) => {
      setUsers(data.users);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      if (soundEnabled && message.userId !== user.id) {
        playMessageSound();
      }
    });

    socket.on('userTyping', ({ username }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    });

    socket.on('userStoppedTyping', () => {
      setTypingUsers([]);
    });

    socket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);

      if (notificationTimeoutRef.current[notification.username]) {
        clearTimeout(notificationTimeoutRef.current[notification.username]);
      }

      notificationTimeoutRef.current[notification.username] = setTimeout(() => {
        setNotifications((prev) => prev.filter(n => n.username !== notification.username));
      }, 3000);
    });

    return () => {
      socket.off('joined');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('message');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('notification');
    };
  }, [socket, user.id, soundEnabled]);

  const playMessageSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('noirchat-sound', String(newValue));
  };

  return (
    <div className="h-screen w-screen flex bg-noir-900 overflow-hidden">
      <div
        className={`fixed md:relative z-40 md:z-auto inset-0 md:inset-auto transition-all duration-300 ${
          sidebarOpen ? 'inset-0 bg-noir-900/80 md:bg-transparent' : 'pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed md:relative z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          users={users}
          currentUser={user}
          onClose={() => setSidebarOpen(false)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onLogout={onLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          messages={messages}
          users={users}
          currentUser={user}
          typingUsers={typingUsers}
          notifications={notifications}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>
    </div>
  );
}

export default ChatLayout;