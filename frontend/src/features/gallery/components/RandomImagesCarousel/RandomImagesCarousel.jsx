import { RefreshCw } from "lucide-react";
import { useGetRandomImage } from "../../../albums";
import Carousel from '../Carousel';
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import ErrorState from "../../../../shared/components/ErrorState/ErrorState";

const RandomImagesCarousel = ({
  numberOfImages = 24,
  autoAdvance = true,
  autoAdvanceInterval = 8000,
  showRefreshButton = true,
  className = ''
}) => {
  const {
    randomImages,
    loading,
    error,
    totalAvailableImages,
    refetch,
    refreshRandomSelection
  } = useGetRandomImage(numberOfImages);


  const handleRefresh = () => {
    refreshRandomSelection();
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <LoadingSpinner message="Loading Portfolio Showcase..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  if (randomImages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No Portfolio Images Found</p>
          <p className="text-sm">Images will appear here when albums are uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Refresh Button */}
      {showRefreshButton && (
        <button
          onClick={handleRefresh}
          className="absolute top-4 right-4 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow.lg transition-all duration-200 group"
          aria-label="Show different random images"
          title="Refresh image selection"
        >
          <RefreshCw
            size={20}
            className="text-gray-700 group-hover:rotate-180 transition-transform duration-300"
          />
        </button>
      )}

      {/* Portfolio info Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-800">Portfolio Showcase</p>
        <p className="text-xs text-gray-600">
          {randomImages.length} of {totalAvailableImages} images
        </p>
      </div>

      {/* Main Carousel component */}
      <Carousel
        images={randomImages}
        autoAdvance={autoAdvance}
        autoAdvanceInterval={autoAdvanceInterval}
        showControls={true}
        showCounter={true}
      />
    </div>
  );
};

export default RandomImagesCarousel;