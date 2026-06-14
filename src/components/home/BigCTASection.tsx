import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BigCTASection = () => {
  return (
    <section className="container px-4 py-28 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
      >
        Make work that
        <br />
        <span className="text-gradient">gets noticed.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mx-auto mt-6 max-w-md text-muted-foreground"
      >
        Join 2,400+ creators leveling up with 74hrs.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        <Link to="/shop" className="button-gradient px-7 py-3 text-sm uppercase tracking-wider">
          Shop All Tools
        </Link>
        <a
          href="https://discord.gg/74hrs"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border/60 bg-secondary/60 px-7 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition hover:bg-secondary"
        >
          Join Discord
        </a>
      </motion.div>
    </section>
  );
};

export default BigCTASection;
