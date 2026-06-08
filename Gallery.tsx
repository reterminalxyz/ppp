import React from 'react';
import { products } from './data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Gallery: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Use reduce instead of flatMap for better compatibility
  const allImages = products.reduce((acc, p) => {
    return acc.concat(p.images.map(img => ({ url: img, name: p.name })));
  }, [] as { url: string, name: string }[]);

  return (
    <div className="fixed inset-0 bg-mex-dark/95 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="sticky top-0 p-4 border-b-4 border-mex-pink flex justify-between items-center bg-checkerboard z-10">
        <h2 className="text-2xl font-black text-white glitch-wrapper">
          <span className="glitch" data-text="GALLERY">GALLERY</span>
        </h2>
        <button onClick={onClose} className="text-mex-pink hover:text-white text-2xl font-bold">
          [X]
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {allImages.map((img, idx) => (
          <div key={idx} className="border-4 border-mex-orange p-2 bg-black group flex flex-col">
            <div className="overflow-hidden aspect-square mb-4 flex-grow">
              <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 group-hover:hue-rotate-90" />
            </div>
            <p className="text-mex-green font-mono text-sm text-center uppercase">{img.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
