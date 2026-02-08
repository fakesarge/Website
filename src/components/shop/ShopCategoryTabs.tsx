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
      <div className="inline-flex rounded-full border border-border/50 bg-secondary/50 p-1 backdrop-blur-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className="relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-200"
          >
            {activeCategory === cat.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
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
