import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { GalleryProject } from "@/config/galleryData";

interface GalleryCardProps {
  project: GalleryProject;
  index: number;
  onClick: () => void;
}

const sizeClasses: Record<GalleryProject["size"], string> = {
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  large: "md:col-span-2 md:row-span-2",
  normal: "",
};

const GalleryCard = ({ project, index, onClick }: GalleryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${sizeClasses[project.size]}`}
      onClick={onClick}
    >
      {/* Thumbnail with YouTube preview */}
      <div className="relative w-full h-full min-h-[260px] overflow-hidden bg-secondary">
        <motion.img
          src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Hover glow border */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1.5px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.15)",
          }}
        />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <motion.div
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
            whileHover={{ scale: 1.1 }}
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-white/60 italic">{project.tagline}</p>
        </div>

        {/* Accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default GalleryCard;
