import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

interface VideoHeroProps {
  scrollToContent: () => void;
}

const VideoHero = ({ scrollToContent }: VideoHeroProps) => {
  const videoSectionRef = useRef<HTMLDivElement>(null);

  // Hooks for scroll progress and opacity transformation
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]); // Adjust 300 as needed

  return (
    <motion.div
      ref={videoSectionRef}
      style={{ opacity }} // fade out on scroll
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/your-video.mp4" type="video/mp4" />
          <source src="/your-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: .5,
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToContent}
      >
        <ChevronDown className="w-10 h-10 text-white/80" />
      </motion.div>
    </motion.div>
  );
};

export default VideoHero;
