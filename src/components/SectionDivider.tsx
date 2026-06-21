import { motion } from "framer-motion";

interface SectionDividerProps {
  /** Optional icon shown inside the orb */
  icon?: React.ReactNode;
  /** Height of each vertical line in px */
  lineHeight?: number;
}

const SectionDivider = ({ icon, lineHeight = 0 }: SectionDividerProps) => {
  return (
    <div className="flex flex-col items-center pointer-events-none">
      <div
        className="w-px bg-gradient-to-b from-transparent to-border/80"
        style={{ height: lineHeight }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="size-8 rounded-full border border-border/80 flex items-center justify-center bg-background"
        style={{ boxShadow: "0 0 22px hsl(var(--accent-glow) / 0.18)" }}
      >
        {icon ?? (
          <span className="size-1.5 rounded-full bg-[hsl(var(--accent-glow))] animate-pulse" />
        )}
      </motion.div>
      <div
        className="w-px bg-gradient-to-t from-transparent to-border/80"
        style={{ height: lineHeight }}
      />
    </div>
  );
};

export default SectionDivider;
