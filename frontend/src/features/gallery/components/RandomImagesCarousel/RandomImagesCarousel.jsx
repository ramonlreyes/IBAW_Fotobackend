import { useGetRandomImage } from "../../../albums";
import Carousel from '../Carousel';
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import ErrorState from "../../../../shared/components/ErrorState/ErrorState";

const RandomImagesCarousel = ({
  numberOfImages = 24,
  autoAdvance = true,
  autoAdvanceInterval = 8000,
  className = ''
}) => {
  const {
    randomImages,
    loading,
    error,
    totalAvailableImages,
    refetch
  } = useGetRandomImage(numberOfImages);

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center">
        <LoadingSpinner message="Loading Portfolio Showcase..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center">
        <ErrorState
          error={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (randomImages.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 px-4">
          <p className="text-base md:text-lg mb-2">No Portfolio Images Found</p>
          <p className="text-sm md:text-base">Images will appear here when albums are uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Carousel component */}
      <Carousel
        images={randomImages}
        autoAdvance={autoAdvance}
        autoAdvanceInterval={autoAdvanceInterval}
        showControls={false}
        showCounter={false}
      />
    </div>
  );
};

export default RandomImagesCarousel;