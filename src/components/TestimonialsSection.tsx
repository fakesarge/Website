"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const testimonials = [
  {
    name: "Tiger Woods",
    role: "Bypass Owner & Youtuber",
    image:
      "https://cdn.discordapp.com/avatars/1127102245394190346/42441f069b7186182f0b4bcc898e6615.webp?size=1024",
    content: "Exactly what I wanted. Was so good I hired the guy.",
  },
  {
    name: "Ayznn",
    role: "Owner of WaveSheild AC",
    image:
      "https://cdn.discordapp.com/avatars/746079627751063644/7556b4df6f035f96cc12e9f09f865a23.webp?size=1024",
    content: "Fast and clean — exactly the energy I needed for the launch.",
  },
  {
    name: "Fastlifejay",
    role: "FiveM Server Owner",
    image:
      "https://cdn.discordapp.com/avatars/1006775634036531220/091a0cddd021557d059fccbf20ed39e7.webp?size=1024",
    content:
      "Vfx is insane, real shark shit 💯 Tap in with bro for any gfx/vfx — he will score, I promise you. W sarge ❤️",
  },
  {
    name: "Verified Creator",
    role: "Content Creator",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content:
      "Working with sarge for our custom logo was seamless. They understood our vision and delivered premium Blender graphics that exceeded expectations.",
  },
  {
    name: "Server Dev",
    role: "Server Developer",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content:
      "Attention to detail in their FiveM VFX is outstanding. Every element is perfectly optimized and looks incredible in-game.",
  },
  {
    name: "Community Lead",
    role: "Community Manager",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content:
      "Turnaround was crazy fast and the final result felt like a movie poster. Easiest collab I've done in years.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 mb-6">
            <span className="size-1.5 rounded-full bg-[hsl(var(--accent-glow))]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Loved and <span className="text-gradient">Trusted</span> by gaming{" "}
            <span className="text-gradient">communities</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Real words from server owners, creators and devs running our work in production.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name + i}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: premiumEase }}
              className="break-inside-avoid rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:border-[hsl(var(--accent-glow)/0.4)] transition-colors duration-500 overflow-hidden"
              style={{ transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)" }}
            >
              <div className="p-7">
                {/* Identity header — who the testimonial belongs to */}
                <div className="flex items-center gap-3 mb-5">
                  <Avatar className="h-12 w-12 ring-1 ring-border/50">
                    <AvatarImage src={t.image} />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {t.name}
                      </span>
                      <BadgeCheck className="h-3.5 w-3.5 text-[#23a55a]" />
                    </div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-foreground/85 leading-relaxed">"{t.content}"</p>
              </div>

              {/* Footer — attribution strip, mirrors the reference layout */}
              <div className="flex items-center justify-between px-7 py-4 border-t border-border/40 bg-background/20">
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t.role}
                  </div>
                </div>
                <Avatar className="h-8 w-8 ring-1 ring-border/40">
                  <AvatarImage src={t.image} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
