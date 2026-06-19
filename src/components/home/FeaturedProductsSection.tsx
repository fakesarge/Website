import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shopCategories } from "@/config/shopData";

const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const products = shopCategories.find((c) => c.id === "products")?.items.slice(0, 4) ?? [];

  return (
    <section className="container px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="w-8 h-[1px] bg-primary/50 mb-6" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Featured <span className="text-gradient">Products</span>
            </motion.h2>
            <p className="mt-3 text-muted-foreground">Hand-picked drops from the shop</p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate("/shop")}
            className="hidden md:inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => navigate(`/shop/${item.id}`)}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/40 bg-card text-left"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              {item.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  {item.badge}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-sm text-foreground/80"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
