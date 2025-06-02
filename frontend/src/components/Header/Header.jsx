import { Instagram, Facebook, Share2, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ categories, selectedCategory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center'>
        <div>
          <h1 className='text-xl font-light tracking-wider text-gray-800'>
            Ramon Lora Reyes
          </h1>
          <div className='w-8 h-px bg-gray-300 mt-1'></div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='text-gray-600 hover:text-gray-800'
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className='lg:hidden fixed inset-0 z-50 bg-white'>
          <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
            <h1 className='text-lg font-light tracking-wider text-gray-800'>
              Ramon Lora Reyes
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='text-gray-600 hover:text-gray-800'
              >
                <X size={24} />
              </button>
          </div>
          <div className='p-4'>
            {/* Mobile menu content */}
            <Link 
            to='/login'
            className='block w-full py-2 px-4 mb-4 text-sm tracking-wide text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-center'
            onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <nav>
              <ul className='space-y-4'>
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
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className='hidden lg:flex w-64 bg-white p-8 border-r border-gray-200 flex-col min-h-screen'>
        <div className='mb-8'>
          <Link to='/' className='block'>
            <h1 className='text-xl md:text-2xl font-light tracking-wider text-gray-800'>
              Ramon Lora Reyes
            </h1>
            <div className='w-8 md:w-12 h-px bg-gray-300 mt-1 md:mt-2'></div>
          </Link>
        </div>

        <div className='mb-8'>
          <Link
            to='/login'
            className='block w-full py-2 px-4 text-sm tracking-wide text-gray-600 border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200 text-center'
            >
              Login
            </Link>
        </div>

        <nav className='flex-1'>
          <ul className='space-y-4'>
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

        <div className='flex space-x-4 mt-8'>
          <a href='#' className='text-gray-400 hover:text-gray-600 transition-colors'>
            <Instagram size={20} />
          </a>
          <a href='#' className='text-gray-400 hover:text-gray-600 transition-colors'>
            <Facebook size={20} />
          </a>
          <a href='#' className='text-gray-400 hover:text-gray-600 transition-colors'>
            <Share2 size={20} />
          </a>
        </div>

        <div className='mt-4 text-xs text-gray-400'>
          Ramon Lora Reyes &copy; {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default Header;