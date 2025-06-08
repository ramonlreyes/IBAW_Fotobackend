import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AlbumCard from "../AlbumCard";


const AlbumGrid = ({ 
  albums,
  onImageError,
  getImageUrl,
  currentCategory,
  type = 'collection',
  columns = 2,
  gap = 8,
  albumTitle,
  onItemClick
}) => {



  const navigate = useNavigate();

  // Add safety check for albums prop
  if (!albums || !Array.isArray(albums)) {
    console.warn('AlbumGrid: albums prop is not a valid array:', albums);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <p>No {type === 'collection' ? 'albums' : 'images'} data available</p>
        </div>
      </div>
    );
  }

  const getColumnClasses = () => {
    switch (columns) {
      case 1: return 'columns-1';
      case 2: return 'columns-1 md:columns-2';
      case 3: return 'columns-1 md:columns-2 lg:columns-3';
      case 4: return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4';
      default: return 'columns-1 md:columns-2';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 4: return 'gap-4';
      case 6: return 'gap-6';
      case 8: return 'gap-8';
      default: return 'gap-8';
    }
  }

  return (
    <div className={`${getColumnClasses()} ${getGapClass()} max-w-6xl mx-auto`}>
      {albums.map((album, index) => (
          <AlbumCard
            key={album._id || index}
            album={album}
            onItemClick={() => navigate(`/album/${album._id}`)}
            onImageError={onImageError}
            getImageUrl={getImageUrl}
            type={type}
            albumTitle={albumTitle}
          />
      ))}
    </div>
  );
};

export default AlbumGrid;