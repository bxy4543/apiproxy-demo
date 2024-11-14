import { useState, useEffect } from 'react';

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width <= 768,
    isTablet: windowSize.width > 768 && windowSize.width <= 1024,
    isDesktop: windowSize.width > 1024,
    width: windowSize.width,
    height: windowSize.height,
  };
}; 