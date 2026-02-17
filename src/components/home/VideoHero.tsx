import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface VideoHeroProps {
  scrollToContent: () => void;
}

const VideoHero = ({ scrollToContent }: VideoHeroProps) => {
  const navigate = useNavigate();
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <motion.div
      ref={videoSectionRef}
      style={{ opacity }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/your-video.mp4" type="video/mp4" />
        </video>
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Ambient floating lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], opacity: [0.15, 0.25, 0.1, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0], opacity: [0.1, 0.2, 0.08, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 h-[250px] w-[250px] rounded-full bg-primary/8 blur-[80px]"
        />
      </div>

      {/* Hero content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        {/* Accent line */}
        <motion.div
          className="w-10 h-[1px] bg-primary/60 mb-8"
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ duration: 1, delay: 0.8 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1] mb-6"
        >
          Where Your Vision
          <br />
          <span className="text-gradient">Becomes Reality.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-muted-foreground text-base md:text-lg max-w-lg mb-10"
        >
          Premium Blender animations, loading screens & graphics for you're communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/portfolio")}
            className="px-8 py-3.5 button-gradient rounded-full font-medium text-sm tracking-wide cursor-pointer"
          >
            Explore Our Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/shop")}
            className="px-8 py-3.5 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full text-white font-medium text-sm tracking-wide cursor-pointer transition-colors"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10"
        onClick={scrollToContent}
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>
    </motion.div>
  );
};

export default VideoHero;
