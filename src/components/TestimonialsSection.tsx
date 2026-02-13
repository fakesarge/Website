
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

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

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4">Trusted by Gaming Communities</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied FiveM server owners using our premium VFX graphics
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-1`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-white/90">{testimonial.name}</h4>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
