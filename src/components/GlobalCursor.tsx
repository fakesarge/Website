import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const GlobalCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.matches('button, a, [role="button"], .cursor-pointer')) {
        setIsHovering(true);
        setCursorType('pointer');
      } else if (target.matches('input, textarea, [contenteditable]')) {
        setIsHovering(true);
        setCursorType('text');
      } else {
        setIsHovering(false);
        setCursorType('default');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary/60 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: cursorType === 'default' ? 0.8 : 1
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Trailing Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-primary rounded-full pointer-events-none z-[9998]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Interactive Ring for Hover States */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 border border-primary/40 rounded-full pointer-events-none z-[9997]"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  );
};