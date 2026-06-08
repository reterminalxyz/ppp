import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main dot */}
      <div 
        className="fixed top-0 left-0 w-4 h-4 bg-mex-orange rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out"
        style={{ 
          transform: `translate3d(${position.x - 8}px, ${position.y - 8}px, 0) scale(${isHovering ? 2 : 1})`,
        }}
      />
      {/* Trailing aura */}
      <div 
        className="fixed top-0 left-0 w-12 h-12 border-2 border-mex-pink rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out opacity-50"
        style={{ 
          transform: `translate3d(${position.x - 24}px, ${position.y - 24}px, 0) scale(${isHovering ? 1.5 : 1})`,
        }}
      />
    </>
  );
};
