import { useState, useCallback, useMemo, useEffect } from "react";
import { useAlbums } from "../../../shared/services/albumContext";
import albumService from "./albumService";

export const useAlbumData = ({ category = null, albumId = null} = {}) => {
  const { albums: allAlbums, loading: contextLoading, error: contextError, refetch} = useAlbums();

  const [singleAlbum, setSingleAlbum] = useState(null);
  const [singleAlbumLoading, setSingleAlbumLoading] = useState(false);
  const [singleAlbumError, setSingleAlbumError] = useState(null);

  const [imageErrors, setImageErrors] = useState(new Set());

  const filteredAlbums = useMemo(() => {
    if (!category || category === 'all') {
      return allAlbums;
    }

    return allAlbums.filter(album =>
        album.category?.toLowerCase() === category.toLowerCase()
    );
  }, [allAlbums, category]);

  // Fetch for single album (Id)
  useEffect(() => {

    if (!albumId) {
      setSingleAlbum(null);
      return;
    }

    const fetchSingleAlbum = async () => {
      try {
        setSingleAlbumLoading(true);
        setSingleAlbumError(null);

        const response = await albumService.getAlbum(albumId);

        if (response.success) {
          setSingleAlbum(response.data);
        } else {
          throw new Error(response.message || 'Failed to load album');
        }
      } catch (error) {
        setSingleAlbumError(error.message);
        console.error('Error fetching album:', error);
      } finally {
        setSingleAlbumLoading(false);
      }
    };

    fetchSingleAlbum();
  }, [albumId]);


  const categoryStats = useMemo(() => {
    const stats = {
      all: {count: allAlbums.length, albums: allAlbums}
    };

    allAlbums.forEach(album => {
      if (album.category) {
        const categoryKey = album.category.toLowerCase();
        if(!stats[categoryKey]) {
          stats[categoryKey] = {count: 0, albums: []};
        }
        stats[categoryKey].count++;
        stats[categoryKey].albums.push(album);
      }
    });

    return stats;
  }, [allAlbums]);

    // Helper functions
  const handleImageError = useCallback((albumId) => {
  console.warn(`Failed to load image for album ${albumId}`);
    setImageErrors(prev => new Set([...prev, albumId]));
  }, []);

  const getImageUrl = useCallback((pathOrAlbum) => {
    const isAlbum = typeof pathOrAlbum === 'object' && pathOrAlbum._id;
    
    if (isAlbum) {
      if (imageErrors.has(pathOrAlbum._id)) return null;
      if (!pathOrAlbum.cover) return null;
      return albumService.buildImageUrl(pathOrAlbum.cover);
    }
    
    return albumService.buildImageUrl(pathOrAlbum);
  }, [imageErrors]);

  const refetchSingleAlbum = useCallback(() => {
    if (albumId) {
      setSingleAlbum(null);
      setSingleAlbumError(null);

      const fetchSingleAlbum = async () => {
        try {
          setSingleAlbumLoading(true);
          const response = await albumService.getAlbum(albumId);
           if (response.success) {
              setSingleAlbum(response.data);
            }
        } catch (error) {
          setSingleAlbumError(error.message);
        } finally {
          setSingleAlbumLoading(false);
        }
      };
      fetchSingleAlbum();
    }
  }, [albumId]);

  // Single album
  if (albumId) {
    return {
      album: singleAlbum,
      loading: singleAlbumLoading,
      error: singleAlbumError,
      refetch: refetchSingleAlbum,
      getImageUrl,
      handleImageError,
      mode: 'single'
    };
  }

  return {
    albums: filteredAlbums,
    loading: contextLoading,
    error: contextError,
    refetch,
    getImageUrl,
    handleImageError,
    categoryStats,
    totalAlbums: allAlbums.length,
    hasAlbumsInCategory: (cat) => {
      const stats = categoryStats[cat?.toLowerCase()];
      return stats ? stats.count > 0 :false;
    },
    mode: 'collection'
  };
}; 