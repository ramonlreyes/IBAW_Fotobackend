import { useNavigate, useParams } from "react-router-dom";
import { useAlbumData } from "../../hooks/useAlbum";
import AlbumGrid from "../../components/AlbumGrid";
import { getCategoryDisplayName } from "../../../../constants/categories";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import ErrorState from "../../../../shared/components/ErrorState";
import EmptyState from "../../../../shared/components/EmptyState";


const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();

  console.log('Album ID from URL:', albumId);
  console.log('Album ID length:', albumId?.length);
  
  const {
    album,
    loading,
    error,
    refetch,
    getImageUrl,
    handleImageError
  } = useAlbumData(albumId ? {albumId} : {});


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading album..." />
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
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-light tracking-wide">Back to Albums</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Cover Image Section */}
      {coverImageUrl && (
        <div className="bg-white py-8 md:py-16">
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '105rem' }}>
            <div className="relative">
              <img
                src={coverImageUrl}
                alt={`${album.title} cover`}
                className="w-full object-cover"
                style={{ 
                  height: '1038px',
                  margin: '0 auto',
                  display: 'block'
                }}
                onError={() => handleImageError(album._id)}
              />
              
              {/* Back to Albums link - top left inside image */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-20 inline-flex items-center text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-light tracking-wide">Back to Albums</span>
              </button>
              
              {/* Title overlay at bottom center - matching reference style */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                <div className="text-center text-white">
                  <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-4" style={{ fontFamily: 'serif' }}>
                    {album.title}
                  </h1>
                  {album.category && (
                    <p className="text-sm md:text-base font-light tracking-widest uppercase opacity-90">
                      {album.category} • {album.images?.length || 0} images
                    </p>
                  )}
                </div>
              </div>

              {/* Optional dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
        </div>
      )}

      {/* Album Title Section (if no cover image) */}
      {!coverImageUrl && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
                {album.title}
              </h1>
              {album.category && (
                <p className="text-gray-600 text-lg">
                  {album.category} • {album.images?.length || 0} images
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid Container */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        {!album.images || album.images.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500">No Images in this Album</p>
          </div>
        ) : (
          <AlbumGrid
            albums={album.images.map((imagePath, index) => ({
              _id: `${album._id}-img-${index}`,
              path: imagePath
            }))}
            onImageError={handleImageError}
            getImageUrl={getImageUrl}
            type="album"
            albumTitle={album.title}
            columns={3}
            gap={2}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumDetailPage;