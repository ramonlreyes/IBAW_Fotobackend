import { useAuth } from '../contexts/AuthContext'

export const useAuthActions = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async (callback) => {
    try {
      await logout();
      if (callback) callback();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email || 'User';
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    handleLogout,
    getUserDisplayName
  };
};