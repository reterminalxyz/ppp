import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenGallery: () => void;
}

export const Menu: React.FC<Props> = ({ isOpen, onClose, onOpenGallery }) => {
  const menuItems = [
    { name: 'BLOG', color: 'from-mex-pink to-mex-orange' },
    { name: 'GALLERY', color: 'from-mex-orange to-mex-green' },
    { name: 'HISTORY', color: 'from-mex-green to-mex-pink' }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-mex-dark border-l-4 border-mex-orange z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b-4 border-mex-pink flex justify-between items-center bg-checkerboard">
          <h2 className="text-2xl font-black text-white glitch-wrapper">
            <span className="glitch" data-text="MENU">MENU</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-mex-pink hover:text-white text-2xl font-bold"
          >
            [X]
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center space-y-12 p-8">
          {menuItems.map((item) => (
            <a 
              key={item.name} 
              href={`#${item.name.toLowerCase()}`}
              onClick={(e) => {
                if (item.name === 'GALLERY') {
                  e.preventDefault();
                  onOpenGallery();
                }
                onClose();
              }}
              className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${item.color} hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_20px_rgba(255,20,147,0.8)]`}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="p-4 border-t-4 border-mex-orange bg-black text-center">
          <span className="text-mex-orange font-mono text-sm">SYSTEM.NAV_READY</span>
        </div>
      </div>
    </>
  );
};
