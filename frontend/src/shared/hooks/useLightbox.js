import { useState, useCallback } from "react";
import { useKeyboardNavigation } from "../../features/navigation/hooks/useKeyboardNavigation";
import { useTouchGestures, useBodyScrollLock } from "../../features/navigation/hooks/useTouchGestures";
import { useImageLoader } from "./useImageLoader"; 
import { ChartNetwork } from "lucide-react";

export const useLightbox = (images, getImageUrl) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = images?.[currentIndex];
  const imageUrl = currentImage ? getImageUrl(currentImage) : null;

  const imageLoader = useImageLoader(imageUrl, currentIndex);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (images && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback((index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const handleImageSelect = useCallback((index) => {
    setCurrentIndex(index);
  }, []);


  const navigationHandlers = {
    onClose: handleClose,
    onPrevious: handlePrevious,
    onNext: handleNext
  };

  useKeyboardNavigation(isOpen, navigationHandlers);
  useTouchGestures(isOpen, navigationHandlers);
  useBodyScrollLock(isOpen);

  const hasMultipleImages = images ? images.length > 1 : false;
  const hasPrevious = hasMultipleImages && currentIndex > 0;
  const hasNext = hasMultipleImages && currentIndex < images.length - 1;

  return {
    isOpen,
    currentIndex,

    open: handleOpen,
    close: handleClose,
    goToPrevious: handlePrevious,
    goToNext: handleNext,
    selectImage: handleImageSelect,

    ...imageLoader,

    hasMultipleImages,
    hasPrevious,
    hasNext,
    totalImages: images?.length || 0
  };
}