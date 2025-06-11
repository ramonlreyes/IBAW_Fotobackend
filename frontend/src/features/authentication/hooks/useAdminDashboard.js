import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlbums } from "../../../shared/services/albumContext";
import { useAdminAlbumService } from "../../albums/hooks/useAdminAlbumService";
import { useAlbumForm } from "../../albums/hooks/useAlbumForm";

export const useAdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { albums, loading: albumsLoading } = useAlbums();
  const { createAlbum, updatAlbum, deleteAlbum, deleteAlbumImage, uploading } = useAdminAlbumService();
  const {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    getFormDataForSubmission
  } = useAlbumForm();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createAlbum(getFormDataForSubmission());
      setShowCreateModal(false);
      resetForm();
      alert('Album created Successfully!');
    } catch (error) {
      alert(`Error creating Album: ${error.message}`);
    }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateAlbum(editingAlbum._id, getFormDataForSubmission());
      setEditingAlbum(null);
      resetForm();
      alert('Album updated Successfully!');
    } catch (error) {
      alert(`Error updating Album: ${error.message}`);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if(!confirm('Are you sure you want to delete this Album? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAlbum(albumId);
      alert('Album deleted Successfully!');
    } catch (error) {
      alert(`Error deleting Album: ${error.message}`);
    }
  };

  const handleDeleteAlbumImage = async (albumId, imageId) => {
    if (!confirm('Are you sure you want to delete this Image? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAlbumImage(albumId, imageId);
      alert('Image deleted Successfully!');
    } catch (error) {
      alert(`Error deleting Image: ${error.message}`);
    }
  };

  const openEditModal = (album) => {
    setEditingAlbum(album);
    resetForm({
      title: album.title,
      description: album.description || '',
      category: album.category
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingAlbum(null);
    resetForm();
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  return{
    user,
    isAdmin,
    albums,
    albumsLoading,
    formData,
    errors,
    uploading,
    showCreateModal,
    editingAlbum,
    handleInputChange,
    handleCreateAlbum,
    handleUpdateAlbum,
    handleDeleteAlbum,
    handleDeleteAlbumImage,
    openEditModal,
    closeModal,
    openCreateModal
  };
};