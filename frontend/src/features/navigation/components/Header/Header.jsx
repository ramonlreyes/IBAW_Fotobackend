import { useMobileMenu } from '../../hooks/useMobileMenu';
import MobileHeader from '../MobileHeader';
import MobileMenu from '../MobileMenu';
import DesktopSidebar from '../DesktopSidebar';
import { useAuth } from '../../../authentication/contexts/AuthContext';
import { getCategoriesForUser } from '../../../../constants/categories';

const Header = () => {
  const { isMobileMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { isAdmin } = useAuth();

  const categories = getCategoriesForUser(isAdmin());


  return (
    <>
      {/* Mobile Components */}
      <MobileHeader 
        onMenuToggle={toggleMenu}
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Spacer for fixed mobile header */}
      <div className='md:hidden h-20'></div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        categories={categories}
      />

      {/* Desktop Component */}
      <DesktopSidebar categories={categories} />
    </>
  );
};

export default Header;