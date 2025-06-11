import { Camera, Plus } from 'lucide-react';
import AdminAlbumCard from '../AdminAlbumCard';

const AdminAlbumGrid = ({ albums, onEdit, onDelete, onCreateNew }) => {
  if(!albums || albums.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow'>
        <div className='px-4 lg:px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg front-medium text-gray-900'>Albums Management</h2>
        </div>
        <div className='p-4 lg:p-6'>
          <div className='text-center py-12'>
            <Camera className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No Albums yet</h3>
            <p className='text-gray-500 mb-4'>Start creating your first Album</p>
            <button
              onClick={onCreateNew}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Create First Album
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className='bg-white rounded-lg shadow'>
      <div className='px-4 lg:px-6 py-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-medium text-gray-900'>Albums Management</h2>
          <span className='text-sm text-gray-500'>{albums.length} Album{albums.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className='p-4 lg:p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'>
          {albums.map((album) => (
            <AdminAlbumCard
              key={album._id}
              album={album}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAlbumGrid;