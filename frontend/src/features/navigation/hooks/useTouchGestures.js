import { useCallback, useEffect, useRef } from "react"

export const useTouchGestures = (isOpen, handlers) => {
  const touchStartX = useRef(0);

  const handleTouchStart = useCallback((e) => {
    if (!isOpen) return;
    touchStartX.current = e.changedTouches[0].screenX;
  }, [isOpen]);

  const handleTouchEnd = useCallback((e) => {
    if (!isOpen) return;

    const touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchStartX.current - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handlers.onNext?.();
      } else {
        handlers.onPrevious?.();
      }
    }
  }, [isOpen, handlers]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, handleTouchStart, handleTouchEnd]);
};

export const useBodyScrollLock = (isLocked) => {
  const originalOverflowRef = useRef(null);

  useEffect(() => {

    if (isLocked && originalOverflowRef.current === null) {
      originalOverflowRef.current = document.body.style.overflow || '';
    }

    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {

      document.body.style.overflow = originalOverflowRef.current || '';
      document.documentElement.style.overflow = '';
      // Reset the ref for next time
      originalOverflowRef.current = null;
    }
  }, [isLocked]);


  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
};