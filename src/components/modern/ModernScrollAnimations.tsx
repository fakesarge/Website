import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ModernScrollAnimations = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Fade in animation
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          
          // Add stagger effect for children
          const children = entry.target.querySelectorAll('[data-animate-child]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-fade-in');
              child.classList.remove('opacity-0', 'translate-y-4');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all sections and major elements
    const elementsToObserve = document.querySelectorAll(
      'section, .animate-on-scroll, [data-animate]'
    );

    elementsToObserve.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      observer.observe(el);
    });

    // Add parallax effect to certain elements
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.5;
        (element as HTMLElement).style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default ModernScrollAnimations;