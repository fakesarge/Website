
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { FeatureContent } from "./FeatureContent";
import { features } from "@/config/features";

export const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMousePosition({ x, y });
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const handleFeatureInteraction = (index: number, type: 'hover' | 'click') => {
    if (type === 'hover') {
      setActiveFeature(index);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="container px-4 py-24 relative overflow-hidden cursor-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-6 h-6 bg-primary/30 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 1 : 0
        }}
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <motion.div 
        className="max-w-2xl mb-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-normal mb-6 tracking-tight text-left">
          Premium VFX
          <br />
          <span className="text-gradient font-medium">Graphics & Services</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-left">
          Professional-grade FiveM graphics, Blender animations, and custom loading screens designed to elevate your gaming community's visual experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left side - Interactive Feature List */}
        <div className="md:col-span-5 space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`
                relative p-6 rounded-xl cursor-pointer transition-all duration-500
                ${activeFeature === index 
                  ? 'glass shadow-lg shadow-primary/20 scale-105' 
                  : 'hover:glass-hover hover:scale-102'
                }
              `}
              onMouseEnter={() => handleFeatureInteraction(index, 'hover')}
              onClick={() => handleFeatureInteraction(index, 'click')}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Active Indicator */}
              <AnimatePresence>
                {activeFeature === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 w-1 h-full bg-primary rounded-l-xl"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-primary/5 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  className={`text-2xl transition-colors duration-300 ${
                    activeFeature === index ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  animate={{
                    scale: activeFeature === index ? 1.1 : 1,
                    rotate: activeFeature === index ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <div className="text-left min-w-0">
                  <h3 className={`font-semibold truncate text-lg transition-colors duration-300 ${
                    activeFeature === index ? 'text-primary' : ''
                  }`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Interactive Particles */}
              {activeFeature === index && (
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/40 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Right side - Dynamic Content Display */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 15 }}
              transition={{ 
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="h-full"
            >
              <FeatureContent
                image={features[activeFeature].image}
                title={features[activeFeature].title}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-12 gap-2">
        {features.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeFeature === index ? 'bg-primary w-8' : 'bg-muted-foreground/30'
            }`}
            onClick={() => setActiveFeature(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
};
