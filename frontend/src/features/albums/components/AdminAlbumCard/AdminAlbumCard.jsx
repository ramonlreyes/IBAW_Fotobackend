import { Edit3, Trash2, Camera } from 'lucide-react';
import { createFallbackImage } from '../utils/albumHelpers';

const AdminAlbumCard = ({ album, onEdit, onDelete }) => {
  const handleImageError = (e) => {
    e.target.src = createFallbackImage();
  };

  return(
    <div className='border rounded-lg overflow-hidden hover:shadows-md transition-shadow'>
      <div className='aspect-w-16 aspect-h-12 bg-gray-200'>
        {album.cover ? (
          <img
            src={`http://localhost:5000${album.cover}`}
            alt={album.title}
            className='w-full h-48 object-cover'
            onError={handleImageError}
          />
        ) : (
          <div className='w-full h-48 bg-gray-200 flex items-center justify-center'>
            <Camera className='h-12 w-12 text-gray-400' />
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 mb.1 truncate' title={album.title}>{album.title}</h3>
        <p className='text-sm text-gray-500 mb-2 capitalize'>{album.category}</p>
        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{album.description}</p>

        <div className='felx items-center justify-between'>
          <span className='text-xs text-gray-500 pe-2'>
            {album.images?.length || 0} Images 
          </span>
          <span className='text-xs text-gray-500'>
            {album.views || 0} Views
          </span>
        </div>

        <div className='flex justify-end space-x-1 mt-3 pt-3 border-t'>
          <button
            onClick={() => onEdit(album)}
            className='p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors'
            title='Edit Album'
          >
            <Edit3 className='h-4 w-4' />
          </button>
          <button
            onClick={() => onDelete(album._id)}
            className='p-2 text-red-600 hover:bg-red-50 rounded transition-colors'
            title='Delete Album'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAlbumCard;