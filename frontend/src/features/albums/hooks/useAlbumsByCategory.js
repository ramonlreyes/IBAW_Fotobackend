import { useState, useEffect, useMemo } from 'react';
import albumService from './albumService';
import {PORTFOLIO_CATEGORIES } from '../../../constants/categories';

export const useAlbumsByCategory = (currentCategory = 'all') => {

  const [allAlbums, setAllAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());


  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await albumService.getAllAlbums();

      if (response.success) {
        setAllAlbums(response.data);
        
        response.data.forEach(album => {
          if (album.cover) {
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const fullUrl = `${baseURL}${album.cover}`;
          }
        });
        
        console.log(`Loaded ${response.data.length} albums from database`);
      } else {
        throw new Error(response.message || 'Failed to load Albums');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching albums:', error);
      setAllAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter albums by current category
  const filteredAlbums = useMemo(() => {
    if (!currentCategory || currentCategory === 'all') {
      return allAlbums;
    }
    

    return allAlbums.filter(album => {
      if (!album.category) return false; 
      
      return album.category.toLowerCase() === currentCategory.toLowerCase();
    });
  }, [allAlbums, currentCategory]);


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

  const categoryStats = useMemo(() => {
    const stats = {
      all: { count: allAlbums.length, albums: allAlbums }
    };
    
    allAlbums.forEach(album => {
      if (album.category) {
        const categoryKey = album.category.toLowerCase();
        if (!stats[categoryKey]) {
          stats[categoryKey] = { count: 0, albums: [] };
        }
        stats[categoryKey].count++;
        stats[categoryKey].albums.push(album);
      }
    });
    
    return stats;
  }, [allAlbums]);


  const getAlbumsForCategory = (category) => {
    if (category === 'all') return allAlbums;
    
    return allAlbums.filter(album => 
      album.category && 
      album.category.toLowerCase() === category.toLowerCase()
    );
  };


  const hasAlbumsInCategory = (category) => {
    const stats = categoryStats[category.toLowerCase()];
    return stats ? stats.count > 0 : false;
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  
  return {

    albums: filteredAlbums,
    loading,
    error,
    imageErrors,
    handleImageError,
    getImageUrl,
    refetch: fetchAlbums,
    allAlbums,
    currentCategory,
    categoryStats,
    hasAlbumsInCategory,
    getAlbumsForCategory,
    totalAlbums: allAlbums.length
  };
};
