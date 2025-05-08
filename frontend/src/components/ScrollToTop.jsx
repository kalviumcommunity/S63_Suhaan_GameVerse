import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }, 50);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 