import React from 'react';
import { CartItem } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
}

export const Cart: React.FC<Props> = ({ isOpen, onClose, items, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const phoneNumber = "393500149436";
    let message = "Ciao! Vorrei acquistare i seguenti cactus / Hello! I would like to buy the following cacti:\n\n";
    
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name}\n`;
    });
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-mex-dark border-l-4 border-mex-orange z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b-4 border-mex-pink flex justify-between items-center bg-checkerboard">
          <h2 className="text-2xl font-black text-white glitch-wrapper">
            <span className="glitch" data-text="INVENTORY">INVENTORY</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-mex-pink hover:text-white text-2xl font-bold"
          >
            [X]
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-mex-orange font-mono mt-10">
              <p>NO DATA FOUND.</p>
              <p>CART IS EMPTY.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 border-2 border-mex-red p-2 bg-black/50">
                <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover border border-mex-orange hue-shift" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-mex-pink text-sm">{item.name}</h4>
                    <p className="text-mex-green font-mono text-xs">€{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-500 hover:text-red-400 text-left font-mono underline"
                  >
                    DELETE_FILE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t-4 border-mex-orange bg-black">
          <div className="flex justify-between items-center mb-4">
            <span className="text-mex-orange font-mono">TOTAL_CREDITS:</span>
            <span className="text-2xl font-black text-mex-green">€{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-mex-pink text-white font-black py-3 uppercase tracking-widest hover:bg-white hover:text-mex-pink transition-colors border-2 border-transparent hover:border-mex-pink disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={items.length === 0}
          >
            Check Out (WhatsApp)
          </button>
        </div>
      </div>
    </>
  );
};
