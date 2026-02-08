import { motion } from "framer-motion";

const ShopHero = () => {
  return (
    <section className="container px-4 pt-32 pb-16 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground"
      >
        Premium Digital Assets
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold mb-5"
      >
        Shop <span className="text-gradient">Now</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-xl text-lg text-muted-foreground"
      >
        Explore our curated collection of services, products, and exclusive offerings — built for creators who demand excellence.
      </motion.p>
    </section>
  );
};

export default ShopHero;
