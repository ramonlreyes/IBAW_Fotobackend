import { useCallback, useEffect, useState } from "react";


export const useImageLoader = (imageUrl, currentIndex) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentIndex, imageUrl]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageRetry = useCallback(() => {
    setImageError(false);
    setImageLoaded(false);
  }, []);

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    handleImageRetry
  };
};