import { Instagram, Facebook, Share2, Menu, X, LogOut, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ categories, selectedCategory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const AuthButton = ({ isMobile = false }) => {
    const baseClasses = `block w-full py-2 px-4 text-sm tracking-wide border rounded transition-colors duration-200 text-center ${
      isMobile ? 'mb-4' : ''
    }`;

    if (user && isAuthenticated()) {
      return (
        <button
          onClick={handleLogout}
          className={`${baseClasses} text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700`}
        >
          <div className='flex items-center justify-center'>
            <LogOut size={16} className='mr-2' />
            Logout
          </div>
        </button>
      );
    }

    return (
      <Link
        to='/login'
        className={`${baseClasses} text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className='flex items-center justify-center'>
          <User size={16} className='mr-2' />
          Login
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header - Fixed at top (only for mobile, not tablet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <h1 className="text-lg font-light tracking-wider text-gray-800">
                Ramon Lora Reyes
              </h1>
              {user && isAuthenticated() && (
                <span className="ml-2 text-xs text-gray-500">
                  • {user.name || user.email}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header (only for mobile) */}
      <div className="md:hidden h-20"></div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="p-4">
            {/* Title in the overlay */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-lg font-light tracking-wider text-gray-800">
                  Ramon Lora Reyes
                </h1>
                {user && isAuthenticated() && (
                  <p className="text-xs text-gray-500 mt-1">
                    Welcome, {user.name || user.email}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile menu content */}

            <AuthButton isMobile={true} />

            <nav className="mb-6">
              <ul className="space-y-4 text-center">
                {categories.map((category) => (
                  <li key={category}>
                    <NavLink
                      to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className={({ isActive }) =>
                        `block text-sm tracking-wide transition-colors duration-200 ${
                          isActive
                            ? 'text-gray-800 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 size={20} />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-400">
              Ramon Lora Reyes &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (includes tablets) */}
      <div className="hidden md:flex w-64 bg-white p-8 border-r border-gray-200 flex-col min-h-screen">
        {/* Your existing desktop content */}
        <div className="mb-8">
          <Link to="/" className="block">
            <h1 className="text-2xl font-light tracking-wider text-gray-800">
              Ramon Lora Reyes
            </h1>
            <div className="w-12 h-px bg-gray-300 mt-2"></div>
            {user && isAuthenticated() && (
              <p className='text-xs text-gray-500 mt-2'>
                Welcome, {user.name || user.email}
              </p>
            )}
          </Link>
        </div>

        <div className="mb-8">
          <AuthButton />
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <NavLink
                  to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className={({ isActive }) =>
                    `text-left text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-gray-800 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  {category}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex space-x-4 mt-8">
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 size={20} />
          </a>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Ramon Lora Reyes &copy; {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default Header;