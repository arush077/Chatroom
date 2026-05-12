function TypingIndicator({ users }) {
  if (users.length === 0) return null;

  let text;
  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`;
  } else {
    text = `${users[0]} and ${users.length - 1} others are typing`;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-noir-400 animate-fade-in">
      <div className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span>{text}...</span>
    </div>
  );
}

export default TypingIndicator;