import api from '../../../shared/services/apiClient';

const albumService = {


  async getAllAlbums(category = null) {
    try {
      const params = category && category !== 'all' ? { category } : {};
      const response = await api.get('/albums', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  },

  async getAlbum(id) {
    try {
      const response = await api.get(`/albums/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching album:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  async createAlbum(albumData) {
    try {
      const formData = new FormData();
      formData.append('title', albumData.title);

      if (albumData.description) {
        formData.append('description', albumData.description);
      }
      
      if (albumData.category) {
        formData.append('category', albumData.category);
      }
      
      if (albumData.cover) {
        formData.append('cover', albumData.cover);
      }
      
      if (albumData.images && albumData.images.length > 0) {
        albumData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await api.post('/albums', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  },

  async updateAlbum(id, updateData) {
    try {
      const formData = new FormData();
      
      if (updateData.title) {
        formData.append('title', updateData.title);
      }

      if (updateData.description !== undefined) {
        formData.append('description', updateData.description);
      }
      
      if (updateData.category) {
        formData.append('category', updateData.category);
      }
      
      if (updateData.cover) {
        formData.append('cover', updateData.cover);
      }
      
      if (updateData.images && updateData.images.length > 0) {
        updateData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await api.put(`/albums/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating album:', error);
      throw error;
    }
  },

  async deleteAlbum(id) {
    try {
      const response = await api.delete(`/albums/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
    }
  },

  async deleteAlbumImage(albumId, imageId) {
    try {
      const response = await api.delete(`/albums/${albumId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting album image:', error);
      throw error;
    }
  }, 

  buildImageUrl(imagePath) {
    const baseURL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${baseURL}${imagePath}`;
  }
};

export default albumService;