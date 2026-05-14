import { useState, useEffect, useRef } from 'react';

function JoinScreen({ socket, onJoin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!socket) return;

    const onError = (data) => {
      setError(data.message);
      setIsLoading(false);
    };

    const onJoined = (data) => {
      if (!joinedRef.current) {
        joinedRef.current = true;
        setIsLoading(false);
        onJoin(data.user);
      }
    };

    socket.on('error', onError);
    socket.on('joined', onJoined);

    return () => {
      socket.off('error', onError);
      socket.off('joined', onJoined);
    };
  }, [socket, onJoin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2 || trimmed.length > 20) {
      setError('Username must be 2-20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Only letters, numbers, and underscores allowed');
      return;
    }

    setError('');
    setIsLoading(true);
    joinedRef.current = false;
    socket.emit('join', { username: trimmed });
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-noir-900">
      <div className="absolute inset-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)',
          }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-outfit font-bold gradient-text mb-2">
              NoirChat
            </h1>
            <p className="text-noir-400 text-sm md:text-base">
              Enter the shadows. Speak freely.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-noir-400 mb-2 font-medium">
                  Your Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter username..."
                  className="w-full px-4 py-3 bg-noir-800/50 border border-noir-600 rounded-xl text-white placeholder-noir-500 focus:outline-none focus:border-crimson-600 input-glow transition-all duration-300"
                  autoFocus
                  maxLength={20}
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500 animate-fade-in">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="w-full py-3 px-6 gradient-bg text-white font-outfit font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-crimson-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Join Chat'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-noir-600/50">
              <p className="text-xs text-noir-500 text-center">
                2-20 characters • Letters, numbers, underscores
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-noir-500 text-xs">
              Real-time messaging • No registration required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinScreen;