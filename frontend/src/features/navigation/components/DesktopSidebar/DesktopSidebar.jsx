import { Link } from 'react-router-dom';
import { useAuthActions, AuthButton} from '../../../authentication';
import DesktopNavigation from '../DesktopNavigation';
import SocialMedia from '../SocialMedia';

const DesktopSidebar = ({ categories }) => {
  const { user, isAuthenticated, getUserDisplayName} = useAuthActions();


  return (
    <div className='hidden md:flex w-64 bg-white p-8 border-r border-gray-200 flex-col min-h-screen'>
      {/* Min 'Brand' Header */}
      <div className='mb-8'>
        <Link to='/' className='block'>
        <h1 className='text-2xl font-light tracking-wider text gray-800'>
          Ramon Lora Reyes
        </h1>
        <div className="w-12 h-px bg-gray-300 mt-2"></div>
          {user && isAuthenticated && (
            <p className='text-xs text-gray-500 mt-2'>
              Welcome, {getUserDisplayName()}
            </p>
          )}
        </Link>
      </div>

      {/* Auth Button */}
      <div className='mb-8'>
        <AuthButton />
      </div>

      {/* Navigation */}
      <DesktopNavigation categories={categories} />

      {/* Social Media */}
      <SocialMedia />

      {/* Copyright */}
      <div className='mt-4 text-xs text-gray-400'>
        Ramon Lora Reyes &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default DesktopSidebar;