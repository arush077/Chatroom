import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import AmbientBackground from './AmbientBackground';

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
  const [activityLevel, setActivityLevel] = useState('idle');
  const [lastMessageId, setLastMessageId] = useState(null);

  const notificationTimeoutRef = useRef({});
  const activityTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef({});

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

    socket.on('presenceUpdate', (data) => {
      setUsers(data.users);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      setLastMessageId(message.id);

      if (soundEnabled && message.userId !== user.id) {
        playMessageSound();
      }

      setActivityLevel('active');
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = setTimeout(() => setActivityLevel('idle'), 2000);

      if (typingTimeoutRef.current[message.userId]) {
        clearTimeout(typingTimeoutRef.current[message.userId]);
        delete typingTimeoutRef.current[message.userId];
      }
      setTypingUsers((prev) => prev.filter(u => u.id !== message.userId));

      socket.emit('markAllRead');
    });

    socket.on('messageStatus', ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
    });

    socket.on('reactionUpdate', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    socket.on('userTyping', ({ userId, username }) => {
      setTypingUsers((prev) => {
        if (!prev.find(u => u.id === userId)) {
          return [...prev, { id: userId, username }];
        }
        return prev;
      });
      setActivityLevel('typing');

      if (typingTimeoutRef.current[userId]) {
        clearTimeout(typingTimeoutRef.current[userId]);
      }
      typingTimeoutRef.current[userId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter(u => u.id !== userId));
      }, 3000);
    });

    socket.on('userStoppedTyping', ({ userId }) => {
      if (typingTimeoutRef.current[userId]) {
        clearTimeout(typingTimeoutRef.current[userId]);
        delete typingTimeoutRef.current[userId];
      }
      setTypingUsers((prev) => prev.filter(u => u.id !== userId));
      setActivityLevel('idle');
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
      socket.off('presenceUpdate');
      socket.off('message');
      socket.off('messageStatus');
      socket.off('reactionUpdate');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('notification');
    };
  }, [socket, user.id, soundEnabled]);

  const playMessageSound = () => {
    try {
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
    } catch (e) {}
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('noirchat-sound', String(newValue));
  };

  const addReaction = (messageId, emoji) => {
    if (socket?.connected) {
      socket.emit('addReaction', { messageId, emoji });
    }
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="h-screen w-screen flex bg-noir-900 overflow-hidden relative">
      <AmbientBackground activityLevel={activityLevel} />

      <div
        className={`fixed md:relative z-40 md:z-auto transition-all duration-300 ${
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

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <ChatArea
          messages={messages}
          users={users}
          currentUser={user}
          typingUsers={typingUsers}
          notifications={notifications}
          onOpenSidebar={() => setSidebarOpen(true)}
          onAddReaction={addReaction}
          onReply={(msg) => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, replyingTo: msg } : m))}
          onScrollToMessage={scrollToMessage}
          lastMessageId={lastMessageId}
        />
      </div>
    </div>
  );
}

export default ChatLayout;