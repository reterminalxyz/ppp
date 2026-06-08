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

export const InteractiveHero: React.FC = () => {
 const containerRef = useRef<HTMLDivElement>(null);
  
 // Состояние для параллакс-эффекта (от -1 до 1)
 const [offset, setOffset] = useState({ x: 0, y: 0 });
 const lastPos = useRef({ x: 0, y: 0 });
 const lastSoundTime = useRef(0);
 const [orientationPermission, setOrientationPermission] = useState<boolean | null>(null);

 // Инициализация гироскопа (DeviceOrientation)
 useEffect(() => {
  // Автоматически разрешаем для устройств, не требующих явного запроса (Android, старые iOS)
  if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
   setOrientationPermission(true);
  }
 }, []);

 useEffect(() => {
  if (!orientationPermission) return;

  const handleOrientation = (event: DeviceOrientationEvent) => {
   let { beta, gamma } = event;
   if (beta === null || gamma === null) return;

   // Обработка ландшафтной ориентации
   const orientation = window.screen?.orientation?.angle || window.orientation || 0;
   if (orientation === 90) {
    const temp = beta;
    beta = -gamma;
    gamma = temp;
   } else if (orientation === -90) {
    const temp = beta;
    beta = gamma;
    gamma = -temp;
   }

   // Нормализация значений:
   // gamma (наклон влево/вправо): от -30 до 30 градусов
   // beta (наклон вперед/назад): от 15 до 75 градусов (предполагаем, что 45 - это нейтральное положение в руке)
   let x = gamma / 30;
   let y = (beta - 45) / 30;

   // Ограничиваем от -1 до 1
   x = Math.max(-1, Math.min(1, x));
   y = Math.max(-1, Math.min(1, y));

   setOffset({ x, y });
  };

  window.addEventListener('deviceorientation', handleOrientation);
  return () => window.removeEventListener('deviceorientation', handleOrientation);
 }, [orientationPermission]);

 const requestOrientationPermission = async () => {
  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
   try {
    const permissionState = await (DeviceOrientationEvent as any).requestPermission();
    if (permissionState === 'granted') {
     setOrientationPermission(true);
    }
   } catch (error) {
    console.error('Error requesting device orientation permission:', error);
   }
  }
 };

 const handleMove = (clientX: number, clientY: number) => {
  if (!containerRef.current) return;
   
  const rect = containerRef.current.getBoundingClientRect();
  
  // Нормализуем координаты от -1 до 1 относительно центра контейнера
  const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
   
  // Если гироскоп активен, мышь/тач добавляют смещение к гироскопу, иначе полностью управляют
  if (!orientationPermission) {
   setOffset({ x, y });
  }

  // Логика звука свайпа
  const deltaX = clientX - lastPos.current.x;
  const deltaY = clientY - lastPos.current.y;
  const speed = Math.abs(deltaX) + Math.abs(deltaY);
  const now = Date.now();
  
  if (speed > 10 && now - lastSoundTime.current > 100) {
   playSwipeSound(speed);
   lastSoundTime.current = now;
  }

  lastPos.current = { x: clientX, y: clientY };
 };

 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  handleMove(e.clientX, e.clientY);
 };

 const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  if (e.touches.length > 0) {
   handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }
 };

 const handleInteractionStart = () => {
  // Запрашиваем права на гироскоп при первом касании (для iOS 13+)
  if (orientationPermission === null) {
   requestOrientationPermission();
  }
 };

 const handleMouseLeave = () => {
  // Плавный возврат в центр, если гироскоп не активен
  if (!orientationPermission) {
   setOffset({ x: 0, y: 0 });
  }
 };

 return (
  <div 
   className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden border-b-4 border-mex-pink bg-mex-dark flex items-center justify-center"
   onMouseMove={handleMouseMove}
   onMouseLeave={handleMouseLeave}
   onTouchMove={handleTouchMove}
   onTouchStart={handleInteractionStart}
   onMouseDown={handleInteractionStart}
   ref={containerRef}
  >
   {/* Встроенные стили для плавной анимации левитации */}
   <style>{`
    @keyframes float-slow {
     0%, 100% { transform: translateY(0px); }
     50% { transform: translateY(-15px); }
    }
    .animate-float {
     animation: float-slow 6s ease-in-out infinite;
    }
   `}</style>

   {/* Фоновые неоновые пятна (двигаются в противоположную сторону) */}
   <div 
    className="absolute w-64 h-64 md:w-96 md:h-96 bg-mex-pink mix-blend-screen rounded-full blur-[80px] md:blur-[120px] opacity-50 transition-transform duration-500 ease-out"
    style={{ transform: `translate(${offset.x * -30}px, ${offset.y * -30}px)` }}
   />
   <div 
    className="absolute w-72 h-72 md:w-[400px] md:h-[400px] bg-mex-orange mix-blend-screen rounded-full blur-[90px] md:blur-[130px] opacity-40 transition-transform duration-500 ease-out"
    style={{ transform: `translate(${offset.x * 40}px, ${offset.y * 40}px)` }}
   />

   {/* Главный SVG Контейнер (Широкий ViewBox для трех кактусов) */}
   <div className="relative w-full max-w-5xl h-full animate-float z-10 pointer-events-none p-4">
    <svg viewBox="0 0 800 600" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
     <defs>
      {/* Градиенты */}
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
       <stop offset="0%" stopColor="#FF1493" />
       <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <linearGradient id="cac1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
       <stop offset="0%" stopColor="#39FF14" />
       <stop offset="100%" stopColor="#00FFFF" />
      </linearGradient>
      <linearGradient id="cac2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
       <stop offset="0%" stopColor="#FF1493" />
       <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <linearGradient id="cac3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
       <stop offset="0%" stopColor="#00FFFF" />
       <stop offset="100%" stopColor="#8A2BE2" />
      </linearGradient>
      
      {/* Фильтры свечения */}
      <filter id="glow-strong" x="-20%" y="-20%" width="140%" height="140%">
       <feGaussianBlur stdDeviation="12" result="blur" />
       <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
       </feMerge>
      </filter>
      <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
       <feGaussianBlur stdDeviation="6" result="blur" />
       <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
       </feMerge>
      </filter>
     </defs>

     {/* СЛОЙ 1: Vaporwave Солнце (Дальний фон, двигается медленно и инвертированно) */}
     <g 
      style={{ transform: `translate(${offset.x * -10}px, ${offset.y * -10}px)` }} 
      className="transition-transform duration-300 ease-out"
     >
      <circle cx="400" cy="350" r="180" fill="url(#sunGrad)" filter="url(#glow-soft)" opacity="0.85" />
      {/* Полосы на солнце */}
      <line x1="200" y1="320" x2="600" y2="320" stroke="#1A0B0C" strokeWidth="4" />
      <line x1="200" y1="360" x2="600" y2="360" stroke="#1A0B0C" strokeWidth="8" />
      <line x1="200" y1="410" x2="600" y2="410" stroke="#1A0B0C" strokeWidth="14" />
      <line x1="200" y1="470" x2="600" y2="470" stroke="#1A0B0C" strokeWidth="24" />
     </g>

     {/* СЛОЙ 2: Левый кактус (Opuntia / Опунция) - Задний план */}
     <g 
      style={{ transform: `translate(${offset.x * 15}px, ${offset.y * 15}px)` }} 
      className="transition-transform duration-200 ease-out"
     >
      {/* Тело */}
      <ellipse cx="250" cy="450" rx="40" ry="90" stroke="url(#cac2Grad)" strokeWidth="10" fill="none" filter="url(#glow-soft)" />
      <ellipse cx="180" cy="320" rx="45" ry="60" transform="rotate(-25 180 320)" stroke="url(#cac2Grad)" strokeWidth="10" fill="none" filter="url(#glow-soft)" />
      <ellipse cx="310" cy="280" rx="35" ry="50" transform="rotate(30 310 280)" stroke="url(#cac2Grad)" strokeWidth="10" fill="none" filter="url(#glow-soft)" />
      <ellipse cx="140" cy="200" rx="25" ry="40" transform="rotate(-45 140 200)" stroke="url(#cac2Grad)" strokeWidth="10" fill="none" filter="url(#glow-soft)" />
      
      {/* Внутренние линии для объема */}
      <ellipse cx="250" cy="450" rx="20" ry="70" stroke="#FFF" strokeWidth="3" fill="none" opacity="0.6" />
      <ellipse cx="180" cy="320" rx="20" ry="40" transform="rotate(-25 180 320)" stroke="#FFF" strokeWidth="2" fill="none" opacity="0.6" />
      
      {/* Парящий глаз */}
      <circle cx="180" cy="320" r="8" fill="#00FFFF" className="animate-pulse" filter="url(#glow-strong)" />
      <circle cx="310" cy="280" r="6" fill="#39FF14" className="animate-ping" />
     </g>

     {/* СЛОЙ 3: Правый кактус (Columnar / Спиральный) - Средний план */}
     <g 
      style={{ transform: `translate(${offset.x * 25}px, ${offset.y * 25}px)` }} 
      className="transition-transform duration-150 ease-out"
     >
      {/* Основные изгибы */}
      <path d="M550,550 Q510,400 570,250 T550,50" stroke="url(#cac3Grad)" strokeWidth="22" fill="none" strokeLinecap="round" filter="url(#glow-soft)" />
      <path d="M550,550 Q510,400 570,250 T550,50" stroke="#FFF" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
      
      <path d="M600,500 Q570,380 620,260 T600,100" stroke="url(#cac3Grad)" strokeWidth="14" fill="none" strokeLinecap="round" filter="url(#glow-soft)" />
      <path d="M600,500 Q570,380 620,260 T600,100" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      
      {/* Неоновые кольца-сканеры */}
      <ellipse cx="560" cy="150" rx="45" ry="12" stroke="#39FF14" strokeWidth="4" fill="none" transform="rotate(-15 560 150)" filter="url(#glow-strong)" />
      <ellipse cx="560" cy="350" rx="55" ry="15" stroke="#FF1493" strokeWidth="4" fill="none" transform="rotate(10 560 350)" filter="url(#glow-strong)" />
     </g>

     {/* СЛОЙ 4: Центральный кактус (Saguaro) - Передний план */}
     <g 
      style={{ transform: `translate(${offset.x * 40}px, ${offset.y * 40}px)` }} 
      className="transition-transform duration-100 ease-out"
     >
      {/* Абстрактная аура */}
      <path d="M400,550 C350,400 450,300 400,100" stroke="#00FFFF" strokeWidth="45" strokeLinecap="round" fill="none" filter="url(#glow-strong)" opacity="0.2" />
      
      {/* Центральный ствол */}
      <path d="M400,550 C370,400 430,300 400,100 C370,20 430,20 400,20" stroke="url(#cac1Grad)" strokeWidth="18" strokeLinecap="round" fill="none" filter="url(#glow-soft)" />
      <path d="M400,550 C370,400 430,300 400,100 C370,20 430,20 400,20" stroke="#FFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
      
      {/* Левая рука */}
      <path d="M400,400 C310,400 270,300 300,200" stroke="url(#cac1Grad)" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#glow-soft)" />
      <path d="M400,400 C310,400 270,300 300,200" stroke="#FFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
      
      {/* Правая рука */}
      <path d="M400,320 C490,320 530,210 500,110" stroke="url(#cac1Grad)" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#glow-soft)" />
      <path d="M400,320 C490,320 530,210 500,110" stroke="#FFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />

      {/* Психоделичные глаза / Ядра */}
      <ellipse cx="400" cy="180" rx="25" ry="40" stroke="#FF1493" strokeWidth="4" fill="none" filter="url(#glow-soft)" />
      <circle cx="400" cy="180" r="8" fill="#FF8C00" className="animate-ping" />
      
      <circle cx="300" cy="200" r="15" stroke="#FF8C00" strokeWidth="3" fill="none" filter="url(#glow-soft)" />
      <circle cx="300" cy="200" r="5" fill="#39FF14" className="animate-pulse" />

      <circle cx="500" cy="110" r="15" stroke="#FF8C00" strokeWidth="3" fill="none" filter="url(#glow-soft)" />
      <circle cx="500" cy="110" r="5" fill="#39FF14" className="animate-pulse" />
     </g>

     {/* СЛОЙ 5: Парящие глитч-элементы (Самый передний план, двигаются быстрее всего) */}
     <g 
      style={{ transform: `translate(${offset.x * 60}px, ${offset.y * 60}px)` }} 
      className="transition-transform duration-75 ease-out"
     >
      {/* Звезды / Кресты */}
      <path d="M150,150 L160,180 L190,190 L160,200 L150,230 L140,200 L110,190 L140,180 Z" fill="#39FF14" filter="url(#glow-soft)" className="animate-spin" style={{ transformOrigin: '150px 190px', animationDuration: '5s' }} />
      <path d="M650,100 L655,120 L675,125 L655,130 L650,150 L645,130 L625,125 L645,120 Z" fill="#FF1493" filter="url(#glow-soft)" className="animate-bounce" style={{ animationDuration: '3s' }} />
      
      {/* Глитч-линии */}
      <rect x="250" y="500" width="80" height="4" fill="#00FFFF" opacity="0.8" className="animate-pulse" />
      <rect x="500" y="450" width="40" height="6" fill="#FF1493" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
      <rect x="350" y="80" width="50" height="3" fill="#39FF14" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
     </g>
    </svg>
   </div>
  </div>
 );
};
