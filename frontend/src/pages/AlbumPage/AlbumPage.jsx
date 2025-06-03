import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import albumService from '../../services/albumService';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await albumService.getAllAlbums(category);

        if (response.success) {
          setAlbums(response.data);
        } else {
          throw new Error(response.message || 'Failed to load Albums');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [category]);

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryDisplayName = () => {
    if (!category || category === 'all') return 'All Albums';
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading albums...</p>
        </div>  
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Error Loading Albums</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-wider text-gray-800 mb-2">
              {getCategoryDisplayName()}
            </h1>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {albums.length} {albums.length === 1 ? 'album' : 'albums'} capturing moments and memories
            </p>
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
            <p className="text-gray-500">
              {category && category !== 'all' 
                ? `No albums found in the "${getCategoryDisplayName()}" category.`
                : 'No albums have been created yet.'
              }
            </p>
          </div>
        ) : (
          <div className="masonry-container">
            {albums.map((album, index) => (
              <div
                key={album._id}
                className="masonry-item"
                onClick={() => handleAlbumClick(album._id)}
              >
                <div className="album-card group">
                  <div className="album-image-container">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="album-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE4NVYxMzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PC9wYXRoPgo8L3N2Zz4K';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="album-overlay">
                      <div className="album-overlay-content">
                        <h3 className="album-title">{album.title}</h3>
                        
                        <div className="album-meta">
                          <div className="meta-item">
                            <ImageIcon size={14} />
                            <span>{album.images?.length || 0} photos</span>
                          </div>
                          
                          {album.createdAt && (
                            <div className="meta-item">
                              <Calendar size={14} />
                              <span>{formatDate(album.createdAt)}</span>
                            </div>
                          )}
                          
                          {album.category && (
                            <div className="category-badge">
                              {album.category}
                            </div>
                          )}
                        </div>
                        
                        <div className="view-album-btn">
                          <Eye size={16} />
                          <span>View Album</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .masonry-container {
          column-count: 3;
          column-gap: 1.5rem;
          break-inside: avoid;
        }

        @media (max-width: 1024px) {
          .masonry-container {
            column-count: 2;
            column-gap: 1rem;
          }
        }

        @media (max-width: 640px) {
          .masonry-container {
            column-count: 1;
          }
        }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }

        .album-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .album-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .album-image-container {
          position: relative;
          overflow: hidden;
        }

        .album-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .group:hover .album-image {
          transform: scale(1.05);
        }

        .album-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.7) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
        }

        .group:hover .album-overlay {
          opacity: 1;
        }

        .album-overlay-content {
          color: white;
        }

        .album-title {
          font-size: 1.125rem;
          font-weight: 400;
          letter-spacing: 0.025em;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .album-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .category-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          width: fit-content;
        }

        .view-album-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.9;
          transition: opacity 0.2s ease;
        }

        .view-album-btn:hover {
          opacity: 1;
        }
      `}
      </style>
    </div>
  );
};

export default AlbumsPage;