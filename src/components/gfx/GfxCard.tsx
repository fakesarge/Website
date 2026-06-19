import { motion } from "framer-motion";
import type { GfxProject } from "@/config/gfxData";

interface Props {
  project: GfxProject;
  index: number;
  onClick: () => void;
}

const GfxCard = ({ project, index, onClick }: Props) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/40 bg-card text-left"
    >
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 space-y-1">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {project.year} · GFX
        </div>
        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{project.tagline}</p>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground/80 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        View →
      </div>
    </motion.button>
  );
};

export default GfxCard;
