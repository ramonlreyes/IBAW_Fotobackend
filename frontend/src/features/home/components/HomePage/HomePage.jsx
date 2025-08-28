import { useCategoryNavigation } from '../../../navigation';
import { AlbumGrid } from '../../../albums';
import { Header } from '../../../navigation';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorState from '../../../../shared/components/ErrorState';
import EmptyState from '../../../../shared/components/EmptyState';
import { getCategoryDisplayName } from '../../../../constants/categories';
import { RandomImagesCarousel } from '../../../gallery';
import { useAlbums } from '../../../../shared/services/albumContext';

function HomePage() {
  const {
    currentCategory,
    availableCategories,
    selectCategory,
    isCategoryActive,
    getNavigationItems
  } = useCategoryNavigation();

  const { albums, loading, error } = useAlbums();

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        <Header categories={availableCategories} />
        <div className="flex-1">
          <LoadingSpinner message="Preparing your photography showcase..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row">
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
    <div className='min-h-screen bg-white flex flex-col md:flex-row'>
      <Header categories={availableCategories} />

      <div className='flex-1 flex md:items-center justify-center'>

        {/* Centered carousel container with proper spacing */}
        <div className='w-full py-4 sm:py-6 md:py-8'>
          <RandomImagesCarousel
            numberOfImages={24}
            autoAdvance={true}
            autoAdvanceInterval={8000}
            showRefreshButton={true}
            showControls={false}
            showCounter={false}
            className='w-full'
          />
        </div>

      </div>
    </div>
  );
}

export default HomePage;