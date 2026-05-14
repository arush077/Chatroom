function TypingIndicator({ users, usersData = [] }) {
  if (users.length === 0) return null;

  const getUserName = (userId) => {
    const user = usersData.find(u => u.id === userId);
    return user?.username || 'Someone';
  };

  let text;
  if (users.length === 1) {
    text = `${getUserName(users[0].id)} is typing`;
  } else if (users.length === 2) {
    text = `${getUserName(users[0].id)} and ${getUserName(users[1].id)} are typing`;
  } else {
    text = `${getUserName(users[0].id)} and ${users.length - 1} others are typing`;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-noir-400 animate-fade-in">
      <div className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="text-crimson-500">{text}...</span>
    </div>
  );
}

export default TypingIndicator;