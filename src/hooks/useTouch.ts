import { useState, useEffect } from 'react';

interface TouchState {
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  isMoving: boolean;
}

export const useTouch = () => {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    isMoving: false,
  });

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      moveX: 0,
      moveY: 0,
      isMoving: false,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      moveX: touch.clientX - prev.startX,
      moveY: touch.clientY - prev.startY,
      isMoving: true,
    }));
  };

  const handleTouchEnd = () => {
    setTouchState(prev => ({
      ...prev,
      isMoving: false,
    }));
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return touchState;
}; 