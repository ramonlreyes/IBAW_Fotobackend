import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthActions } from '../../hooks/useAuthActions';

const AuthButton = ({ isMobile = false }) => {
  const { user, isAuthenticated, handleLogout } = useAuthActions();
 
  const baseClasses = `block w-full py-2 px-4 text-sm tracking-wide border rounded transition-colors duration-200 text-center ${
    isMobile ? 'mb-4' : ''
  }`;

  // If user is authenticated, show logout button
  if (user && isAuthenticated) {
    return (
      <button
        onClick={() => handleLogout()}
        className={`${baseClasses} text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700`}
      >
        <div className='flex items-center justify-center'>
          <LogOut size={16} className='mr-2' />
          Logout
        </div>
      </button>
    );
  }

  // If user is not authenticated, show only Login button
  return (
    <Link
      to='/auth'
      className={`${baseClasses} text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800`}
    >
      <div className='flex items-center justify-center'>
        <User size={16} className='mr-2' />
        Login
      </div>
    </Link>
  );
};

export default AuthButton;