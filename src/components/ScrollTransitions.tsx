import { useEffect } from 'react';

const ScrollTransitions = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, observerOptions);

    // Observe all sections and major elements
    const elementsToObserve = document.querySelectorAll(
      'section, .card, .glass, [data-scroll-animate]'
    );

    elementsToObserve.forEach((el) => {
      el.classList.add('opacity-0', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default ScrollTransitions;