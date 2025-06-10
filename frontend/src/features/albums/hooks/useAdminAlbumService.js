import { useState, useCallback } from "react";
import { useAlbums } from "../../../shared/services/albumContext";
import albumService from "./albumService";

export const useAdminAlbumService = () => {
  const { refetch } = useAlbums();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const createAlbum = useCallback(async (albumData) => {
    setUploading(true);
    setError(null);

    try {
      const response = await albumService.createAlbum(albumData);

      if (response.success) {
        await refetch();
        return { success: true, data: response.data};
      } else {
        throw new Error(response.message || 'Failed to create Album');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error creating Album';
      setError(errorMessage)
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const updateAlbum = useCallback(async (AlbumGrid, updateData) => {
    setUploading(true);
    setError(null);

    try {
      const response = await albumService.updateAlbum(AlbumGrid, updateData);

      if (response.success) {
        await refetch();
        return {success: true, data: response.data};
      } else {
        throw new Error(response.message || 'Failed to update Album');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error updating Album';
      setError(errorMessage)
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const deleteAlbum = useCallback(async (albumId) => {
    setUploading(true);
    setError(null);

    try {
      const response = await albumService.deleteAlbum(albumId);

      if (response.success) {
        await refetch();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delet Album');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting Album';
      setError(errorMessage)
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const deleteAlbumImage = useCallback(async (albumId, ImageId) => {
    setUploading(true);
    setError(null);

    try {

      const response = await albumService.deleteAlbumImage(albumId, ImageId);

    if (response.success) {
      await refetch();
      return {success: true }
    } else {
      throw new Error(response.message || 'Failed to delete Image');
    } 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting Image';
      setError(errorMessage)
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    deleteAlbumImage,
    uploading,
    error,
    clearError
  };
};