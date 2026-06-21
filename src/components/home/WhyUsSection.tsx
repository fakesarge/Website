import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const comparisons = [
  { feature: "Custom Blender Renders", us: true, them: false },
  { feature: "Server Optimized Assets", us: true, them: false },
  { feature: "Dedicated Support", us: true, them: false },
  { feature: "Fast Turnaround", us: true, them: false },
  { feature: "Source Files Included", us: true, them: false },
];

const WhyUsSection = () => {
  return (
    <section className="py-32 px-4">
      <div className="container">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: premiumEase }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="w-10 h-[1px] bg-white/20 mx-auto mb-6" />
          <h2 className="text-5xl font-bold tracking-tight mb-4">
            Why <span className="text-gradient">74hrs</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            See how we compare to generic sellers.
          </p>
        </motion.div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEase }}
          whileHover={{ scale: 1.01 }}
          className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300"
        >
          
          {/* HEADER ROW */}
          <div className="grid grid-cols-3 px-6 py-5 border-b border-white/10">
            <div className="text-sm text-muted-foreground">Feature</div>
            <div className="text-sm text-center font-semibold text-primary">
              74hrs
            </div>
            <div className="text-sm text-center text-muted-foreground">
              Generic
            </div>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-white/10">
            {comparisons.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: premiumEase,
                }}
                whileHover={{
                  scale: 1.01,
                  x: 6,
                }}
                className="grid grid-cols-3 items-center px-6 py-5 transition-all duration-200 cursor-default"
              >
                
                {/* FEATURE */}
                <div className="text-sm md:text-base text-white/90 transition-all duration-200 group-hover:text-white">
                  {row.feature}
                </div>

                {/* US */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-primary/30 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                </div>

                {/* THEM */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      row.them
                        ? "bg-white/5 border-primary/30"
                        : "bg-white/5 border-red-500/30"
                    }`}
                  >
                    {row.them ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUsSection;