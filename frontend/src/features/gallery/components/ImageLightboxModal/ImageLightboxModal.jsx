import { useCallback } from "react";
import { useImageLoader } from "../../../../shared/hooks/useImageLoader";
import { useKeyboardNavigation } from "../../../navigation/hooks/useKeyboardNavigation";
import { useBodyScrollLock, useTouchGestures } from "../../../navigation/hooks/useTouchGestures";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';


const ImageLightboxModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrevious,
  onNext,
  onImageSelect,
  getImageUrl,
  albumTitle
}) => {

  const currentImage = images?.[currentIndex];
  const imageUrl = currentImage ? getImageUrl(currentImage) : null;
  const imageLoader = useImageLoader(imageUrl, currentIndex);

  const handleThumbnailClick = useCallback((index) => {
    onImageSelect?.(index);
  }, [onImageSelect]);
  
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget){
      onClose();
    }
  }, [onClose]);


  if (!isOpen || !images || images.length === 0) return null;

  const hasMultipleImages = images.length > 1;
  const hasPrevious = hasMultipleImages && currentIndex > 0;
  const hasNext = hasMultipleImages && currentIndex < images.length - 1;


  return (
    <div
      className="fixed inset-0 z-[60] bg-black bg-opacity-95 md:bg-opacity-95 flex items-center justify-center p-0 md:p-4"
      onClick={handleBackdropClick}
    >
      {/* Close Button  */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[61] p-3 md:p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 md:bg-transparent rounded-full md:rounded-none"
        aria-label='Close lightbox'
      >
        <X className="w-6 h-6 md:h-8" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-[61] text-white text-sm bg-black bg-opacity-50 md:bg-transparent px-3 py-2 md:px-0 md:py-0 rounded-full md:rounded-none">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[61] p-3 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[61] p-3 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        onClick={handleBackdropClick}
        className="relative w-full h-full md:max-w-[90vh] flex items-center justify-center"
      >
        {imageUrl && !imageLoader.imageError ? (
          <>
            {/* Loading indicator */}
            {!imageLoader.imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner message="Loading Images..." />
              </div>
            )}

            <img
              src={imageUrl}
              alt={`${albumTitle} - Image ${currentIndex + 1}`}
              className={`w-full h-full md:max-w-full md:max-h-full max-h-screen object-contain transition-opacity duration-300 ${
                imageLoader.imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={(e) => e.stopPropagation()}
              onLoad={imageLoader.handleImageLoad}
              onError={imageLoader.handleImageError}
              loading="eager"
            />
          </>
        ) : (
          <div className="w-full h-64 md:w-96 md:h-96 bg-gray-800 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-sm md:text-base">
                {imageLoader.imageError ? 'Failed to load image' : 'Image not available'}
              </p>
              {imageLoader.imageError && (
                <button
                  onClick={imageLoader.handleImageRetry}
                  className="mt-2 text-xs underline hover:text-gray-300 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="hidden sm:block md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[61] w-full px-4 md:w-auto md:px-0">
          <div className="flex space-x-1 md:space-x-2 bg-black bg-opacity-50 rounded-lg p-2 max-w-[80vw] overflow-x-auto justify-start md:justify-center">
            {images.map((image, index) => {
              const thumbUrl = getImageUrl(image);
              const isActive = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden border-2 transition-all ${
                    isActive
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                  aria-label={`Go to Image ${index + 1}`}
                >
                  <img 
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile instructions */}
      <div className="block sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[61] text-center">
        <p className="text-white text-xs opacity-70 bg-black bg-opacity-50 px-3 py-1 rounded-full">
          Swipe left/right to navigate
        </p>
      </div>
    </div>
  );
};

export default ImageLightboxModal;