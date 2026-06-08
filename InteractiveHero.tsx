import React, { useRef } from 'react';

// Surreal, artsy, but more cactus-shaped SVG
const SurrealCactusSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 600" className={`w-full h-full drop-shadow-[0_0_15px_rgba(57,255,20,0.5)] ${className}`} xmlns="http://www.w3.org/2000/svg">
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
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Geometric Halos / Rings (Behind) */}
    <ellipse cx="200" cy="400" rx="160" ry="40" fill="none" stroke="#00FFFF" strokeWidth="4" transform="rotate(-15 200 400)" filter="url(#glow)"/>

    {/* Left Arm (Attached to trunk) */}
    <path d="M 140 320 C 40 320, 40 150, 90 150 C 120 150, 130 200, 140 250 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6" filter="url(#glow)"/>
    
    {/* Right Arm (Attached to trunk) */}
    <path d="M 260 380 C 360 380, 360 200, 310 200 C 280 200, 270 250, 260 300 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6" filter="url(#glow)"/>

    {/* Main Trunk */}
    <rect x="130" y="100" width="140" height="400" rx="70" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6"/>
    
    {/* Ribs */}
    <path d="M 165 105 L 165 495" stroke="#1A0B0C" strokeWidth="4" fill="none" opacity="0.5"/>
    <path d="M 200 100 L 200 500" stroke="#1A0B0C" strokeWidth="6" fill="none" opacity="0.6"/>
    <path d="M 235 105 L 235 495" stroke="#1A0B0C" strokeWidth="4" fill="none" opacity="0.5"/>

    {/* Melting Base */}
    <path d="M 130 450 C 110 580, 290 580, 270 450 Z" fill="url(#cactusGrad)" stroke="#1A0B0C" strokeWidth="6"/>

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
      {/* Trunk */}
      <path d="M 130 180 L 115 170 M 130 180 L 115 190" />
      <path d="M 130 300 L 115 290 M 130 300 L 115 310" />
      <path d="M 130 420 L 115 410 M 130 420 L 115 430" />
      <path d="M 270 220 L 285 210 M 270 220 L 285 230" />
      <path d="M 270 340 L 285 330 M 270 340 L 285 350" />
      <path d="M 270 460 L 285 450 M 270 460 L 285 470" />
      {/* Arms */}
      <path d="M 60 160 L 45 150 M 60 160 L 45 170" />
      <path d="M 90 150 L 85 135 M 90 150 L 100 135" />
      <path d="M 340 210 L 355 200 M 340 210 L 355 220" />
      <path d="M 310 200 L 305 185 M 310 200 L 320 185" />
    </g>

    {/* Dripping Acid */}
    <path d="M 160 510 Q 170 620 180 510" fill="#39FF14" filter="url(#glow)"/>
    <path d="M 220 500 Q 230 590 240 500" fill="#FF1493" filter="url(#glow)"/>
    <path d="M 190 520 Q 200 650 210 520" fill="#00FFFF" filter="url(#glow)"/>
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

  // 4 planes is enough for a solid 3D look without becoming a glowing mess
  const planes = [0, 45, 90, 135];

  return (
    <div 
      className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden border-b-4 border-mex-pink bg-mex-dark"
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
          Adjusted sizes for mobile: w-[240px] h-[360px] on small screens, larger on md.
        */}
        <div className="relative w-[240px] h-[360px] sm:w-[320px] sm:h-[480px] md:w-[400px] md:h-[600px] animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
          {planes.map((deg) => (
            <div key={deg} className="absolute inset-0" style={{ transform: `rotateY(${deg}deg)` }}>
              {/* Removed mix-blend-mode and set opacity to 90% for a solid, legible 3D object */}
              <SurrealCactusSVG className="opacity-90" />
            </div>
          ))}
        </div>
        
        {/* Floating ambient lights */}
        <div className="absolute -top-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-mex-pink mix-blend-screen rounded-full blur-[40px] md:blur-[60px] animate-pulse" style={{ transform: 'translateZ(150px)' }}></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 md:w-56 md:h-56 bg-mex-orange mix-blend-screen rounded-full blur-[50px] md:blur-[80px] animate-pulse" style={{ transform: 'translateZ(-100px)', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 bg-mex-green mix-blend-screen rounded-full blur-[80px] md:blur-[120px] opacity-30" style={{ transform: 'translateZ(0px)' }}></div>
      </div>
    </div>
  );
};
