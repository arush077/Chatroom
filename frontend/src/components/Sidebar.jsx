function Sidebar({ users, currentUser, onClose, soundEnabled, onToggleSound, onLogout }) {
  return (
    <div className="w-72 h-full glass-heavy flex flex-col">
      <div className="p-4 border-b border-noir-600/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-outfit font-semibold text-white">Online</h2>
          <span className="px-2 py-1 bg-crimson-600/20 text-crimson-500 text-xs rounded-full font-medium">
            {users.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-noir-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              u.id === currentUser.id
                ? 'bg-crimson-600/10 border border-crimson-600/20'
                : 'hover:bg-noir-700/50'
            }`}
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-outfit font-semibold ${
                  u.id === currentUser.id
                    ? 'gradient-bg text-white'
                    : 'bg-noir-700 text-noir-400'
                }`}
              >
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-noir-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {u.username}
                {u.id === currentUser.id && (
                  <span className="text-noir-400 text-xs ml-1">(you)</span>
                )}
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-noir-500 text-sm">No users online</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-noir-600/30 space-y-3">
        <button
          onClick={onToggleSound}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-noir-700/50 transition-colors"
        >
          <span className="text-sm text-noir-400">Sound effects</span>
          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              soundEnabled ? 'bg-crimson-600' : 'bg-noir-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-noir-600 text-noir-400 hover:border-crimson-600 hover:text-crimson-500 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Leave Chat</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;