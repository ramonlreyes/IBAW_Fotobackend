import { useNavigate, useParams } from "react-router-dom";
import { useAlbumsByCategory, AlbumGrid } from '../../index';
import { getCategoryDisplayName } from "../../../../constants/categories";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import ErrorState from "../../../../shared/components/ErrorState/ErrorState";
import EmptyState from "../../../../shared/components/EmptyState";

const AlbumsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const { 
    albums, 
    loading, 
    error, 
    handleImageError, 
    getImageUrl, 
    refetch 
  } = useAlbumsByCategory(category);

  const handleRetry = () => {
    refetch();
  };

  // Early returns for different states
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading albums..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header - similar to cassandraladru.com */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Back navigation */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-light tracking-wide">Portfolio</span>
            </button>

            {/* Category Title */}
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-2">
              {getCategoryDisplayName(category)}
            </h1>
          </div>
        </div>
      </div>

      {/* Albums Grid Container */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        {!albums || albums.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EmptyState category={category} />
          </div>
        ) : (
          <AlbumGrid
            albums={albums}
            onImageError={handleImageError}
            getImageUrl={getImageUrl}
            currentCategory={category}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumsPage;