import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface VideoHeroProps { scrollToContent: () => void; }

const VideoHero = ({ scrollToContent }: VideoHeroProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);

  return (
    <section ref={sectionRef} className="relative min-h-[92svh] overflow-hidden border-b border-border pt-28 md:pt-32">
      <div className="mx-auto grid min-h-[calc(92svh-7rem)] max-w-[1440px] border-x border-border lg:grid-cols-[92px_minmax(0,1fr)_64px]">
        <aside className="hidden border-r border-border lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-8">
          <span className="font-display text-xl font-extrabold">74.</span>
          <span className="h-40 w-px bg-border" />
          <span className="vertical-label font-mono text-[9px] uppercase text-muted-foreground">Independent creative studio</span>
        </aside>

        <div className="relative min-h-[680px] overflow-hidden bg-secondary">
          <motion.div style={{ y }} className="absolute -inset-y-16 inset-x-0">
            <video autoPlay muted loop playsInline className="h-full w-full object-cover grayscale transition duration-1000 hover:grayscale-0">
              <source src="/your-video.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-9">
            <div>
              <p className="font-mono text-[9px] uppercase text-muted-foreground">Volume 01 / 2026</p>
              <p className="mt-2 font-display text-xs font-bold uppercase">Digital artifacts</p>
            </div>
            <span className="border border-foreground/20 bg-background/20 px-3 py-1 font-mono text-[9px] uppercase backdrop-blur-md">Showreel playing</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={scrollToContent} className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-foreground/30 bg-background/15 backdrop-blur-md" aria-label="Explore the studio">
              <span className="absolute inset-[-16px] rounded-full border border-foreground/20 motion-safe:animate-pulse" />
              <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="font-display text-[clamp(4rem,14vw,11rem)] font-extrabold uppercase leading-[0.72] text-foreground">
                74<span className="text-muted-foreground">HRS</span>
              </motion.h1>
              <div className="max-w-xs pb-1">
                <p className="text-xs font-semibold uppercase leading-relaxed text-foreground/75">Custom VFX, graphics, and digital assets for communities that refuse to blend in.</p>
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => navigate("/portfolio")} className="group rounded-none uppercase">
                    View work <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate("/contact")} variant="outline" className="rounded-none uppercase">Book a project</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden border-l border-border lg:flex lg:flex-col lg:items-center lg:py-10">
          <div className="flex flex-col gap-2"><span className="h-1 w-1 bg-foreground" /><span className="h-1 w-1 bg-muted-foreground" /><span className="h-1 w-1 bg-muted-foreground" /></div>
          <button onClick={scrollToContent} className="mt-auto" aria-label="Scroll to work"><ArrowDown className="h-5 w-5 text-muted-foreground" /></button>
        </aside>
      </div>
    </section>
  );
};

export default VideoHero;