
export const PORTFOLIO_CATEGORIES = [
  {
    id: 'all',
    name: 'All',
    displayName: 'All Work',
    description: 'Browse all photography collections',
    path: '/'
  },
  {
    id: 'portraits',
    name: 'Portraits', 
    displayName: 'Portrait Photography',
    description: 'Individual and group portrait sessions',
    path: '/portraits'
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