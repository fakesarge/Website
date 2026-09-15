import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { galleryProjects } from "@/config/galleryData";
import MediaPlaceholder from "./MediaPlaceholder";

const FeaturedWorkSection = () => {
  const navigate = useNavigate();
  const projects = galleryProjects.slice(0, 3);

  return (
    <section className="overflow-hidden border-b border-border py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Selected work / 01—03</p>
            <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] md:text-8xl">Made to stop<br />the scroll.</h2>
          </div>
          <button onClick={() => navigate("/portfolio")} className="group flex items-center gap-3 text-xs font-bold uppercase">
            Full portfolio <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto px-5 pb-4 md:px-10 lg:px-16">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate("/portfolio")}
            className="group relative min-w-[82vw] overflow-hidden border border-border bg-secondary text-left md:min-w-[620px]"
          >
            <div className="aspect-video overflow-hidden">
              <img src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`} alt={project.title} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
            </div>
            <div className="flex items-start justify-between border-t border-border p-5">
              <div><span className="font-mono text-[9px] text-muted-foreground">0{index + 1} / VFX</span><h3 className="mt-2 font-display text-xl font-bold uppercase">{project.title}</h3></div>
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </motion.button>
        ))}
        <div className="min-w-[82vw] md:min-w-[620px]"><MediaPlaceholder label="Your next featured project" className="aspect-video h-auto" /></div>
      </div>
    </section>
  );
};

export default FeaturedWorkSection;