import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useAlbums } from '../../../../shared/services/albumContext';
import { useAdminAlbumService } from "../../../albums/hooks/useAdminAlbumService";
import { useAlbumForm } from "../../../albums/hooks/useAlbumForm";
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import { Edit3, Trash2, Eye, Plus, Image, FolderOpen, Camera, Save, X } from 'lucide-react';
import { Navigate } from "react-router-dom";
// REMOVED: import e from "express"; - This was causing the build error
import { Header } from "../../../navigation";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { albums, loading: albumsLoading} = useAlbums();
  const {createAlbum, updateAlbum, deleteAlbum, deleteAlbumImage, uploading } = useAdminAlbumService();
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

  if (!user || !isAdmin()) {
    return <Navigate to='/' replace />;
  }
  
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

  if (albumsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading albums..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex">
        <Header />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <FolderOpen className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500"> Albums</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{albums.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Image className="h-6 w-6 lg:h-8 lg:w-8 text-green-500" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500"> Images</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {albums.reduce((total, album) => total + (album.images?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Camera className="h-6 w-6 lg:h-8 lg:w-8 text-purple-500" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Categories</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {new Set(albums.map(album => album.category)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-orange-500" />
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Views</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {albums.reduce((total, album) => total + (album.views || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Album Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Album
        </button>
      </div>

      {/* Albums Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Albums Management</h2>
        </div>

        <div className="p-4 lg:p-6">
          {albums.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Albums yet</h3>
              <p className="text-gray-500 mb-4">Start creating your first album</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create First Album
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
              {albums.map((album) => (
                <div key={album._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    {album.cover ? (
                      <img
                        src={`http://localhost:5000${album.cover}`}
                        alt={album.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="400" height="300" fill="#F3F4F6"/>
                              <rect x="150" y="120" width="100" height="60" rx="8" fill="#D1D5DB"/>
                              <circle cx="170" cy="140" r="8" fill="#9CA3AF"/>
                              <path d="M180 160L190 150L210 170L230 150L250 180H180V160Z" fill="#9CA3AF"/>
                              <text x="200" y="200" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">No Image</text>
                            </svg>
                          `)}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Camera  className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate" title={album.title}>
                      {album.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 capitalize">{album.category}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {album.images?.length || 0} Images
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openEditModal(album)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Album"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlbum(album._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Album"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {(showCreateModal || editingAlbum) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingAlbum ? 'Edit Album' : 'Create Album'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Album Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter Album Title"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="portraits">Portraits</option>
                    <option value="landscape">Landscape</option>
                    <option value="events">Events</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Enter album description"
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Cover Image
                  </label>
                  <input
                    type="file"
                    name="cover"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Album Images
                  </label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleInputChange}
                    accept="image/*"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select the Images for this Album
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  onClick={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingAlbum ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingAlbum ? 'Update Album' : 'Create Album'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;