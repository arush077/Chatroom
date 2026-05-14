import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import MessageReactions from './MessageReactions';

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '🔥', '👀', '🎉', '👍'];

function Message({
  id,
  message,
  isOwn,
  showAvatar,
  onAddReaction,
  onReply,
  onScrollToOriginal,
  isNew
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const reactions = message.reactions || {};
  const reactionCounts = Object.entries(reactions).flatMap(([user, emojis]) =>
    emojis.map(e => ({ emoji: e, user }))
  );

  return (
    <div
      id={id}
      className={`flex gap-3 message-enter relative ${isOwn ? 'flex-row-reverse' : ''} ${isNew ? 'message-glow' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-noir-700 flex items-center justify-center text-xs font-outfit font-semibold text-noir-400 flex-shrink-0">
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}

      {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}

      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && showAvatar && (
          <p className="text-xs text-noir-400 mb-1 ml-1">{message.username}</p>
        )}

        {message.replyTo && (
          <div
            className="reply-preview px-3 py-2 mb-1 bg-noir-800/50 rounded-lg cursor-pointer"
            onClick={() => onScrollToOriginal?.(message.replyTo.id)}
          >
            <p className="text-xs text-crimson-500 font-medium">
              Replying to {message.replyTo.username}
            </p>
            <p className="text-sm text-noir-400 truncate">{message.replyTo.message}</p>
          </div>
        )}

        <div
          className={`relative px-4 py-2.5 rounded-2xl group ${
            isOwn
              ? 'gradient-bg text-white rounded-br-md'
              : 'bg-noir-700/80 text-white rounded-bl-md'
          }`}
        >
          {showActions && (
            <div className={`absolute -top-10 flex gap-1 p-1 rounded-lg bg-noir-800 shadow-lg animate-fade-in z-20 ${isOwn ? 'right-0' : 'left-0'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReply?.();
                  setShowActions(false);
                }}
                className="p-1.5 hover:bg-noir-700 rounded transition-colors"
                title="Reply"
              >
                <svg className="w-4 h-4 text-noir-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionPicker(!showReactionPicker);
                }}
                className="p-1.5 hover:bg-noir-700 rounded transition-colors"
                title="React"
              >
                <svg className="w-4 h-4 text-noir-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}

          {showReactionPicker && (
            <div className={`absolute -top-12 ${isOwn ? 'right-0' : 'left-0'} z-30`}>
              <div className="flex gap-1 p-2 bg-noir-800 rounded-lg shadow-lg animate-fade-in border border-noir-600">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddReaction?.(message.id, emoji);
                      setShowReactionPicker(false);
                      setShowActions(false);
                    }}
                    className="p-1.5 hover:bg-noir-700 rounded transition-colors reaction-pop text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
        </div>

        {reactionCounts.length > 0 && (
          <MessageReactions reactions={reactionCounts} isOwn={isOwn} />
        )}

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end mr-1' : 'ml-1'}`}>
          <span className="text-xs text-noir-500">{formatTime(message.timestamp)}</span>
          {isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}

function MessageStatus({ status }) {
  switch (status) {
    case 'sent':
      return (
        <svg className="w-4 h-4 text-noir-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'delivered':
      return (
        <div className="read-receipt text-noir-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'seen':
      return (
        <div className="read-receipt text-green-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export default Message;