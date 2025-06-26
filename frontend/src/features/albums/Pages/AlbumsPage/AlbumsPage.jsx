import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AlbumGrid } from '../../index';
import { useAlbumData } from "../../hooks/useAlbum"; 
import { getCategoryDisplayName } from "../../../../constants/categories";
import ErrorState from "../../../../shared/components/ErrorState/ErrorState";
import EmptyState from "../../../../shared/components/EmptyState";
import { PageHeaderSkeleton, AlbumGridSkeleton } from "../../../../shared/components/SkeletonLoadingComponents/SkeletonLoadingComponents";

const AlbumsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  const { 
    albums, 
    loading, 
    error, 
    handleImageError, 
    getImageUrl, 
    refetch 
  } = useAlbumData({ category });

  useEffect(() => {
    if (!loading && albums) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loading, albums]);


  if (loading || showSkeleton) {
    return (
      <div className="min-h-screen bg-white">
        {/* Page Header Skeleton */}
        <PageHeaderSkeleton 
          showBackButton={true} 
          titleWidth="350px" 
        />

        {/* Albums Grid Skeleton */}
        <div className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
          <AlbumGridSkeleton 
            columns={2} 
            gap={2} 
            itemCount={6}
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

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="text-center">

            {/* Back navigation */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 sm:mb-6 md:mb-8"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs sm:text-sm font-light tracking-wide">Portfolio</span>
            </button>

            {/* Category Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-gray-900 mb-1 sm:mb-2">
              {getCategoryDisplayName(category)}
            </h1>
          </div>
        </div>
      </div>

      {/* Albums Grid Container */}
      <div className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        {!albums || albums.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh]">
            <EmptyState category={category} />
          </div>
        ) : (
          <AlbumGrid
            albums={albums}
            onImageError={handleImageError}
            getImageUrl={getImageUrl}
            currentCategory={category}
            columns={2}
            gap={2}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumsPage;