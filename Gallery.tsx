import React, { useState } from 'react';
import { products } from './data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GalleryImage = ({ url, name }: { url: string, name: string }) => {
  const [error, setError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1519336305162-4b63d5030b86?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="border-4 border-mex-orange p-2 bg-black group flex flex-col relative">
      <div className="overflow-hidden aspect-square mb-4 flex-grow relative">
        <img 
          src={error ? fallbackImage : url} 
          alt={name} 
          loading="lazy" 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 group-hover:hue-rotate-90 ${error ? 'opacity-50 grayscale' : ''}`}
          onError={() => setError(true)}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-mex-pink font-mono text-xs">LOCKED</span>
          </div>
        )}
      </div>
      <p className="text-mex-green font-mono text-sm text-center uppercase">{name}</p>
    </div>
  );
};

export const Gallery: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <GalleryImage key={idx} url={img.url} name={img.name} />
        ))}
      </div>
    </div>
  );
};
