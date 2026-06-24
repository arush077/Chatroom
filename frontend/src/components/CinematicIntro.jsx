import { useState, useEffect } from 'react';

function CinematicIntro({ onEnter }) {
  const [phase, setPhase] = useState('fade-in');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('logo-reveal'), 800);
    const timer2 = setTimeout(() => setPhase('subtitle'), 2000);
    const timer3 = setTimeout(() => setPhase('button'), 2800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleEnter = () => {
    setPhase('exit');
    setTimeout(onEnter, 500);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-noir-900">
      <div className="absolute inset-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-noir-900" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div
          className={`transition-all duration-1000 $
            phase === 'fade-in' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          `}
        >
          <h1
            className={`text-6xl md:text-8xl font-outfit font-bold gradient-text transition-all duration-1000 $
              phase === 'logo-reveal' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            `}
            style={{
              textShadow: '0 0 60px rgba(220, 38, 38, 0.5)',
              filter: phase === 'logo-reveal' ? 'blur(10px)' : 'blur(0)'
            }
          >
            NoirChat
          </h1>
        </div>

        <p
          className={`mt-6 text-noir-400 text-lg md:text-xl font-dm transition-all duration-700 $
            phase === 'subtitle' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          `}
        >
          // Changed 'Where shadows converse' to 'Where shadows meet'
          Where shadows meet
        </p>

        <button
          onClick={handleEnter}
          className={`mt-12 px-8 py-3 gradient-bg text-white font-outfit font-semibold rounded-xl
            transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-crimson-600/40
            active:scale-95 group overflow-hidden relative $
              phase === 'button' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          `}
        >
          <span className="relative z-10">Enter Chatroom</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      <div
        className={`absolute bottom-8 left-0 right-0 text-center text-noir-500 text-sm transition-all duration-500 $
          phase === 'button' ? 'opacity-50' : 'opacity-0'
        `}
      >
        <p>Real-time messaging • Encrypted • Anonymous</p>
      </div>
    </div>
  );
}

export default CinematicIntro;
