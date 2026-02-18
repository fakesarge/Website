import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Users, Hammer } from "lucide-react";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const useCountUp = (end: number, duration: number, shouldStart: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);

  return count;
};

const stats = [
  { icon: Sparkles, label: "Products Delivered", value: 2032, suffix: "+" },
  { icon: Users, label: "Active Clients", value: 120, suffix: "+" },
  { icon: Hammer, label: "Hours Rendered", value: 12030, suffix: "+" },
];

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="container px-4 py-28">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const count = useCountUp(stat.value, 2200, isInView);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: premiumEase }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.1)",
                  transition: { duration: 0.3, ease: premiumEase },
                }}
                className="glass rounded-2xl p-10 text-center hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {count.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
