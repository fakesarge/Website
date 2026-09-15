import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopHero from "@/components/shop/ShopHero";
import ShopCategoryTabs from "@/components/shop/ShopCategoryTabs";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopGridCard from "@/components/shop/ShopGridCard";
import { shopCategories } from "@/config/shopData";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("services");
  const navigate = useNavigate();
  const activeCat = shopCategories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient cinematic background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], opacity: [0.04, 0.08, 0.03, 0.04] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] h-[600px] w-[600px] rounded-full bg-primary blur-[180px]"
        />
        <motion.div
          animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0], opacity: [0.03, 0.06, 0.02, 0.03] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] h-[500px] w-[500px] rounded-full bg-primary blur-[160px]"
        />
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary blur-[200px]"
        />
      </div>

      <Navigation />
      <ShopHero />

      {/* Soft transition gradient from hero to content */}
      <div className="relative">
        <div className="absolute -top-16 inset-x-0 h-16 bg-gradient-to-b from-transparent to-background/0 pointer-events-none" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="container px-4 mb-6"
      >
        <ShopCategoryTabs
          categories={shopCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </motion.section>

      <section className="container px-4 mb-12 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-muted-foreground"
          >
            {activeCat.description}
          </motion.p>
        </AnimatePresence>
      </section>

      {/* Soft divider */}
      <div className="container px-4 mb-8">
        <div className="mx-auto max-w-xs h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      </div>

      <section className="container px-4 pb-32">
        <AnimatePresence mode="wait">
          {activeCat.layout === "services" ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {activeCat.items.map((item, index) => (
                <ShopProductCard key={item.id} item={item} index={index} onClick={() => navigate(`/shop/${item.id}`)} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6"
            >
              {activeCat.items.map((item, index) => (
                <ShopGridCard key={item.id} item={item} index={index} onClick={() => navigate(`/shop/${item.id}`)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Transition to footer */}
      <div className="relative pointer-events-none">
        <div className="absolute -top-24 inset-x-0 h-24 bg-gradient-to-b from-transparent to-background/40" />
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
