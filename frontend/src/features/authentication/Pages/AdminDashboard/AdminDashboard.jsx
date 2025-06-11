import { Navigate, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import AdminStatsCards from "../../components/AdminStatsCards/AdminStatsCard";
import AdminAlbumGrid from "../../../albums/components/AdminAlbumGrid";
import AdminAlbumForm from "../../components/AdminAlbumForm";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const {
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
  } = useAdminDashboard();

  const handleGoBack = () =>{
    navigate('/');
  };

  if(!user || !isAdmin()) {
    return <Navigate to='/' replace />
  }

  if (albumsLoading) {
    return(
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner message="Loading Albums..." />
      </div>
    );
  }

  return(
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
            onClick={handleGoBack}
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center mb-4'
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to HomePage
            </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Photo Albums and Content</p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards albums={albums} />

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Albums Management</h2>
          <p className="text-sm text-gray-600">Create, Edit and Manage your Fotos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Album
        </button>
      </div>

      {/* Albums Grid */}
      <AdminAlbumGrid
        albums={albums}
        onEdit={openEditModal}
        onDelete={handleDeleteAlbum}
        onCreateNew={openCreateModal}
      />

      {/* Modal */}
      {(showCreateModal || editingAlbum) && (
        <AdminAlbumForm
          isEdit={!!editingAlbum}
          formData={formData}
          errors={errors}
          uploading={uploading}
          onInputChange={handleInputChange}
          onSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;