import { useCategoryNavigation } from '../../../navigation';
import { useAlbumsByCategory, AlbumGrid } from '../../../albums';
import { Header } from '../../../navigation';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorState from '../../../../shared/components/ErrorState';
import EmptyState from '../../../../shared/components/EmptyState';
import { getCategoryDisplayName } from '../../../../constants/categories';
import { RandomImagesCarousel } from '../../../gallery';

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


  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <Header categories={availableCategories} />
        <div className="flex-1">
          <LoadingSpinner message="Preparing your photography showcase..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex">
        <Header categories={availableCategories} />
        <div className="flex-1">
          <ErrorState 
            error={error} 
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex'>
      <Header categories={availableCategories} />

      <div className='flex-1 relative'>

        <div className="absolute top-8 left-8 z-20 bg-white bg-opacity-95 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-lg font-light tracking-wider text-gray-800 mb-1">
            Ramon Lora Reyes
          </h1>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            Photography Portfolio
          </p>
        </div>

        <div className='h-screen w-full'>
          <RandomImagesCarousel
            numberOfImages={24}
            autoAdvance={true}
            autoAdvanceInterval={7000}
            showRefreshButton={true}
            showControls={false}
            showCounter={false}
            className='h-full w-full'
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;