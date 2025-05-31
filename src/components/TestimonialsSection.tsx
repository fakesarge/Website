
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Alex Rodriguez",
    role: "FiveM Server Owner",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content: "The custom loading screens and GFX from NOVA VFX completely transformed our server's aesthetic. Players constantly compliment the professional quality and smooth animations."
  },
  {
    name: "Sarah Johnson",
    role: "Gaming Community Manager",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content: "NOVA VFX delivered exactly what we needed - stunning Blender animations and logos that perfectly matched our brand. The turnaround time was incredible!"
  },
  {
    name: "Mike Chen",
    role: "Roleplay Server Admin",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content: "The loading screen GFX package we purchased elevated our server to the next level. Professional quality at an affordable price - couldn't ask for more!"
  },
  {
    name: "Emma Wilson",
    role: "Content Creator",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "Working with NOVA VFX for our custom logo design was seamless. They understood our vision and delivered premium Blender graphics that exceeded expectations."
  },
  {
    name: "David Thompson",
    role: "Server Developer",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The attention to detail in their FiveM graphics is outstanding. Every element is perfectly optimized and looks incredible in-game."
  },
  {
    name: "Lisa Garcia",
    role: "Community Owner",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content: "NOVA VFX created the most professional loading screens we've ever had. Our players love the immersive experience from the moment they connect to our server."
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
