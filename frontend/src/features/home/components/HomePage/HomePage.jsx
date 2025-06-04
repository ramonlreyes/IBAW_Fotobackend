import { useCategoryNavigation } from '../../../navigation';
import { useAlbumsByCategory, AlbumGrid } from '../../../albums';
import { Header } from '../../../navigation';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorState from '../../../../shared/components/ErrorState';
import EmptyState from '../../../../shared/components/EmptyState';
import { getCategoryDisplayName } from '../../../../constants/categories';

function HomePage() {
  const {
    currentCategory,
    availableCategories,
    selectCategory,
    isCategoryActive,
    getNavigationItems
  } = useCategoryNavigation();

  const {
    albums,
    loading,
    error,
    categoryStats,
    handleImageError,
    getImageUrl
  } = useAlbumsByCategory(currentCategory);

  if (loading) {
    return <LoadingSpinner message={`Loading ${getCategoryDisplayName(currentCategory)}...`} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className='min-h-screen bg-white flex'>
      <Header categories={availableCategories} />

      <div className='flex-1'>
        <div className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center'>
              <h1 className='text-3xl font-light tracking-wider text-gray-800 mb-2'>
                {getCategoryDisplayName(currentCategory)}
              </h1>
              <div className='w-16 h-px bg-gray-300 mx-auto mb-4'></div>
              <p className='text-gray-600'>
                {albums.length} {albums.length === 1 ? 'Album' : 'Albums'}
                {currentCategory !== 'all' && ` in ${getCategoryDisplayName(currentCategory)}`}
              </p>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          {albums.length === 0 ? (
            <EmptyState category={currentCategory} />
          ) : (
            <AlbumGrid
              albums={albums}
              onImageError={handleImageError}
              getImageUrl={getImageUrl}
              currentCategory={currentCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;