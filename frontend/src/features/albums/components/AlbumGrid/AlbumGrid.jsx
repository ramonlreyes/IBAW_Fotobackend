import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AlbumCard from "../AlbumCard";



const AlbumGrid = ({ albums, onImageError, getImageUrl, currentCategory }) => {
  const navigate = useNavigate();

  // Add safety check for albums prop
  if (!albums || !Array.isArray(albums)) {
    console.warn('AlbumGrid: albums prop is not a valid array:', albums);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <p>No albums data available</p>
        </div>
      </div>
    );
  }

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="columns-1 md:columns-2 gap-4 max-w-6xl mx-auto">
      {albums.map((album) => (
        <div key={album._id} className="w-full">
          <AlbumCard
            album={album}
            onAlbumClick={handleAlbumClick}
            onImageError={onImageError}
            getImageUrl={getImageUrl}
          />
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;