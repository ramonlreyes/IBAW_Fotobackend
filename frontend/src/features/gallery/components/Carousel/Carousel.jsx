import { useState, useEffect, useCallback } from 'react';
import albumService from '../../../albums/hooks/albumService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ 
  images = [], 
  autoAdvance = true, 
  autoAdvanceInterval = 10000,
  showControls = true,
  showCounter = true 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!autoAdvance || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [autoAdvance, autoAdvanceInterval, images.length]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No images to display</p>
          <p className="text-sm">Images will appear here when loaded</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="flex-1 relative bg-gray-50">
      <div className="h-full flex items-center justify-center p-4">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">Failed to load image</p>
            <p className="text-sm">{currentImage?.alt || 'Unknown image'}</p>
          </div>
        ) : (
          <img
            src={currentImage?.imageUrl || currentImage?.src}
            alt={currentImage?.alt || `Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-opacity duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoading ? 0 : 1 }}
          />
        )}
      </div>

      {showControls && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </>
      )}

      {showCounter && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-full text-sm text-gray-700 shadow-lg">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {images.length > 1 && images.length <= 10 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-gray-700 scale-125'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {currentImage?.title && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-800">{currentImage.title}</h3>
          {currentImage?.description && (
            <p className="text-xs text-gray-600 mt-1">{currentImage.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;