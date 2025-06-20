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
      <div className="mx-auto flex items-center justify-center" style={{ width: '1180px', height: '950px' }}>
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No images to display</p>
          <p className="text-sm">Images will appear here when loaded</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="mx-auto relative" style={{width: '1282px', height: '855px'}}>
      {/* Carousel container with natural image aspect ratio */}
      <div className="w-full h-full relative overflow-hidden rounded-lg">
        
        {/* Main image container - perfectly centered with flex */}
        <div className="w-full h-full flex items-center justify-center">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
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
              className="w-full h-full object-cover transition-opacity duration-300"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ 
                opacity: imageLoading ? 0 : 1
              }}
            />
          )}
        </div>

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {showCounter && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-full text-sm text-gray-700 shadow-lg z-20">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Dot Navigation */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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
      </div>
    </div>
  );
};

export default Carousel;