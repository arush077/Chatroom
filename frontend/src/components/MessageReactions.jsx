function MessageReactions({ reactions, isOwn }) {
  const groupedReactions = reactions.reduce((acc, { emoji, user }) => {
    if (!acc[emoji]) acc[emoji] = [];
    acc[emoji].push(user);
    return acc;
  }, {});

  const reactionList = Object.entries(groupedReactions).map(([emoji, users]) => ({
    emoji,
    count: users.length,
    users
  }));

  if (reactionList.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {reactionList.map(({ emoji, count, users }) => (
        <button
          key={emoji}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-noir-700/60 rounded-full text-xs hover:bg-noir-600 transition-colors"
        >
          <span>{emoji}</span>
          <span className="text-noir-400">{count}</span>
        </button>
      ))}
    </div>
  );
}

export default MessageReactions;