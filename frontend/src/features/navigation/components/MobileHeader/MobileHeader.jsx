import { Menu, X } from 'lucide-react';
import { useAuthActions } from '../../../authentication';

const MobileHeader = ({ onMenuToggle, isMenuOpen }) => {
  const { user, isAuthenticated, getUserDisplayName} = useAuthActions();

  return (
    <div className='md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200'>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center'>
            <h1 className='text-lg font-light tracking-wider text-gray-800'>
              Ramon Lora Reyes
            </h1>
            {user && isAuthenticated && (
              <span className='ml-2 text-xs text-gray-500'>
                  • {getUserDisplayName()}
              </span>
            )}
          </div>
          <button
            onClick={onMenuToggle}
            className='text-gray-600 hover:text-gray-800'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24}/> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;