import { motion } from "framer-motion";
import { Box, Film, Image, Layers3 } from "lucide-react";
import MediaPlaceholder from "./MediaPlaceholder";

const services = [
  { icon: Film, title: "Motion & VFX", copy: "Cinematic intros, loading screens, and campaign visuals built frame by frame." },
  { icon: Image, title: "Graphics", copy: "Thumbnails, banners, identities, and key art with a distinctive visual language." },
  { icon: Box, title: "3D Assets", copy: "Custom Blender scenes and ready-to-use packs for creators and server owners." },
  { icon: Layers3, title: "Creative systems", copy: "Consistent launch visuals designed to work across every platform." },
];

const WhatWeDoSection = () => (
  <section className="border-b border-border py-24">
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="section-kicker">What we make</p>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] md:text-7xl">Big ideas.<br /><span className="text-muted-foreground">Sharper output.</span></h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">From a single launch visual to a complete creative world, every piece is built around your community.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MediaPlaceholder label="Studio process image" className="aspect-[4/3]" format="4:3" />
          <MediaPlaceholder label="Finished project image" className="aspect-[4/3] sm:translate-y-8" format="4:3" />
        </div>
      </div>

      <div className="mt-24 grid border-l border-t border-border md:grid-cols-2">
        {services.map((service, index) => (
          <motion.article key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group border-b border-r border-border p-7 md:p-9">
            <div className="flex items-start justify-between"><service.icon className="h-6 w-6" /><span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span></div>
            <h3 className="mt-16 font-display text-2xl font-bold uppercase">{service.title}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{service.copy}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default WhatWeDoSection;