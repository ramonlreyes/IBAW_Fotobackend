import { useState, useEffect, useCallback } from "react";
import albumService from "./albumService";

export const useGetRandomImage = (numberOfImages = 24) => {
  const [randomImages, setRandomImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allAvailableImages, setAllAvailableImages] = useState([]);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];

    for(let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
  }, []);

  const transformImagesForCarousel = useCallback((imagePath, album, imageIndex) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const fullImageUrl = imagePath.startsWith('http')
      ? imagePath
      : `${baseURL}${imagePath}`;

    const filename = imagePath.split('/').pop() || 'image';

    return {
      imageUrl: fullImageUrl,
      src: fullImageUrl,
      alt: `${album.title} - Image ${imageIndex + 1}`,
      title: album.title,
      description: `From the ${album.title} collection in ${album.category}`,
      albumId: album._id,
      albumTitle: album.title,
      albumCategory: album.category,
      filename: filename,
      originalPath: imagePath
    };
  }, []);

  const fetchRandomImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const albumsResponse = await albumService.getAllAlbums();

      if (!albumsResponse.success) {
        throw new Error(albumsResponse.message || 'Failed to fetch albums');
      }

      const albums = albumsResponse.data;
      console.log(`Processing ${albums.length} albums for random image selection`);

      // Extract all images from all albums
      const allImages = [];

      albums.forEach(album => {
        if (!album.images || !Array.isArray(album.images) || album.images.length === 0) {
          console.warn(`Album "${album.title}" has no images, skipping`);
          return;
        }

        // Transform each image for the carousel
        album.images.forEach((imagePath, index) => {
          const transformedImage = transformImagesForCarousel(imagePath, album, index);
          allImages.push(transformedImage);
        });

        // Add cover image if it's not already in the images array
        if (album.cover && !album.images.includes(album.cover)) {
          const coverImage = transformImagesForCarousel(album.cover, album, -1);
          coverImage.title = `${album.title} (Cover)`;
          coverImage.description = `Cover image from ${album.title}`;
          allImages.push(coverImage);
        }
      });

      console.log(`Found ${allImages.length} total images across all albums`);

      setAllAvailableImages(allImages);

      const shuffledImages = shuffleArray(allImages);
      const selectedImages = shuffledImages.slice(0, numberOfImages);

      console.log(`Selected ${selectedImages.length} random images for display`);
      setRandomImages(selectedImages);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load portfolio images';
      setError(errorMessage);
      console.error('Error fetching random portfolio images:', error);
      setRandomImages([]);
    } finally {
      setLoading(false);
    }
  }, [numberOfImages, shuffleArray, transformImagesForCarousel]);

  const refreshRandomSelection = useCallback(() => {
    if(allAvailableImages.length === 0) {
      fetchRandomImages();
      return;
    }

    // Shuffle existing images and select new ones
    const shuffledImages = shuffleArray(allAvailableImages);
    const selectedImages = shuffledImages.slice(0, numberOfImages);
    setRandomImages(selectedImages);
  }, [allAvailableImages, numberOfImages, shuffleArray, fetchRandomImages]);

  const getRandomImageByCategory = useCallback((category) => {
    const categoryImages = allAvailableImages.filter(image =>
      image.albumCategory.toLowerCase() === category.toLowerCase()
    );

    const shuffledImages = shuffleArray(categoryImages);
    return shuffledImages.slice(0, numberOfImages);
  }, [allAvailableImages, numberOfImages, shuffleArray]);

  // Fetch images when the hook mounts or numberOfImages changes
  useEffect(() => {
    fetchRandomImages();
  }, [fetchRandomImages]);

  // Return the hook's state and functions
  return {
    randomImages,
    loading,
    error,
    totalAvailableImages: allAvailableImages.length,
    allAvailableImages,
    refetch: fetchRandomImages,
    refreshRandomSelection,
    getRandomImageByCategory,
    shuffleArray
  };
};