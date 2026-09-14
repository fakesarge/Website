import { motion } from "framer-motion";

const ShopHero = () => {
  return (
    <section className="container relative px-4 pb-16 pt-40 text-left">
      <motion.div
        className="mb-8 h-px w-10 bg-foreground/70"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 40, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="studio-label mb-5"
      >
        Premium Digital Assets
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="display-type mb-6 max-w-5xl text-7xl md:text-9xl"
      >
        The 74hrs Store
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-xl text-base leading-relaxed text-muted-foreground"
      >
        Explore our curated collection of services, products, and exclusive offerings — built for creators who demand excellence.
      </motion.p>

      {/* Soft bottom gradient blend */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  );
};

export default ShopHero;
