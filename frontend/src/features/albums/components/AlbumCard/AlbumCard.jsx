import { Eye, Calendar, Image } from 'lucide-react';
import { formatDate, createFallbackImage, handleImageError } from '../utils/albumHelpers';

const AlbumCard = ({ album, onAlbumClick, onImageError, getImageUrl }) => {

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
      onClick={() => onAlbumClick(album._id)}
    >
      <div className="relative overflow-hidden">
        {getImageUrl(album) ? (
          <img
            src={getImageUrl(album)}
            alt={album.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Image size={48} className="mx-auto mb-2" />
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
            <Eye size={20} />
            <span className="font-medium">View Album</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-3 line-clamp-2">
          {album.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Image size={16} />
            <span>{album.images?.length || 0} photos</span>
          </div>
          
          {album.createdAt && (
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>{formatDate(album.createdAt)}</span>
            </div>
          )}
        </div>
        
        {album.category && (
          <div className="mt-4">
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
              {album.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;