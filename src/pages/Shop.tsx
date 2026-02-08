import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopHero from "@/components/shop/ShopHero";
import ShopCategoryTabs from "@/components/shop/ShopCategoryTabs";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopGridCard from "@/components/shop/ShopGridCard";
import ShopItemDetail from "@/components/shop/ShopItemDetail";
import { shopCategories, type ShopItem } from "@/config/shopData";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("services");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const activeCat = shopCategories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <Navigation />
      <ShopHero />

      <section className="container px-4 mb-6">
        <ShopCategoryTabs
          categories={shopCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      <section className="container px-4 mb-12 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-muted-foreground"
          >
            {activeCat.description}
          </motion.p>
        </AnimatePresence>
      </section>

      <section className="container px-4 pb-32">
        <AnimatePresence mode="wait">
          {activeCat.layout === "services" ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {activeCat.items.map((item, index) => (
                <ShopProductCard key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto grid max-w-7xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6"
            >
              {activeCat.items.map((item, index) => (
                <ShopGridCard key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ShopItemDetail item={selectedItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
      <Footer />
    </div>
  );
};

export default Shop;
