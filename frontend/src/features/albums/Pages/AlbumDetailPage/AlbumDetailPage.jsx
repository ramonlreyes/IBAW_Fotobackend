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

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Back navigation */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-light tracking-wide">Back to Albums</span>
            </button>

            {/* Category Title */}
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-2">
              {album.title}
            </h1>

            {album.category && (
              <p className="text-gray-600 mt-2">
                {album.category} • {album.images?.length || 0} images
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Albums Grid Container */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
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
            gap={4}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumDetailPage;