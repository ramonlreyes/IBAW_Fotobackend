import { useState, useEffect } from 'react';
import albumService from '../shared/services/albumService';

export const useAlbums = (category) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await albumService.getAllAlbums(category);

      if (response.success) {
        setAlbums(response.data);
        
        // Handle image URL processing
        response.data.forEach(album => {
          if (album.cover) {
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const fullUrl = `${baseURL}${album.cover}`;
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

  const handleImageError = (albumId) => {
    console.warn(`Failed to load cover image for album ${albumId}`);
    setImageErrors(prev => new Set([...prev, albumId]));
  };

  const getImageUrl = (album) => {
    if (imageErrors.has(album._id)) {
      return null;
    }
    
    if (album.cover) {
      if (album.cover.startsWith('http')) {
        return album.cover;
      }
      
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const fullUrl = `${baseURL}${album.cover}`;
      console.log(`Album: ${album.title}, Cover path: ${album.cover}, Full URL: ${fullUrl}`);
      return fullUrl;
    }
    
    return null;
  };

  useEffect(() => {
    fetchAlbums();
  }, [category]);

  return {
    albums,
    loading,
    error,
    imageErrors,
    handleImageError,
    getImageUrl,
    refetch: fetchAlbums
  };
};