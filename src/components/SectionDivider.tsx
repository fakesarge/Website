import { motion } from "framer-motion";

interface SectionDividerProps {
  /** Optional icon shown inside the orb */
  icon?: React.ReactNode;
  /** Height of each vertical line in px */
  lineHeight?: number;
}

const SectionDivider = ({ icon, lineHeight = 0 }: SectionDividerProps) => {
  return (
    <div className="container flex items-center px-4 pointer-events-none">
      <div
        className="h-px flex-1 bg-border/80"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="size-8 border border-border/80 flex items-center justify-center bg-background"
      >
        {icon ?? (
          <span className="size-1.5 bg-foreground" />
        )}
      </motion.div>
      <div
        className="h-px flex-1 bg-border/80"
      />
    </div>
  );
};

export default SectionDivider;
