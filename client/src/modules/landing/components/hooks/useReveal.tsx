import { useEffect, useRef, useState } from 'react';

interface RevealOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

// Simple hook to reveal elements on intersection
export const useReveal = ({ threshold = 0.25, once = true, rootMargin = '0px' }: RevealOptions = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            if (once && observer) observer.disconnect();
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer && observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, shown } as const;
};

export const revealClass = (shown: boolean, extra = '') =>
  `${extra} transition-all duration-700 ease-out will-change-transform ${
    shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`;
