import { motion } from "framer-motion";
import { Zap, Shield, Gauge, Clock } from "lucide-react";

const capabilities = [
  {
    icon: Zap,
    title: "Custom-Built Effects",
    description: "Every asset is hand-crafted in Blender — no templates, no shortcuts.",
  },
  {
    icon: Shield,
    title: "Server Optimized",
    description: "Built to run smoothly on FiveM without impacting server performance.",
  },
  {
    icon: Gauge,
    title: "High Performance",
    description: "Optimized file sizes and render quality for seamless in-game playback.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Quick turnaround without compromising on quality or detail.",
  },
];

const showcaseImages = [
  { src: "/images/products/ghetto.png", alt: "Ghetto Room Template" },
  { src: "/images/products/gamingcabin.png", alt: "Christmas Room Template" },
  { src: "/images/products/dowiuefiowejf.png", alt: "Social Pop Ups" },
  { src: "/images/products/djwoijfeoiwjf.png", alt: "Room Detail" },
  { src: "/images/products/oifjrioejfr.png", alt: "Cabin Detail" },
  { src: "/images/products/djwoijfeoiwjf2.png", alt: "Room Detail 2" },
];

const WhatWeDoSection = () => {
  return (
    <section className="container px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mb-16"
      >
        <div className="w-8 h-[1px] bg-primary/50 mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          What We <span className="text-gradient">Do</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Premium VFX services built for serious FiveM communities.
        </p>
      </motion.div>

      {/* Image Showcase Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
        {showcaseImages.map((img, index) => (
          <motion.div
            key={img.alt}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/20"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
              <span className="text-xs font-medium text-foreground">{img.alt}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {capabilities.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              y: -6,
              transition: { duration: 0.3 },
            }}
            className="group relative glass rounded-2xl p-7 hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeDoSection;
