import { useNavigate } from "react-router-dom";
import AlbumCard from "../AlbumCard";

const AlbumGrid = ({ albums, onImageError, getImageUrl, currentCategory}) => {

  const naviagte = useNavigate();

  const handleAlbumClick = (albumId) => {
    naviagte(`/album/${albumId}`);
  };

  return(
    <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => {
        <AlbumCard
          key={album._id}
          album={album}
          onAlbumCLick={handleAlbumClick}
          onImageError={onImageError}
          getImageUrl={getImageUrl}
        />
      })}
    </div>
  );
};

export default AlbumGrid;