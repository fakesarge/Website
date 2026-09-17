import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BigCTASection = () => {
  return (
    <section className="border-b border-border py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative mx-5 overflow-hidden rounded-lg border border-border bg-accent/15 p-10 md:mx-auto md:max-w-[1120px] md:p-20"
      >
        {/* Inner top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-glow)/0.6)] to-transparent" />

        {/* Floor glow */}
        <div className="pointer-events-none absolute inset-0 creative-grid opacity-20" />
        {/* Subtle accent wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--accent-glow)/0.08)] to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 mb-6">
            <span className="size-1.5 rounded-full bg-[hsl(var(--accent-glow))] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
              Ready when you are
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-5 font-display text-4xl font-extrabold uppercase leading-[1.05] text-foreground md:text-6xl"
          >
            Your next launch deserves
            <br />
            more than ordinary.
          </motion.h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl">
            Join 2,400+ creators leveling up with 74hrs premium VFX and graphics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 button-gradient px-8 py-3.5 text-sm font-semibold tracking-wide"
            >
              Shop All Tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://discord.gg/74hrs"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border/60 bg-background/40 px-8 py-3.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Join Discord
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BigCTASection;
