import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, Star } from "lucide-react";

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * (end - startCount) + startCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const StatsCounter = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Clients",
      value: 245,
      suffix: "+"
    },
    {
      icon: ShoppingBag,
      label: "Products Sold",
      value: 430,
      suffix: "+"
    },
    {
      icon: Star,
      label: "Reocuring Orders",
      value: 150,
      suffix: "+"
    }
  ];

  return (
    <section className="container px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, index }: { stat: any, index: number }) => {
  const count = useCountUp(stat.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="text-center glass p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300"
    >
      <div className="mb-4">
        <stat.icon className="h-12 w-12 mx-auto text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-muted-foreground text-lg">{stat.label}</div>
    </motion.div>
  );
};

export default StatsCounter;