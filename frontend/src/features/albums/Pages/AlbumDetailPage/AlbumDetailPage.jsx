import { useNavigate, useParams } from "react-router-dom";
import { useAlbumData } from "../../hooks/useAlbum";
import AlbumGrid from "../../components/AlbumGrid";
import { getCategoryDisplayName } from "../../../../constants/categories";
import ErrorState from "../../../../shared/components/ErrorState";
import EmptyState from "../../../../shared/components/EmptyState";
import { useEffect, useState } from "react";
import ImageLightboxModal from "../../../gallery/components/ImageLightboxModal";
import { useLightbox } from "../../../../shared/hooks/useLightbox";
import { HeroCoverSkeleton, NavigationsHeaderSkeleton, AlbumTitleSkeleton, AlbumGridSkeleton } from "../../../../shared/components/SkeletonLoadingComponents/SkeletonLoadingComponents";


const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const {
    album,
    loading,
    error,
    refetch,
    getImageUrl,
    handleImageError
  } = useAlbumData(albumId ? {albumId} : {});

  const lightbox = useLightbox(album?.images || [], getImageUrl);

  useEffect(() => {
    if (!loading && album) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, album]);


  if (loading || showSkeleton) {
    return (
      <div className="min-h-screen bg-white">
        {album?.cover ? (
          <HeroCoverSkeleton />
        ) : (
          <>
            <NavigationsHeaderSkeleton />
            <AlbumTitleSkeleton />
          </>
        )}

        <div className="bg-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
          <AlbumGridSkeleton
            columns={3}
            gap={2}
            itemCount={9}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Album not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Get cover image URL
  const coverImageUrl = album.cover ? getImageUrl(album.cover) : null;

  const handleImageClick = (imageIndex) => {
    lightbox.open(imageIndex);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - only shown when no cover image */}
      {!coverImageUrl && (
        <div className="relative z-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-light tracking-wide">Back to Albums</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Cover Image Section */}
      {coverImageUrl && (
        <div className="bg-white py-4 sm:py-8 md:py-12 lg:py-16">
          <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl xl:max-w-screen-2xl">
            <div className="relative">
              <img
                src={coverImageUrl}
                alt={`${album.title} cover`}
                className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] lg:aspect-[24/10] xl:aspect-[28/10] object-cover rounded-none sm:rounded-lg"
                onError={() => handleImageError(album._id)}
                loading="eager"
              />
              
              {/* Back to Albums link - top left inside image */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 z-20 inline-flex items-center text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs sm:text-sm font-light tracking-wide">Back to Albums</span>
              </button>
              
              {/* Title overlay at bottom center - matching reference style */}
              <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 lg:bottom-12 xl:bottom-16 left-1/2 transform -translate-x-1/2 z-10 w-full px-4 sm:px-6 md:px-8">
                <div className="text-center text-white">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light tracking-wide mb-1 sm:mb-2 md:mb-3 lg:mb-4" style={{ fontFamily: 'serif' }}>
                    {album.title}
                  </h1>
                  {album.category && (
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-widest uppercase opacity-90">
                      {album.category} • {album.images?.length || 0} images
                    </p>
                  )}
                </div>
              </div>

              {/* Optional dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-none sm:rounded-lg"></div>
            </div>
          </div>
        </div>
      )}

      {/* Album Title Section (if no cover image) */}
      {!coverImageUrl && (
        <div className="bg-white py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-gray-900 mb-2 sm:mb-3 md:mb-4">
                {album.title}
              </h1>
              {album.category && (
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  {album.category} • {album.images?.length || 0} images
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid Container */}
      <div className="bg-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        {!album.images || album.images.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh]">
            <p className="text-gray-500 text-sm sm:text-base">No Images in this Album</p>
          </div>
        ) : (
          <AlbumGrid
            albums={album.images.map((imagePath, index) => ({
              id: `img-${index}`,
              path: imagePath,
              index: index
            }))}
            onImageError={handleImageError}
            getImageUrl={getImageUrl}
            type="album"
            albumTitle={album.title}
            columns={3}
            gap={2}
            onItemClick={(albumData) => {
              const imageIndex = albumData.index;
              handleImageClick(imageIndex);
            }}
          />
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightboxModal
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        images={album.images || []}
        currentIndex={lightbox.currentIndex}
        onPrevious={lightbox.goToPrevious}
        onNext={lightbox.goToNext}
        onImageSelect={lightbox.selectImage}
        getImageUrl={getImageUrl}
        albumTitle={album.title}
      />
    </div>
  );
};

export default AlbumDetailPage;