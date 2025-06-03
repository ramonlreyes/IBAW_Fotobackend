import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Calendar, Image } from 'lucide-react';
import albumService from '../../services/albumService';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await albumService.getAllAlbums(category);

        if (response.success) {
          setAlbums(response.data);
          
          response.data.forEach(album => {
            console.log(`Album: ${album.title} (ID: ${album._id})`);
            console.log(`Cover path from DB: ${album.cover}`);
            if (album.cover) {
              const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
              const fullUrl = `${baseURL}${album.cover}`;
              console.log(`Full cover URL: ${fullUrl}`);
            }
          });
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

  const handleImageError = (albumId, e) => {
    console.warn(`Failed to load cover image for album ${albumId}`);
    setImageErrors(prev => new Set([...prev, albumId]));
    
    // Set fallback image
    e.target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#F3F4F6"/>
        <rect x="150" y="120" width="100" height="60" rx="8" fill="#D1D5DB"/>
        <circle cx="170" cy="140" r="8" fill="#9CA3AF"/>
        <path d="M180 160L190 150L210 170L230 150L250 180H180V160Z" fill="#9CA3AF"/>
        <text x="200" y="200" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">No Image</text>
      </svg>
    `)}`;
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

  // Helper function to get image URL with fallback
  const getImageUrl = (album) => {
    if (imageErrors.has(album._id)) {
      return null; // Will show fallback
    }
    
    if (album.cover) {
      // If it's already a full URL, use it
      if (album.cover.startsWith('http')) {
        return album.cover;
      }
      
      // Construct full URL using your backend base URL
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Your backend stores paths like "/uploads/folder/file.jpg"
      // So we just need to prepend the base URL
      const fullUrl = `${baseURL}${album.cover}`;
      
      console.log(`Album: ${album.title}, Cover path: ${album.cover}, Full URL: ${fullUrl}`);
      
      return fullUrl;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading albums...</p>
        </div>  
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Albums</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
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

      {/* Albums Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <Image size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
            <p className="text-gray-500">
              {category && category !== 'all' 
                ? `No albums found in the "${getCategoryDisplayName()}" category.`
                : 'No albums have been created yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                onClick={() => handleAlbumClick(album._id)}
              >
                <div className="relative overflow-hidden">
                  {getImageUrl(album) ? (
                    <img
                      src={getImageUrl(album)}
                      alt={album.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => handleImageError(album._id, e)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumsPage;
