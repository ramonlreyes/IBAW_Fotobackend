import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          // Verify the token is still valid with the server
          const verifiedUser = await authService.verifyToken();
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            setUser(savedUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null); // Clear user on error
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUserData = useCallback(async () =>{
    try {
      const verifiedUser = await authService.verifyToken();
      if (verifiedUser) {
        setUser(verifiedUser);
        return verifiedUser;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const newUser = JSON.parse(e.newValue);
            setUser(newUser);
          } catch (error) {
            console.error('Error parsing user data from storage:', error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refreshUserData,
    clearError,
    isAuthenticated,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};