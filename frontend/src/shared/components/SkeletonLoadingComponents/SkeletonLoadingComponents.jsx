import React from "react";

const Skeleton = ({ className = '', width, height, rounded = false }) => {
  <div
    className={`animate-pulse bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    style={{ width, height }}
  />
};

export const AlbumCardSkeleton = ({ gap = 4 }) => {
  const getMarginClass = () => {
    switch (gap) {
      case 2: return 'mb-1 sm:mb-1.5 md:mb-2';
      case 4: return 'mb-2 sm:mb-3 md:mb-4';
      case 6: return 'mb-3 sm:mb-4 md:mb-6';
      case 8: return 'mb-4 sm:mb-6 md:mb-8';
      default: return 'mb-2 sm:mb-3 md:mb-4';
    }
  };

  return (
    <div className={`${getMarginClass()}`}>
      <Skeleton className="w-full aspect-[3/2]" />
    </div>
  );
};

export const AlbumGridSkeleton = ({ columns = 2, gap = 8, itemCount = 6 }) => {
  const getColumnClasses = () => {
    switch (columns) {
      case 1: return 'columns-1';
      case 2: return 'columns-1 sm:columns-1 md:columns-2';
      case 3: return 'columns-1 sm:columns-2 lg:columns-2 xl:columns-3';
      case 4: return 'columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4';
      default: return 'columns-1 sm:columns-1 md:columns-2';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 2: return 'gap-1 sm:gap-1.5 md:gap-2';
      case 4: return 'gap-2 sm:gap-3 md:gap-4';
      case 6: return 'gap-3 sm:gap-4 md:gap-6';
      case 8: return 'gap-4 sm:gap-6 md:gap-8';
      default: return 'gap-2 sm:gap-3 md:gap-4';
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '105rem'}}>
      <div className={`${getColumnClasses()} ${getGapClass()}`}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <AlbumCardSkeleton key={index} gap={gap} />
        ))}
      </div>
    </div>
  );
};

export const HeroCoverSkeleton = () => (
  <div className="bg-white py-4 sm:py-8 md:py-12 lg:py-16">
    <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl xl:max-w-screen-2xl">
      <div className="relative">
        <Skeleton
          className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] lg:aspect-[24/10] xl:aspect-[28/10] object-cover rounded-none sm:rounded-lg"
        />

        {/* Back button Skeleton */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20">
          <Skeleton className="w-20 h-4 sm:w-24 sm:h-5 md:w-32 md:h-5" />
        </div>

        {/* Tittle overlay skeleton */}
        <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 z-10 w-full px-4">
          <div className="text-center">
            <Skeleton className="w-48 h-8 sm:w-64 sm:h-10 md:w-80 md:h-12 lg:w-96 lg:h-14 xl:w-112 xl:h-16 mb-2 sm:mb-3 md:mb-4 mx-auto" />
            <Skeleton className="w-32 h-4 sm:w-40 sm:h-4 md:w-48 md:h-5 lg:w-56 lg:h-5 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PageHeaderSkeleton = ({ showBackButton = true, titleWidth = '300px' }) => (
  <div className="border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="text-center">
        {showBackButton && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <Skeleton className="w-20 h-4 sm:w-24 sm:h-4 md:w-32 md:h-5 mx-auto" />
          </div>
        )}
        <Skeleton className="w-48 h-8 sm:w-64 sm:h-10 md:w-80 md:h-12 lg:w-96 lg:h-14 mb-1 sm:mb-2 mx-auto" />
      </div>
    </div>
  </div>
);

export const AlbumTitleSkeleton = () => (
  <div className="bg-white py-8 sm:py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center">
        <Skeleton className="w-56 h-8 sm:w-72 sm:h-10 md:w-80 md:h-12 lg:w-96 lg:h-14 mb-2 sm:mb-3 md:mb-4 mx-auto" />
        <Skeleton className="w-32 h-5 sm:w-40 sm:h-5 md:w-48 md:h-6 lg:w-56 lg:h-6 mx-auto" />
      </div>
    </div>
  </div>
);

export const NavigationsHeaderSkeleton = () => (
  <div className="relative z-20 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
      <Skeleton className="w-24 h-4 sm:w-32 sm:h-4 md:w-40 md:h-5" />
    </div>
  </div>
);