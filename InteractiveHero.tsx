import React, { useRef, useState, useEffect } from 'react';

// Глобальный аудио контекст для звуков свайпа
let swipeAudioCtx: AudioContext | null = null;

const playSwipeSound = (speed: number) => {
  if (!swipeAudioCtx) {
    swipeAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (swipeAudioCtx.state === 'suspended') {
    swipeAudioCtx.resume();
  }
  
  const osc = swipeAudioCtx.createOscillator();
  const gain = swipeAudioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(swipeAudioCtx.destination);

  // Забавный "булькающий" или "пружинящий" звук, зависящий от скорости свайпа
  osc.type = 'sine';
  const baseFreq = 300 + Math.min(speed * 10, 500);
  
  osc.frequency.setValueAtTime(baseFreq, swipeAudioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, swipeAudioCtx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.02, swipeAudioCtx.currentTime); // Тихий звук
  gain.gain.exponentialRampToValueAtTime(0.001, swipeAudioCtx.currentTime + 0.1);

  osc.start();
  osc.stop(swipeAudioCtx.currentTime + 0.1);
};

// Голографический неоновый кактус (Wireframe)
const HologramCactusSVG = ({ className, color }: { className?: string, color: string }) => (
  <svg viewBox="0 0 400 600" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id={`glow-${color}`}>
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <g filter={`url(#glow-${color})`} stroke={color} fill="none" strokeWidth="4" strokeLinecap="round">
      {/* Центральный ствол (внешний контур) */}
      <rect x="150" y="100" width="100" height="400" rx="50" />
      
      {/* Внутренние линии ствола для объема */}
      <line x1="180" y1="100" x2="180" y2="500" strokeWidth="2" opacity="0.6" />
      <line x1="220" y1="100" x2="220" y2="500" strokeWidth="2" opacity="0.6" />
      <line x1="200" y1="100" x2="200" y2="500" strokeWidth="2" opacity="0.8" />

      {/* Левая рука */}
      <path d="M 150 320 C 50 320, 50 150, 100 150 C 130 150, 140 200, 150 250" />
      <path d="M 150 290 C 80 290, 80 180, 100 180 C 115 180, 120 210, 150 230" strokeWidth="2" opacity="0.6"/>

      {/* Правая рука */}
      <path d="M 250 380 C 350 380, 350 200, 300 200 C 270 200, 260 250, 250 300" />
      <path d="M 250 350 C 320 350, 320 230, 300 230 C 285 230, 280 260, 250 280" strokeWidth="2" opacity="0.6"/>

      {/* Декоративные кольца (Голографические сканеры) */}
      <ellipse cx="200" cy="450" rx="140" ry="30" stroke="#00FFFF" strokeWidth="3" strokeDasharray="10 15" />
      <ellipse cx="200" cy="150" rx="100" ry="20" stroke="#FF1493" strokeWidth="3" strokeDasharray="5 10" />
      
      {/* Глаз / Ядро */}
      <ellipse cx="200" cy="250" rx="30" ry="15" stroke="#FF8C00" strokeWidth="4" />
      <circle cx="200" cy="250" r="5" fill="#FF8C00" />
    </g>
  </svg>
);

export const InteractiveHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  
  // Состояние вращения
  const manualRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastSoundTime = useRef(0);

  // Обработка мыши (Десктоп - легкий наклон при наведении)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || !containerRef.current || !objectRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -20; 
    const rotateY = ((x - centerX) / centerX) * 20;

    objectRef.current.style.transform = `rotateX(${rotateX + manualRotation.current.x}deg) rotateY(${rotateY + manualRotation.current.y}deg)`;
  };

  const handleMouseLeave = () => {
    if (isDragging.current || !objectRef.current) return;
    objectRef.current.style.transform = `rotateX(${manualRotation.current.x}deg) rotateY(${manualRotation.current.y}deg)`;
  };

  // Обработка свайпов и перетаскивания (Мобилки и Десктоп)
  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastPos.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging.current || !objectRef.current) return;
    
    if ('touches' in e) {
      e.preventDefault(); // Блокируем скролл страницы при вращении кактуса
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;

    // Ограничиваем вращение по оси X (вверх/вниз), чтобы модель не переворачивалась вверх ногами
    const newRotX = Math.max(-30, Math.min(30, manualRotation.current.x - deltaY * 0.6));
    // Вращение по оси Y (влево/вправо) бесконечное
    const newRotY = manualRotation.current.y + deltaX * 0.6;

    manualRotation.current = { x: newRotX, y: newRotY };
    objectRef.current.style.transform = `rotateX(${newRotX}deg) rotateY(${newRotY}deg)`;

    // Воспроизведение звука при быстром свайпе
    const speed = Math.abs(deltaX) + Math.abs(deltaY);
    const now = Date.now();
    if (speed > 5 && now - lastSoundTime.current > 100) {
      playSwipeSound(speed);
      lastSoundTime.current = now;
    }

    lastPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchmove', handlePointerMove, { passive: false });
    container.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, []);

  // 6 плоскостей создают идеальную голографическую 3D иллюзию
  const planes = [
    { deg: 0, color: '#39FF14' },   // Зеленый
    { deg: 30, color: '#00FFFF' },  // Циан
    { deg: 60, color: '#FF1493' },  // Розовый
    { deg: 90, color: '#39FF14' },  // Зеленый
    { deg: 120, color: '#00FFFF' }, // Циан
    { deg: 150, color: '#FF1493' }  // Розовый
  ];

  return (
    <div 
      className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden border-b-4 border-mex-pink bg-mex-dark touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handlePointerDown}
      onMouseDown={handlePointerDown}
      ref={containerRef}
      style={{ perspective: '1000px' }}
    >
      {/* Контейнер 3D объекта */}
      <div 
        ref={objectRef}
        className="relative z-10 flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ 
          transformStyle: 'preserve-3d', 
          willChange: 'transform',
          transform: `rotateX(0deg) rotateY(0deg)`
        }}
      >
        {/* 
          Анимация постоянного вращения + ручное вращение.
          Размеры увеличены для мобильных устройств.
        */}
        <div className="relative w-[300px] h-[450px] sm:w-[350px] sm:h-[525px] md:w-[450px] md:h-[675px] animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
          {planes.map((plane, index) => (
            <div 
              key={index} 
              className="absolute inset-0" 
              style={{ 
                transform: `rotateY(${plane.deg}deg)`, 
                mixBlendMode: 'screen' // Режим наложения создает эффект свечения при пересечении
              }}
            >
              <HologramCactusSVG color={plane.color} />
            </div>
          ))}
        </div>
        
        {/* Окружающее свечение */}
        <div className="absolute -top-10 -left-10 w-40 h-40 md:w-64 md:h-64 bg-mex-pink mix-blend-screen rounded-full blur-[60px] md:blur-[90px] animate-pulse" style={{ transform: 'translateZ(100px)' }}></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-72 md:h-72 bg-mex-orange mix-blend-screen rounded-full blur-[70px] md:blur-[100px] animate-pulse" style={{ transform: 'translateZ(-100px)', animationDelay: '1s' }}></div>
      </div>
      
      {/* Подсказка для мобильных */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-mex-green font-mono text-sm opacity-70 md:hidden pointer-events-none animate-pulse tracking-widest">
        [ SWIPE TO ROTATE ]
      </div>
    </div>
  );
};
