import { motion } from "framer-motion";
import type { ShopCategory } from "@/config/shopData";

interface ShopCategoryTabsProps {
  categories: ShopCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const ShopCategoryTabs = ({ categories, activeCategory, onCategoryChange }: ShopCategoryTabsProps) => {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-border/40 bg-secondary/40 p-1 backdrop-blur-md shadow-[0_2px_20px_-4px_hsl(var(--primary)/0.06)]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className="relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300"
          >
            {activeCategory === cat.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.2)]"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                activeCategory === cat.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopCategoryTabs;
