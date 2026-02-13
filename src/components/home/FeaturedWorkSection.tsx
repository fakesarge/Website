import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { galleryProjects } from "@/config/galleryData";
import { useRef } from "react";

const FeaturedWorkSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = galleryProjects.slice(0, 4);

  return (
    <section className="py-28 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <div className="w-8 h-[1px] bg-primary/50 mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Featured <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              A selection of our finest VFX projects.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/portfolio")}
            className="hidden md:flex items-center gap-2 text-primary text-sm font-medium cursor-pointer"
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Horizontal scroll showcase */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-4 md:px-8 pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {featured.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            onClick={() => navigate("/portfolio")}
            className="group relative flex-shrink-0 w-[340px] md:w-[480px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer snap-start"
          >
            <img
              src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                boxShadow:
                  "inset 0 0 0 1px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.1)",
              }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-white/50 text-sm italic">{project.tagline}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container px-4 mt-8 md:hidden">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/portfolio")}
          className="flex items-center gap-2 text-primary text-sm font-medium cursor-pointer"
        >
          View Full Portfolio
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;
