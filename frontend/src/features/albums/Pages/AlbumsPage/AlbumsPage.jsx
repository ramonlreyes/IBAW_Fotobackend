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
    return <LoadingSpinner message="Loading albums..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-wider text-gray-800 mb-2">
              {getCategoryDisplayName(category)}
            </h1>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} capturing moments and memories
            </p>
          </div>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {albums.length === 0 ? (
          <EmptyState category={category} />
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