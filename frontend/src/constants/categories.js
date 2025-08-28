import { Icon } from "lucide-react";
import { useAuth } from "../features/authentication/contexts/AuthContext";


export const PORTFOLIO_CATEGORIES = [
  {
    id: 'all',
    name: 'All',
    displayName: 'All Work',
    description: 'Browse all photography collections',
    path: '/all'
  },
  {
    id: 'portraits',
    name: 'Portraits', 
    displayName: 'Portrait Photography',
    description: 'Individual and group portrait sessions',
    path: '/portraits'
  },
  {
    id: 'weddings',
    name: 'Weddings',
    displayName: 'Weddings Photography',
    description: 'Weddings celebrations',
    path: '/weddings'
  },
  {
    id: 'landscape',
    name: 'Landscape',
    displayName: 'Landscape Photography', 
    description: 'Natural landscapes and scenic views',
    path: '/landscape'
  },
  {
    id: 'events',
    name: 'Events',
    displayName: 'Event Photography',
    description: 'Weddings, celebrations, and special occasions',
    path: '/events'
  }
];

export const ADMIN_CATEGORIES = [
  {
      id: 'admin',
      name: 'Admin',
      displayName: 'Admin',
      description: 'Manage Albums and Website Content',
      path: '/admin',
      isAdmin: true,
      requiresAuth: true,
      Icon: 'Settings'
    }
];

export const CONTACT_CATEGORIES = [
  {
    id: 'aboutMe',
    name: 'AboutMe',
    displayName: 'About Me',
    description: 'About Me',
    path: '/aboutMe'
  },
  {
    id: 'contact',
    name: 'contact',
    displayName: 'Contact',
    description: 'contact',
    path: '/contact'
  }
];

export const findCategoryByIdentifier = (identifier) => {
  return PORTFOLIO_CATEGORIES.find(cat => 
    cat.id === identifier.toLowerCase() || 
    cat.name.toLowerCase() === identifier.toLowerCase()
  );
};

export const getCategoryDisplayName = (categoryIdentifier) => {
  if (!categoryIdentifier || categoryIdentifier === 'all') {
    return 'All Work';
  }
  
  const category = findCategoryByIdentifier(categoryIdentifier);
  return category ? category.displayName : categoryIdentifier;
};

export const getCategoriesForUser = (isAdmin = false) => {
  const categories = [
    ...PORTFOLIO_CATEGORIES,
    { id: 'portfolio-divider', isDivider: true },
    ...CONTACT_CATEGORIES
  ];

  if (isAdmin) {
    categories.push(
      { id: 'admin-divider', isDivider: true },
      ...ADMIN_CATEGORIES
    );
  }
  return categories;
};