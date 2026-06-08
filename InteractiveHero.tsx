import React, { useRef } from 'react';

// Surreal, artsy, and larger SVG Cactus
const SurrealCactusSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 600" className={`w-full h-full drop-shadow-[0_0_25px_rgba(255,20,147,0.6)] ${className}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Psychedelic Gradients */}
      <linearGradient id="cactusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#39FF14" />
        <stop offset="40%" stopColor="#008000" />
        <stop offset="80%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
      <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Geometric Halos / Rings (Behind) */}
    <ellipse cx="200" cy="400" rx="160" ry="40" fill="none" stroke="#00FFFF" strokeWidth="4" transform="rotate(-15 200 400)" filter="url(#glow)"/>

    {/* Floating Left Arm */}
    <path d="M 110 320 C 40 320, 30 200, 30 120 C 30 90, 80 90, 80 120 C 80 220, 90 260, 110 260 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6" filter="url(#glow)"/>
    {/* Floating Right Arm */}
    <path d="M 290 380 C 360 380, 370 260, 370 180 C 370 150, 320 150, 320 180 C 320 280, 310 320, 290 320 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6" filter="url(#glow)"/>

    {/* Main Trunk */}
    <rect x="130" y="100" width="140" height="420" rx="70" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6"/>
    
    {/* Ribs */}
    <path d="M 165 105 L 165 515" stroke="#1A0B0C" strokeWidth="4" fill="none" opacity="0.5"/>
    <path d="M 200 100 L 200 520" stroke="#1A0B0C" strokeWidth="6" fill="none" opacity="0.6"/>
    <path d="M 235 105 L 235 515" stroke="#1A0B0C" strokeWidth="4" fill="none" opacity="0.5"/>

    {/* Melting Base */}
    <path d="M 130 480 C 130 580, 270 580, 270 480 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6"/>

    {/* Geometric Halos / Rings (Front) */}
    <ellipse cx="200" cy="150" rx="120" ry="25" fill="none" stroke="#FF8C00" strokeWidth="6" transform="rotate(15 200 150)" filter="url(#glow)"/>

    {/* The All-Seeing Eye in the center */}
    <g transform="translate(200, 250)">
      <ellipse cx="0" cy="0" rx="45" ry="25" fill="#fff" stroke="#1A0B0C" strokeWidth="5"/>
      <circle cx="0" cy="0" r="14" fill="url(#eyeGrad)" />
      <circle cx="0" cy="0" r="5" fill="#1A0B0C" />
      {/* Eyelid crease */}
      <path d="M -45 0 C -20 -35, 20 -35, 45 0" fill="none" stroke="#FF1493" strokeWidth="3" opacity="0.8"/>
    </g>

    {/* Spines (Needle clusters) */}
    <g stroke="#fff" strokeWidth="2" opacity="0.9">
      {/* Left side trunk */}
      <path d="M 130 180 L 115 170 M 130 180 L 115 190 M 130 180 L 110 180" />
      <path d="M 130 300 L 115 290 M 130 300 L 115 310 M 130 300 L 110 300" />
      <path d="M 130 420 L 115 410 M 130 420 L 115 430 M 130 420 L 110 420" />
      {/* Right side trunk */}
      <path d="M 270 220 L 285 210 M 270 220 L 285 230 M 270 220 L 290 220" />
      <path d="M 270 340 L 285 330 M 270 340 L 285 350 M 270 340 L 290 340" />
      <path d="M 270 460 L 285 450 M 270 460 L 285 470 M 270 460 L 290 460" />
      {/* Left Arm */}
      <path d="M 30 150 L 15 140 M 30 150 L 15 160 M 30 150 L 10 150" />
      <path d="M 80 150 L 95 140 M 80 150 L 95 160 M 80 150 L 100 150" />
      {/* Right Arm */}
      <path d="M 370 220 L 385 210 M 370 220 L 385 230 M 370 220 L 390 220" />
      <path d="M 320 220 L 305 210 M 320 220 L 305 230 M 320 220 L 300 220" />
    </g>

    {/* Dripping Acid */}
    <path d="M 160 530 Q 170 620 180 530" fill="#39FF14" filter="url(#glow)"/>
    <path d="M 220 520 Q 230 590 240 520" fill="#FF1493" filter="url(#glow)"/>
    <path d="M 190 540 Q 200 650 210 540" fill="#00FFFF" filter="url(#glow)"/>
  </svg>
);

export const InteractiveHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !objectRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on distance from center (Mouse Tilt)
    const rotateX = ((y - centerY) / centerY) * -35; // Max 35 deg
    const rotateY = ((x - centerX) / centerX) * 35;

    // Direct DOM manipulation for performance (avoids React re-renders)
    objectRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!objectRef.current) return;
    objectRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  // 6 planes for a voluminous 3D effect
  const planes = [0, 30, 60, 90, 120, 150];

  return (
    <div 
      className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden border-b-4 border-mex-pink bg-mex-dark"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: '1200px' }}
    >
      {/* The "3D" Object Container (Mouse Tilt) */}
      <div 
        ref={objectRef}
        className="relative z-10 transition-transform duration-150 ease-out flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* 
          Surreal 3D Cactus Model using Intersecting Planes.
          Larger size and continuous rotation.
        */}
        <div className="relative w-80 h-[500px] md:w-[500px] md:h-[700px] animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
          {planes.map((deg, index) => (
            <div key={deg} className="absolute inset-0" style={{ transform: `rotateY(${deg}deg)`, mixBlendMode: 'screen' }}>
              <SurrealCactusSVG className={index % 2 === 0 ? "opacity-100" : "opacity-70"} />
            </div>
          ))}
        </div>
        
        {/* Floating ambient lights */}
        <div className="absolute -top-10 -left-20 w-48 h-48 bg-mex-pink mix-blend-screen rounded-full blur-[60px] animate-pulse" style={{ transform: 'translateZ(200px)' }}></div>
        <div className="absolute -bottom-10 -right-20 w-56 h-56 bg-mex-orange mix-blend-screen rounded-full blur-[80px] animate-pulse" style={{ transform: 'translateZ(-150px)', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mex-green mix-blend-screen rounded-full blur-[120px] opacity-30" style={{ transform: 'translateZ(0px)' }}></div>
      </div>
    </div>
  );
};
