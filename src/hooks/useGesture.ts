import { useState, useEffect } from 'react';

interface GestureState {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface GestureOptions {
  threshold?: number;
  minVelocity?: number;
}

export const useGesture = (options: GestureOptions = {}) => {
  const { threshold = 50, minVelocity = 0.5 } = options;
  const [gesture, setGesture] = useState<GestureState>({
    direction: null,
    distance: 0,
    velocity: 0,
  });

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const timeElapsed = Date.now() - startTime;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / timeElapsed;

      if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) return;
      if (velocity < minVelocity) return;

      let direction: GestureState['direction'] = null;
      let distance = 0;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
        distance = Math.abs(deltaX);
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        distance = Math.abs(deltaY);
      }

      setGesture({ direction, distance, velocity });
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [threshold, minVelocity]);

  return gesture;
}; 