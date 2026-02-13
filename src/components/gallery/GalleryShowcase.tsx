import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles } from "lucide-react";
import type { GalleryProject } from "@/config/galleryData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface GalleryShowcaseProps {
  project: GalleryProject | null;
  onClose: () => void;
}

const GalleryShowcase = ({ project, onClose }: GalleryShowcaseProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          <div
            className="max-w-6xl mx-auto px-4 py-16 md:py-24"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-black/50"
            >
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>

            {/* Details */}
            <div className="grid md:grid-cols-5 gap-12">
              {/* Left — Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="md:col-span-3 space-y-6"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  {project.title}
                </h2>
                <p className="text-primary/80 italic text-lg">
                  {project.tagline}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {project.description}
                </p>

                {project.productUrl && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose();
                      navigate(project.productUrl!);
                    }}
                    className="inline-flex items-center gap-2 button-gradient px-8 py-3 rounded-full font-medium cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Product
                  </motion.button>
                )}
              </motion.div>

              {/* Right — Features */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="md:col-span-2 space-y-4"
              >
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryShowcase;
