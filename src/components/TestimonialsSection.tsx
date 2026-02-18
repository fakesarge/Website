"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const testimonials = [
  {
    name: "Tiger Woods",
    role: "Bypass Owner & Youtuber",
    image: "https://cdn.discordapp.com/avatars/1127102245394190346/42441f069b7186182f0b4bcc898e6615.webp?size=1024",
    content: "Exactly what I wanted, Was so good I hired the guy."
  },
  {
    name: "Ayznn",
    role: "Owner of WaveSheild AC",
    image: "https://cdn.discordapp.com/avatars/746079627751063644/7556b4df6f035f96cc12e9f09f865a23.webp?size=1024",
    content: "fast and clean"
  },
  {
    name: "Fastlifejay",
    role: "Fivem Server Owner",
    image: "https://cdn.discordapp.com/avatars/1006775634036531220/091a0cddd021557d059fccbf20ed39e7.webp?size=1024",
    content: "Vfx is in fucking sane real shark shit💯 Tap in with bro any gfx/vfx needs he will score i promise you🗣️ W sarge❤️"
  },
  {
    name: "Not Disclosed",
    role: "Content Creator",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "Working with sarge for our custom logo design was seamless. They understood our vision and delivered premium Blender graphics that exceeded expectations."
  },
  {
    name: "Not Disclosed",
    role: "Server Developer",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The attention to detail in their FiveM VFX is outstanding. Every element is perfectly optimized and looks incredible in-game."
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Card className="w-[400px] shrink-0 bg-card/40 backdrop-blur-xl border-border/10 hover:border-primary/15 transition-all duration-500 p-8 group"
    style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
    <div className="flex items-center gap-4 mb-6">
      <Avatar className="h-12 w-12 ring-1 ring-border/20 group-hover:ring-primary/20 transition-all duration-300">
        <AvatarImage src={testimonial.image} />
        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-medium text-foreground/90">{testimonial.name}</h4>
        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
    <p className="text-muted-foreground leading-relaxed">
      {testimonial.content}
    </p>
  </Card>
);

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="text-center mb-16"
        >
          <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Trusted by Gaming Communities</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied FiveM server owners using our premium VFX graphics
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`${index}-1`} testimonial={testimonial} />
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`${index}-2`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
