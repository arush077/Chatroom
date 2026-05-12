import { useState, useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';

function MessageInput() {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  useEffect(() => {
    const socket = window.__socket;
    if (!socket) return;

    if (message) {
      socket.emit('typing');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping');
      }, 1000);
    } else {
      socket.emit('stopTyping');
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message]);

  const handleSend = () => {
    if (!message.trim()) return;

    const socket = window.__socket;
    if (socket) {
      socket.emit('message', { message: message.trim() });
      socket.emit('stopTyping');
    }

    setMessage('');
    setShowEmoji(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-noir-600/30 glass-heavy">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          {showEmoji && (
            <div className="absolute bottom-full mb-2 left-0">
              <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute left-3 bottom-3 p-1.5 text-noir-400 hover:text-crimson-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full pl-12 pr-4 py-3 bg-noir-800/50 border border-noir-600 rounded-xl text-white placeholder-noir-500 focus:outline-none focus:border-crimson-600 input-glow transition-all duration-300 resize-none min-h-[48px] max-h-[120px]"
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 gradient-bg rounded-xl text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-crimson-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MessageInput;