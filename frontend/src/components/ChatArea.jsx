import { useRef, useEffect, useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

function ChatArea({ messages, users, currentUser, typingUsers, notifications, onOpenSidebar }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotifications(false), 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-noir-600/30 glass-heavy">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 -ml-2 text-noir-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-outfit font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              NoirChat
            </h1>
            <p className="text-xs text-noir-400">Global chatroom</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-noir-400">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          {users.length} online
        </div>
      </div>

      {showNotifications && notifications.length > 0 && (
        <div className="px-4 py-2 bg-crimson-600/10 border-b border-crimson-600/20">
          {notifications.map((notif, idx) => (
            <p key={idx} className="text-sm text-crimson-500 animate-fade-in">
              {notif.type === 'join' ? '↗' : '↙'} {notif.username} {notif.type === 'join' ? 'joined' : 'left'}
            </p>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, idx) => (
          <Message
            key={msg.id || idx}
            message={msg}
            isOwn={msg.userId === currentUser.id}
            showAvatar={
              idx === 0 ||
              messages[idx - 1]?.userId !== msg.userId
            }
          />
        ))}

        <TypingIndicator users={typingUsers} />

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatArea;