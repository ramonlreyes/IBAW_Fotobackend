import api from "../../../shared/services/apiClient";

const authService = {
  async login(email, password) {
    console.log('API Base URL:', api.defaults.baseURL);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.user) {
        const safeUserData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: response.data.user.avatar
        };
        
        localStorage.setItem('user', JSON.stringify(safeUserData));
        return safeUserData;
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error) {
       if (error.message && !error.response) {
        throw error;
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Login failed. Please check your connection and try again.');
      }
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
      
      localStorage.removeItem('user');
      
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout request failed:', error);
      
      localStorage.removeItem('user');
      
      return { success: true, warning: 'Server logout failed but local logout successful' };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.success && response.data.user) {
        const safeUserData = {
          id: response.data.user.id || response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: response.data.user.avatar
        };
        
        localStorage.setItem('user', JSON.stringify(safeUserData));
        return safeUserData;
      } else {
        throw new Error('Registration failed: Invalid response from server');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      if (response.data.success && response.data.user) {
        const safeUserData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: response.data.user.avatar
        };
        
        localStorage.setItem('user', JSON.stringify(safeUserData));
        return safeUserData;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.sucess) {
        if (response.data.user) {
          const safeUserData ={
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            avatar: response.data.user.avatar
          };
          localStorage.setItem('user', JSON.stringify(safeUserData));
          return safeUserData;
        }
        return this.getCurrentUser();
      }
      return null;
    } catch (error) {
      localStorage.removeItem('user');
      throw error;
    }
  },

  async isAuthenticatedAsync() {
    const localUser = this.getCurrentUser();
    if (!localUser) {
      return false;
    }
    try {
      const verifiedUser = await this.verifyToken();
      return verifiedUser !== null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  async getCurrentUserVerified() {
    return await this.verifyToken();
  }
};

export default authService;