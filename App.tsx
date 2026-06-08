import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InteractiveHero } from './InteractiveHero';
import { ProductCard } from './ProductCard';
import { Menu } from './Menu';
import { Cart } from './Cart';
import { Gallery } from './Gallery';
import { products } from './data';
import { Product, CartItem } from './types';

// Global Audio Context for funny sounds
let audioCtx: AudioContext | null = null;

const playFunnySound = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  // Randomize sound a bit for fun
  const types: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  osc.type = types[Math.floor(Math.random() * types.length)];

  const startFreq = 200 + Math.random() * 600;
  const endFreq = startFreq + (Math.random() > 0.5 ? 400 : -200);

  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Keep it quiet
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

// Highly optimized AcidTrails using direct DOM manipulation to prevent React re-renders
const AcidTrails: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastTime = 0;
    const colors = ['#39FF14', '#FF1493', '#FF8C00', '#00FFFF'];
    
    const handleMove = (e: any) => {
      const now = Date.now();
      // Throttle to ~30fps to prevent too many DOM nodes and lag
      if (now - lastTime < 33) return;
      lastTime = now;

      if (!containerRef.current) return;

      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (clientX === undefined || clientY === undefined) return;

      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create DOM element directly
      const drop = document.createElement('div');
      drop.className = 'acid-drop';
      drop.style.left = `${clientX}px`;
      drop.style.top = `${clientY}px`;
      drop.style.backgroundColor = color;
      drop.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
      
      containerRef.current.appendChild(drop);
      
      // Remove the drop after animation completes (1.5s)
      setTimeout(() => {
        if (drop.parentNode === containerRef.current) {
          containerRef.current.removeChild(drop);
        }
      }, 1500);
    };

    // Use passive listeners for better scroll performance
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return <div ref={containerRef} className="gooey-container" />;
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [headerText, setHeaderText] = useState('');
  
  const fullHeaderText = "PIANETA PIENO DI PIANTE";
  const marqueeText = "SICILIA - PIANETA PIENO DI PIANTE • SICILIA - PIANETA PIENO DI PIANTE • SICILIA - PIANETA PIENO DI PIANTE • SICILIA - PIANETA PIENO DI PIANTE • ";

  // Typewriter effect for header
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setHeaderText(fullHeaderText.slice(0, i));
      i++;
      if (i > fullHeaderText.length) {
        clearInterval(interval);
      }
    }, 100); // Speed of typing
    return () => clearInterval(interval);
  }, []);

  // Global click sound
  useEffect(() => {
    window.addEventListener('click', playFunnySound);
    return () => window.removeEventListener('click', playFunnySound);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-checkerboard font-sans selection:bg-mex-pink selection:text-white">
      <AcidTrails />
      
      {/* Navigation - Optimized for Mobile */}
      <nav className="fixed top-0 w-full z-30 bg-mex-dark/90 backdrop-blur-md border-b-2 border-mex-orange p-2 sm:p-4 flex justify-between items-center">
        <div className="text-mex-orange font-black text-[10px] leading-tight sm:text-sm md:text-2xl tracking-tighter uppercase drop-shadow-[0_0_8px_rgba(255,140,0,0.8)] flex-1 mr-2">
          <span className="glitch-occasional" data-text={headerText + "_"}>
            {headerText}
            <span className="animate-pulse">_</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-mex-pink font-bold font-mono text-[10px] sm:text-sm md:text-xl hover:text-mex-green transition-colors drop-shadow-[0_0_5px_currentColor] whitespace-nowrap"
          >
            CART [{cartItemCount}]
          </button>

          {/* Schematic Cactus Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 group transition-transform duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Open Menu"
          >
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-mex-green group-hover:text-mex-pink transition-colors drop-shadow-[0_0_8px_currentColor]"
            >
              <path d="M12 22V4" />
              <path d="M12 14H8a2 2 0 0 1-2-2V8" />
              <path d="M12 18h4a2 2 0 0 0 2-2v-6" />
              <line x1="12" y1="4" x2="12" y2="4.01" strokeWidth="4" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14 sm:pt-20">
        <InteractiveHero />

        {/* Marquee Divider */}
        <div className="marquee-container">
          <div className="marquee-content glitch-occasional" data-text={marqueeText}>
            <span>{marqueeText}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-widest border-l-8 border-mex-pink pl-4">
              Catalog
            </h2>
            <div className="h-1 flex-grow bg-gradient-to-r from-mex-orange to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.slice(0, visibleCount).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < products.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={handleShowMore}
                className="bg-mex-dark border-2 border-mex-pink text-mex-pink hover:bg-mex-pink hover:text-white font-bold py-4 px-10 transition-all duration-300 uppercase tracking-widest shadow-[6px_6px_0px_0px_#FF8C00] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] text-lg"
              >
                Show More / Mostra Altro
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-mex-dark border-t-4 border-mex-red p-8 text-center font-mono text-mex-orange text-sm">
        <p>© 2026 PIANETA PIENO DI PIANTE. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 opacity-50">DISCONNECT TO RECONNECT.</p>
        <a href="http://t.me/yeg0r" target="_blank" rel="noopener noreferrer" className="mt-4 block text-mex-pink underline hover:text-white transition-colors">
          made by Y
        </a>
      </footer>

      {/* Overlays */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenGallery={() => setIsGalleryOpen(true)}
      />
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onRemove={handleRemoveFromCart}
      />
      <Gallery 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default App;
