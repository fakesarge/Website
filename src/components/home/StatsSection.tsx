import { motion } from "framer-motion";

const stats = [
  { value: "2K+", label: "Projects delivered" },
  { value: "120+", label: "Active clients" },
  { value: "12K", label: "Hours rendered" },
];

const StatsSection = () => (
  <section className="border-b border-border">
    <div className="mx-auto grid max-w-[1440px] border-x border-border md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="border-b border-border px-6 py-14 md:border-b-0 md:border-r md:last:border-r-0 lg:px-12">
          <p className="font-display text-6xl font-extrabold leading-none md:text-7xl">{stat.value}</p>
          <p className="mt-4 font-mono text-[10px] uppercase text-muted-foreground">[{stat.label}]</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;