import { motion } from "framer-motion";

const LogoCarousel = () => {
  const logos = [
    "/images/5830bd79-3511-41dc-af6c-8db32d91fc2c.png",
    "/images/bb50362c-6879-4868-bbc9-c6e051fd8d7d.png",
    "/images/1e2a48dc-059b-4919-a1ed-44685d771a32.png",
    "/images/bf56a0c6-48e4-49f7-b286-8e3fda9a3385.png",
    "/images/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png",
    "/images/club44watermark.png",
    "/images/1Dada.png"
  ];

  const extendedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-12 mt-20 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex space-x-16"
        initial={{ opacity: 0, x: "0%" }}
        animate={{
          opacity: 1,
          x: "-50%"
        }}
        transition={{
          opacity: { duration: 0.5 },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }
        }}
        style={{
          width: "fit-content",
          display: "flex",
          gap: "4rem"
        }}
      >
        {extendedLogos.map((logo, index) => (
          <motion.img
            key={`logo-${index}`}
            src={logo}
            alt={`Partner logo ${index + 1}`}
            className="h-8 object-contain transition-all duration-300"
            style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
            initial={{ opacity: 0.4 }}
            whileHover={{ 
              opacity: 1,
              scale: 1.08,
              filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.3))",
              transition: { duration: 0.3 }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LogoCarousel;
