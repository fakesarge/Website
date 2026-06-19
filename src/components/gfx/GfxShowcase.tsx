import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { GfxProject, GfxAttribute } from "@/config/gfxData";

interface Props {
  project: GfxProject | null;
  onClose: () => void;
}

// Positions for floating attribute chips around the hero image.
// Tuned to feel like the reference: TL big, TR small, BL text, BR small.
const slots = [
  { top: "4%",  left: "-6%",  scale: 1.0, delay: 0.25, float: 8  },
  { top: "-4%", right: "-4%", scale: 0.85, delay: 0.35, float: 10 },
  { bottom: "6%", left: "-8%", scale: 0.9, delay: 0.45, float: 12, asText: true },
  { bottom: "-4%", right: "-2%", scale: 0.95, delay: 0.55, float: 9 },
  { top: "42%", left: "-12%", scale: 0.8, delay: 0.65, float: 14 },
  { top: "48%", right: "-10%", scale: 0.8, delay: 0.7, float: 11 },
] as const;

const AttributeChip = ({ attr, isText }: { attr: GfxAttribute; isText?: boolean }) => {
  if (isText) {
    return (
      <div className="text-foreground/90 leading-tight">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
          {attr.label}
        </div>
        <div className="text-lg md:text-2xl font-medium">{attr.value}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 p-4 md:p-5 min-w-[160px] max-w-[240px]">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {attr.label}
      </div>
      <div className="text-sm md:text-base font-semibold text-foreground">{attr.value}</div>

      {attr.swatches && (
        <div className="mt-3 flex gap-1.5">
          {attr.swatches.map((c) => (
            <span
              key={c}
              className="h-5 w-5 rounded-md border border-border/30"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GfxShowcase = ({ project, onClose }: Props) => {
  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Soft ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="fixed right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-card/60 backdrop-blur-md hover:bg-card transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </motion.button>

          <div
            className="relative mx-auto max-w-6xl px-4 py-20 md:py-28"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                GFX · {project.year}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                {project.title}
              </h2>
              <p className="mt-3 text-muted-foreground italic">{project.tagline}</p>
            </motion.div>

            {/* Hero image with floating attributes */}
            <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl">
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative h-full w-full overflow-hidden rounded-3xl border border-border/40 shadow-2xl shadow-black/60"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Floating attribute chips */}
              {project.attributes.slice(0, slots.length).map((attr, i) => {
                const slot = slots[i];
                return (
                  <motion.div
                    key={attr.label}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: slot.scale,
                      y: [0, -slot.float, 0],
                    }}
                    transition={{
                      opacity: { delay: slot.delay, duration: 0.5 },
                      scale: { delay: slot.delay, duration: 0.5 },
                      y: {
                        delay: slot.delay,
                        duration: 4 + i * 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute hidden md:block"
                    style={{
                      top: "top" in slot ? slot.top : undefined,
                      bottom: "bottom" in slot ? slot.bottom : undefined,
                      left: "left" in slot ? slot.left : undefined,
                      right: "right" in slot ? slot.right : undefined,
                    }}
                  >
                    <AttributeChip attr={attr} isText={"asText" in slot && slot.asText} />
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile attribute stack */}
            <div className="mt-10 grid gap-3 md:hidden">
              {project.attributes.map((attr) => (
                <AttributeChip key={attr.label} attr={attr} />
              ))}
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mx-auto mt-20 md:mt-32 max-w-2xl text-center"
            >
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {project.software && project.software.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {project.software.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/40 bg-card/60 px-3 py-1 text-xs text-foreground/80 backdrop-blur-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GfxShowcase;
