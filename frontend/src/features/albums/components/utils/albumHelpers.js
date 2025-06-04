



export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getCategoryDisplayName = (category) => {
  if (!category || category === 'all') return 'All Albums';
  return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
};

export const createFallbackImage = () => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F3F4F6"/>
      <rect x="150" y="120" width="100" height="60" rx="8" fill="#D1D5DB"/>
      <circle cx="170" cy="140" r="8" fill="#9CA3AF"/>
      <path d="M180 160L190 150L210 170L230 150L250 180H180V160Z" fill="#9CA3AF"/>
      <text x="200" y="200" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="14">No Image</text>
    </svg>
  `)}`;
};

export const handleImageError = (e) => {
    onImageError(album._id);
    e.target.src = createFallbackImage();
  };