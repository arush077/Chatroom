import { useEffect, useRef } from 'react';

function AmbientBackground({ activityLevel = 'idle' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.3 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speedMultiplier = activityLevel === 'active' ? 1.5 : activityLevel === 'typing' ? 1.2 : 1;

      particles.forEach(p => {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${p.alpha})`;
        ctx.fill();
      });

      if (activityLevel === 'active' || activityLevel === 'typing') {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        const alpha = activityLevel === 'active' ? 0.15 : activityLevel === 'typing' ? 0.1 : 0.05;
        gradient.addColorStop(0, `rgba(220, 38, 38, ${alpha})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activityLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

export default AmbientBackground;