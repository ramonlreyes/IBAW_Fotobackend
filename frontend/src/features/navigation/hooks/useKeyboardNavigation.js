import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export const useKeyboardNavigation = (isOpen, handlers) => {
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        handlers.onClose?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlers.onPrevious?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlers.onNext?.();
        break;
      default:
        break;
    }
  }, [isOpen, handlers]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);
};