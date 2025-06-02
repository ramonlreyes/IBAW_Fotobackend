import { Instagram, Facebook, Share2, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ categories, selectedCategory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header - Fixed at top (only for mobile, not tablet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-light tracking-wider text-gray-800">
              Ramon Lora Reyes
            </h1>
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

      {/* Mobile Menu Overlay - new window with title (only for mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="p-4">
            {/* Title in the overlay */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-lg font-light tracking-wider text-gray-800">
                Ramon Lora Reyes
              </h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile menu content */}
            <Link
              to="/login"
              className="block w-full py-2 px-4 mb-4 text-sm tracking-wide text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
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
          </Link>
        </div>

        <div className="mb-8">
          <Link
            to="/login"
            className="block w-full py-2 px-4 text-sm tracking-wide text-gray-600 border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200 text-center"
          >
            Login
          </Link>
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