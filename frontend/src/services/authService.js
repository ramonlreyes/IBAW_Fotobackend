import api from "./api";

const authService = {

  async login(email, password) {
    console.log('API Base URL:', api.defaults.baseURL);
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. PLease try again later.');
      } else {
        throw new Error('Login failed. PLease check your connection and try again.');
      }
    }
  },

  async logout() {
    try{
      localStorage.removeItem('user');

      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failes:', error);
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/signup', userData);

      if(response.data.sucess && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
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
      if(response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
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