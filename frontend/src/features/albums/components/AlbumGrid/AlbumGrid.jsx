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
      <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
        <div className="text-center text-gray-500">
          <p className="text-sm sm:text-base">No {type === 'collection' ? 'albums' : 'images'} data available</p>
        </div>
      </div>
    );
  }

  const getColumnClasses = () => {
    switch (columns) {
      case 1: return 'columns-1';
      case 2: return 'columns-1 sm:columns-1 md:columns-2';
      case 3: return 'columns-1 sm:columns-2 lg:columns-2 xl:columns-3';
      case 4: return 'columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4';
      default: return 'columns-1 sm:columns-1 md:columns-2';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 2: return 'gap-1 sm:gap-1.5 md:gap-2';
      case 4: return 'gap-2 sm:gap-3 md:gap-4';
      case 6: return 'gap-3 sm:gap-4 md:gap-6';
      case 8: return 'gap-4 sm:gap-6 md:gap-8';
      default: return 'gap-2 sm:gap-3 md:gap-4';
    }
  }

  const handleItemClick = (album, index) => {
    if (onItemClick) {
      onItemClick(album);
    } else {
      navigate(`/album/${album._id}`);
    }
  };

  return (
    <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl xl:max-w-screen-2xl">
      <div className={`${getColumnClasses()} ${getGapClass()}`}>
        {albums.map((album, index) => (
            <AlbumCard
              key={album._id || index}
              album={album}
              onItemClick={() => handleItemClick(album, index)}
              onImageError={onImageError}
              getImageUrl={getImageUrl}
              type={type}
              albumTitle={albumTitle}
              gap={gap}
            />
        ))}
      </div>
    </div>
  );
};

export default AlbumGrid;