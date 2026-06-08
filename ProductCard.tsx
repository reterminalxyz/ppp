import React, { useState } from 'react';
import { Product } from './types';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    setImageError(false);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    setImageError(false);
  };

  return (
    <div className="group relative bg-mex-dark border-4 border-mex-red p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-solid-pink flex flex-col h-full">
      <div className="border-2 border-mex-orange mb-4 relative overflow-hidden">
        <div className="relative overflow-hidden aspect-square group/gallery bg-black flex items-center justify-center">
          {!imageError ? (
            <img 
              src={product.images[currentImageIndex]} 
              alt={`${product.name} - view ${currentImageIndex + 1}`} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:hue-rotate-90"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center p-4 border-2 border-dashed border-mex-pink text-mex-pink font-mono text-sm">
              <p>IMAGE_LOAD_ERROR</p>
              <p className="text-xs mt-2 opacity-70">Check Google Drive sharing permissions (Must be "Anyone with link").</p>
            </div>
          )}
          
          {product.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-mex-dark/90 text-mex-orange border-2 border-mex-orange w-10 h-10 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-mex-orange hover:text-mex-dark z-10 font-bold text-xl shadow-[2px_2px_0px_0px_#FF1493]"
                aria-label="Previous image"
              >
                &#8592;
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-mex-dark/90 text-mex-orange border-2 border-mex-orange w-10 h-10 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-mex-orange hover:text-mex-dark z-10 font-bold text-xl shadow-[2px_2px_0px_0px_#FF1493]"
                aria-label="Next image"
              >
                &#8594;
              </button>
            </>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-mex-pink mb-4 uppercase tracking-wider flex-grow">{product.name}</h3>

        <div className="flex justify-between items-end mt-auto">
          <span className="text-2xl font-black text-mex-green">
            €{product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-transparent border-2 border-mex-orange text-mex-orange hover:bg-mex-orange hover:text-mex-dark font-bold py-2 px-4 transition-colors duration-200 uppercase text-sm shadow-[2px_2px_0px_0px_#FF1493] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
