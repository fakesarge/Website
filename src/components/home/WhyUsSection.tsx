import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Custom Blender Renders", us: true, them: false },
  { feature: "Server-Optimized Assets", us: true, them: false },
  { feature: "Dedicated Support", us: true, them: false },
  { feature: "Unlimited Revisions", us: true, them: false },
  { feature: "Fast Turnaround", us: true, them: true },
  { feature: "Source Files Included", us: true, them: false },
];

const WhyUsSection = () => {
  return (
    <section className="container px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Why <span className="text-gradient">74hrs</span>?
        </h2>
        <p className="text-muted-foreground text-lg">
          See how we compare to generic sellers.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-4 px-4"
        >
          <div />
          <div className="text-center text-sm font-semibold text-primary">74hrs</div>
          <div className="text-center text-sm font-semibold text-muted-foreground">
            Generic
          </div>
        </motion.div>

        {/* Rows */}
        <div className="space-y-2">
          {comparisons.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="grid grid-cols-3 gap-4 glass rounded-xl p-4 items-center"
            >
              <span className="text-sm text-foreground">{row.feature}</span>
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.07, type: "spring", stiffness: 300 }}
                  className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary" />
                </motion.div>
              </div>
              <div className="flex justify-center">
                {row.them ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.07, type: "spring" }}
                    className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.07, type: "spring" }}
                    className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-destructive/60" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
