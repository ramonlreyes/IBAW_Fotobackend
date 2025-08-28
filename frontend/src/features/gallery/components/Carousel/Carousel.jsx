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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      <div className="w-full h-64 md:h-96 lg:h-[600px] xl:h-[750px] flex items-center justify-center bg-gray-50" >
        <div className="text-center text-gray-500 px-4">
          <p className="text-base md:text-lg mb-2">No images to display</p>
          <p className="text-sm md:text-base">Images will appear here when loaded</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl" >

      {/* Carousel container with natural image aspect ratio */}
      <div className="relative w-full">
        
        {/* Main image container - perfectly centered with flex */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[3/2] rounded-lg overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-gray-600"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500 px-4">
              <div>
                <p className="text-base md:text-lg mb-2">Failed to load image</p>
                <p className="text-sm">{currentImage?.alt || 'Unknown image'}</p>
              </div>
            </div>
          ) : (
            <img
              src={currentImage?.imageUrl || currentImage?.src}
              alt={currentImage?.alt || `Image ${currentImageIndex + 1}`}
              className="absolute inset-0 w-full h-full object-contain sm:object-cover transition-opacity duration-300"
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
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 z-20 hidden sm:block"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 z-20 hidden sm:block"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </>
        )}

         {/* Touch-friendly navigation areas for mobile */}
          <div className="sm:hidden absolute inset-0 flex">
            <button
              onClick={prevImage}
              className="flex-1 h-full focus:outline-none"
              aria-label="Previous image"
            />
            <button
              onClick={nextImage}
              className="flex-1 h-full focus:outline-none"
              aria-label="Next image"
            />
          </div>

        {/* Image Counter */}
        {showCounter && images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm text-white shadow-lg z-20">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Dot Navigation */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-10 sm:bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white scale-125'
                    : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 hover:bg-white/80'
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