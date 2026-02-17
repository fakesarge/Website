import { motion } from "framer-motion";

const ShopHero = () => {
  return (
    <section className="container px-4 pt-32 pb-16 text-center relative">
      <motion.div
        className="w-10 h-[1px] bg-primary/50 mx-auto mb-8"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 40, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground"
      >
        Premium Digital Assets
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-5xl md:text-7xl font-bold mb-5"
      >
        Shop <span className="text-gradient">Now</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-xl text-lg text-muted-foreground"
      >
        Explore our curated collection of services, products, and exclusive offerings — built for creators who demand excellence.
      </motion.p>

      {/* Soft bottom gradient blend */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  );
};

export default ShopHero;
