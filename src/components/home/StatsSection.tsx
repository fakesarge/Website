import { motion } from "framer-motion";

const stats = [
  { value: "2K+", label: "Projects delivered" },
  { value: "120+", label: "Active clients" },
  { value: "12K", label: "Hours rendered" },
  { value: "24/7", label: "Community access" },
];

const StatsSection = () => (
  <section className="border-b border-border py-12">
    <div className="mx-auto max-w-[1120px] px-5">
      <p className="mb-8 text-center font-mono text-[9px] uppercase text-muted-foreground">Trusted by creators, communities, and studios</p>
      <div className="grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-b border-r border-border px-4 py-7 text-center">
          <p className="font-display text-3xl font-extrabold leading-none md:text-4xl">{stat.value}</p>
          <p className="mt-3 font-mono text-[8px] uppercase text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
      </div>
    </div>
  </section>
);

export default StatsSection;