import { useState, useEffect, useCallback } from 'react';

interface UseAnimationsOptions {
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const useAnimations = (options: UseAnimationsOptions = {}) => {
  const { delay = 0, duration = 300, threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const triggerAnimation = useCallback(() => {
    if (!hasAnimated) {
      setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, delay);
    }
  }, [delay, hasAnimated]);

  const resetAnimation = useCallback(() => {
    setIsVisible(false);
    setHasAnimated(false);
  }, []);

  // Intersection Observer for scroll-triggered animations
  const useIntersectionObserver = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            triggerAnimation();
          }
        },
        { threshold }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, threshold, triggerAnimation]);

    return isVisible;
  };

  // Staggered animation delays
  const getStaggerDelay = (index: number, staggerDelay: number = 100) => {
    return index * staggerDelay;
  };

  // Animation variants for Framer Motion (if used)
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: duration / 1000, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: duration / 1000, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: duration / 1000, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: duration / 1000, ease: "easeOut" }
    }
  };

  return {
    isVisible,
    triggerAnimation,
    resetAnimation,
    useIntersectionObserver,
    getStaggerDelay,
    fadeInUp,
    scaleIn,
    slideInLeft,
    slideInRight
  };
};

// Hook for managing loading states with animations
export const useLoadingAnimation = (isLoading: boolean) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      // Add a small delay before hiding to ensure smooth transition
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return showLoading;
};

// Hook for managing hover states with animations
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave
  };
};
