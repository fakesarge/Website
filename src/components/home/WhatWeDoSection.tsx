import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, Gauge, Clock } from "lucide-react";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

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

const ParallaxImage = ({ img, index }: { img: { src: string; alt: string }; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [30, -30] : [-20, 20]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: premiumEase }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3, ease: premiumEase } }}
      className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/20"
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 40px hsl(var(--primary) / 0.08)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <span className="text-xs font-medium text-foreground">{img.alt}</span>
      </div>
    </motion.div>
  );
};

const WhatWeDoSection = () => {
  return (
    <section className="container px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: premiumEase }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 mb-6">
          <span className="size-1.5 rounded-full bg-[hsl(var(--accent-glow))]" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
            What we do
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Premium VFX for serious <span className="text-gradient">communities</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl">
          Custom-built Blender graphics, animations and effects engineered for FiveM.
        </p>
      </motion.div>

      {/* Image Showcase Grid with Parallax */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
        {showcaseImages.map((img, index) => (
          <ParallaxImage key={img.alt} img={img} index={index} />
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
            transition={{ duration: 0.6, delay: index * 0.1, ease: premiumEase }}
            whileHover={{
              y: -6,
              boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.1)",
              transition: { duration: 0.3, ease: premiumEase },
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
