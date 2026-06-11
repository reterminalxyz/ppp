import React, { useEffect, useMemo } from 'react';

// Simple Neon Cactus SVG Component
const NeonCactus = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 150" className="w-full h-full" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
    <path d="M50,140 L50,20 M50,90 C20,90 20,60 20,40 M50,110 C80,110 80,80 80,50" />
  </svg>
);

const App: React.FC = () => {
  // Generate random falling cacti
  const cacti = useMemo(() => {
    const colors = ['#FF1493', '#39FF14', '#FF8C00', '#00FFFF', '#FF00FF'];
    return Array.from({ length: 35 }).map((_, i) => {
      const startRot = Math.random() * 360;
      const endRot = startRot + (Math.random() > 0.5 ? 360 : -360);
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
        animationDelay: `-${Math.random() * 25}s`, // Negative delay to start already on screen
        scale: Math.random() * 0.8 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        startRot,
        endRot,
      };
    });
  }, []);

  // Optional: Add a chaotic audio context if the user clicks anywhere
  useEffect(() => {
    let audioCtx: AudioContext | null = null;

    const playNoise = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bufferSize = audioCtx.sampleRate * 0.3; // 0.3 seconds of noise
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      // Add a filter to make it sound more "glitchy" and distant
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = Math.random() * 3000 + 300;
      filter.Q.value = Math.random() * 5;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Very quiet
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseSource.start();
    };

    window.addEventListener('click', playNoise);
    window.addEventListener('touchstart', playNoise);

    return () => {
      window.removeEventListener('click', playNoise);
      window.removeEventListener('touchstart', playNoise);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden trippy-bg">
      
      {/* Slow pulsing colored orbs in the background (z-0) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mex-pink rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mex-orange rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow z-0" style={{ animationDelay: '2s' }}></div>

      {/* Noise Pattern Overlay (z-10) */}
      <div className="absolute inset-0 pointer-events-none noise-bg mix-blend-overlay opacity-30 z-10"></div>

      {/* Falling Cacti (z-20) - Behind the text and vignette */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {cacti.map(c => (
          <div 
            key={c.id} 
            className="falling-cactus" 
            style={{
              left: c.left,
              animationDuration: c.animationDuration,
              animationDelay: c.animationDelay,
              width: `${c.scale * 60}px`,
              height: `${c.scale * 90}px`,
              '--start-rot': `${c.startRot}deg`,
              '--end-rot': `${c.endRot}deg`
            } as React.CSSProperties}
          >
            <NeonCactus color={c.color} />
          </div>
        ))}
      </div>

      {/* Vignette to focus on center (z-30) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-30 opacity-80"></div>

      {/* Main Text (z-40) */}
      <div className="relative z-40 text-center w-full px-6 pointer-events-none">
        <h1 
          className="text-5xl sm:text-7xl md:text-[8vw] font-display uppercase leading-tight tracking-widest glitch-readable break-words" 
          data-text="Sono un tossico fallito"
        >
          Sono un tossico fallito
        </h1>
      </div>
      
      {/* Scanlines (z-50) - Topmost layer */}
      <div className="absolute inset-0 pointer-events-none scanlines z-50"></div>
      
    </div>
  );
};

export default App;
