import { useNavigate } from "react-router-dom";
import { useState } from "react";


const AlbumCard = ({
  album,
  onItemClick, 
  onImageError,
  getImageUrl,
  type = 'collection',
  albumTitle }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageFailed(true);
    if (onImageError) {
      onImageError(album._id);
    }
  };

  const isAlbumDetail = type === 'album';
  const imageUrl = isAlbumDetail
    ? getImageUrl(album.path || album)
    : getImageUrl(album);

  return (
    <div
      className="relative overflow-hidden cursor-pointer group transition-all duration-300 hover:opacity-90 mb-4"
      onClick={() => onItemClick(isAlbumDetail ? album : album._id)}
    >
      {/* Background Image */}
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={isAlbumDetail ? `${albumTitle} - Image` : album.title}
          className={`w-full h-auto object-cover transition-all duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        />
      ) : (
        <div className="w-full aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs">No Image</p>
          </div>
        </div>
      )}

      {/* Overlay Content - Only show for albums, not individual images */}
    {!isAlbumDetail && (
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
          <h3 className="font-medium text-lg mb-2 drop-shadow-lg">
            {album.title}
          </h3>
          
          {album.createdAt && (
            <p className="text-sm opacity-90 drop-shadow-lg">
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
    {isAlbumDetail && (
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    )}
    </div>
  );
};

export default AlbumCard;