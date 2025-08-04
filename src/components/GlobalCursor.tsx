import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const GlobalCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setPosition(newPos);
      
      setTrail(prev => {
        const newTrail = [...prev, { ...newPos, id: Date.now() }].slice(-8);
        return newTrail;
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select, .interactive-element')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], input, textarea, select, .interactive-element')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            transform: `translate(${point.x - 2}px, ${point.y - 2}px)`,
            opacity: (index / trail.length) * 0.6,
          }}
        >
          <div 
            className="w-1 h-1 bg-primary/80 rounded-full"
            style={{
              transform: `scale(${(index / trail.length) * 0.8 + 0.2})`,
            }}
          />
        </div>
      ))}
      
      <div
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transition-all duration-200 ease-out ${
          isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${
            isClicking ? 0.75 : isHovering ? 1.25 : 1
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-sm animate-pulse" />
        <div className="relative w-full h-full">
          <div className="absolute inset-2 bg-white rounded-full border border-primary/50" />
          <div className="absolute inset-3 bg-primary/20 rounded-full" />
          {isHovering && (
            <div className="absolute inset-0 border-2 border-primary/60 rounded-full animate-ping" />
          )}
        </div>
      </div>
      
      {isClicking && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          }}
        >
          <div className="w-10 h-10 border-2 border-primary/40 rounded-full animate-ping" />
        </div>
      )}
    </>
  );
};