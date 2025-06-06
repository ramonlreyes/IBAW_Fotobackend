import { createContext, useContext, useState, useEffect, useRef } from 'react';
import albumService from '../../features/albums/hooks/albumService';

const AlbumContext = createContext();

// Singleton pattern to prevent multiple simultaneous requests
let fetchPromise = null;

export const AlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const hasInitialFetchRef = useRef(false);

  const fetchAlbums = async (force = false) => {
    // If already fetching, return the existing promise
    if (!force && fetchPromise) {
      return fetchPromise;
    }

    // Create a new fetch promise
    fetchPromise = (async () => {
      try {
        console.log('Fetching albums...');
        const response = await albumService.getAllAlbums();
        
        if (!isMountedRef.current) return;
        
        if (response.success) {
          setAlbums(response.data);
          setError(null);
        } else {
          throw new Error(response.message || 'Failed to fetch albums');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        
        setError(err.message);
        console.error('Error fetching albums:', err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        fetchPromise = null; // Clear the promise after completion
      }
    })();

    return fetchPromise;
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch once on mount
    if (!hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      fetchAlbums();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const value = {
    albums,
    loading,
    error,
    refetch: () => fetchAlbums(true), // Force refetch
  };

  return (
    <AlbumContext.Provider value={value}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbums = () => {
  const context = useContext(AlbumContext);
  
  if (!context) {
    throw new Error('useAlbums must be used within AlbumProvider');
  }
  
  return context;
};