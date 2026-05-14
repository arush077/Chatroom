import { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

function ChatArea({
  messages,
  users,
  currentUser,
  typingUsers,
  notifications,
  onOpenSidebar,
  onAddReaction,
  onReply,
  onScrollToMessage,
  lastMessageId
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(true);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotifications(false), 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const handleSendReply = useCallback((message, replyText) => {
    setReplyTo(null);
    window.__socket?.emit('message', {
      message: replyText,
      replyTo: {
        id: message.id,
        username: message.username,
        message: message.message.substring(0, 50)
      }
    });
  }, []);

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
            <p className="text-xs text-noir-400">Global chatroom • {users.length} online</p>
          </div>
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
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages.map((msg, idx) => (
          <Message
            key={msg.id}
            id={`message-${msg.id}`}
            message={msg}
            isOwn={msg.userId === currentUser.id}
            showAvatar={idx === 0 || messages[idx - 1]?.userId !== msg.userId}
            onAddReaction={onAddReaction}
            onReply={() => {
              setReplyTo(msg);
              onReply(msg);
            }}
            onScrollToOriginal={onScrollToMessage}
            isNew={msg.id === lastMessageId}
          />
        ))}

        <TypingIndicator users={typingUsers} usersData={users} />

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        replyTo={replyTo}
        onCancelReply={() => {
          setReplyTo(null);
          onReply(null);
        }}
        onSendReply={handleSendReply}
      />
    </div>
  );
}

export default ChatArea;