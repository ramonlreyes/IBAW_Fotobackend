import { X } from 'lucide-react';
import { useAuthActions, AuthButton } from '../../../authentication';
import  MobileNavigation  from '../MobileNavigation';
import SocialMedia from '../SocialMedia';

const MobileMenu = ({ isOpen, onClose, categories}) => {
  const {user, isAuthenticated, getUserDisplayName } = useAuthActions();

  if(!isOpen) return null;

  return (
    <div className='md:hidden fixed inset-0 z-50 bg-white'>
      <div className='p-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-2'>
          <div>
            <h1 className='text-lg font-light tracking-wider text-gray-800'>
              Ramon Lora Reyes
            </h1>
            {user && isAuthenticated && (
              <p className="text-xs text-gray-500 mt-1">
                Welcome, {getUserDisplayName()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className='text-gray-600 hover:text-gray-800'
            aria-label='Close menu'
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <AuthButton isMobile={true} />
        <MobileNavigation categories={categories} onClose={onClose} />
        <SocialMedia isMobile={true} />

        {/* Copyright */}
        <div className='text-center text-xs text-gray-400'>
          Ramon Lora Reyes &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;