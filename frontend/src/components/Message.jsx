import { formatTime } from '../utils/formatTime';

function Message({ message, isOwn, showAvatar }) {
  return (
    <div
      className={`flex gap-3 message-enter ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
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

        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'gradient-bg text-white rounded-br-md'
              : 'bg-noir-700/80 text-white rounded-bl-md'
          }`}
        >
          <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
        </div>

        <p className={`text-xs text-noir-500 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default Message;