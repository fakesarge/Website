
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

interface VideoHeroProps {
  scrollToContent: () => void;
}

const VideoHero = ({ scrollToContent }: VideoHeroProps) => {
  const videoSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={videoSectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://www.youtube.com/embed/sBm2Ip0WN1o?autoplay=1&mute=1&loop=1&playlist=sBm2Ip0WN1o&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&start=3&fs=0&vq=hd1080"
          title="VFX Studio Showreel"
          className="w-full h-full absolute inset-0 scale-[1.5]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Overlay with studio name */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">NOVA VFX</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Premium Visual Effects & Design for FiveM Communities
          </p>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToContent}
      >
        <ChevronDown className="w-10 h-10 text-white/80" />
      </motion.div>
    </div>
  );
};

export default VideoHero;
