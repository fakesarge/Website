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
    <div className="public-shell">

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
              className="mx-auto grid max-w-6xl grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
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
              className="mx-auto grid max-w-7xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-4"
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
