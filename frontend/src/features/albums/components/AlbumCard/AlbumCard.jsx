import { useNavigate } from "react-router-dom";
import { useState } from "react";


const AlbumCard = ({
  album,
  onItemClick, 
  onImageError,
  getImageUrl,
  type = 'collection',
  albumTitle,
  gap = 4 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageStartedLoading, setImageStartedLoading] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageFailed(true);
    if (onImageError) {
      onImageError(album._id);
    }
  };

  const handleImageLoadStart = () => {
    setImageStartedLoading(true);
  };

  const isAlbumDetail = type === 'album';
  const imageUrl = isAlbumDetail
    ? getImageUrl(album.path || album)
    : getImageUrl(album);

  // Get margin class based on gap to sync with grid spacing
  const getMarginClass = () => {
    switch (gap) {
      case 2: return 'mb-1 sm:mb-1.5 md:mb-2';
      case 4: return 'mb-2 sm:mb-3 md:mb-4';
      case 6: return 'mb-3 sm:mb-4 md:mb-6';
      case 8: return 'mb-4 sm:mb-6 md:mb-8';
      default: return 'mb-2 sm:mb-3 md:mb-4';
    }
  };

  return (
    <div
      className={`relative overflow-hidden cursor-pointer group transition-all duration-300 hover:opacity-90 ${getMarginClass()}`}
      onClick={() => onItemClick(isAlbumDetail ? album : album._id)}
    >

      {/* Image Container with Skeleton */}
      <div className="relative">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-none sm:rounded-sm md:rounded aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2]" />
        )}

        {/* Background Image */}
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={isAlbumDetail ? `${albumTitle} - Image` : album.title}
            className={`w-full h-auto object-cover transition-all duration-700 rounded-none sm:rounded-sm md:rounded ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onLoadStart={handleImageLoadStart}
          loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-none sm:rounded-sm md:rounded">
            <div className="text-gray-400 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs sm:text-xs md:text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>


      {/* Overlay Content - Only show for albums, not individual images */}
    {!isAlbumDetail && imageLoaded && (
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-none sm:rounded-sm md:rounded">
        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2 sm:px-3 md:px-4">
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2 drop-shadow-lg">
            {album.title}
          </h3>
          
          {album.createdAt && (
            <p className="text-xs sm:text-sm opacity-90 drop-shadow-lg">
              {new Date(album.createdAt).toLocaleDateString('en-GB', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    )}

    {/* Simple hover overlay for images */}
    {isAlbumDetail && imageLoaded && (
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-none sm:rounded-sm md:rounded" />
    )}
    </div>
  );
};

export default AlbumCard;