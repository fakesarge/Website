import { motion } from "framer-motion";
import { Check, Palette, Code, Video, Box, Headphones, Star, Gift, Shield, Zap } from "lucide-react";
import type { ShopItem } from "@/config/shopData";

const iconMap = {
  palette: Palette, code: Code, video: Video, box: Box, headphones: Headphones,
  star: Star, gift: Gift, shield: Shield, zap: Zap,
};

interface ShopProductCardProps {
  item: ShopItem;
  index: number;
  onClick?: () => void;
}

const ShopProductCard = ({ item, index, onClick }: ShopProductCardProps) => {
  const Icon = iconMap[item.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
      className="group relative h-full cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative h-full rounded-2xl border bg-card/60 backdrop-blur-md p-6 flex flex-col transition-all duration-500 hover:bg-card/80 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.1)] ${
          item.popular
            ? "border-primary/40 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]"
            : "border-border/40 hover:border-border/70"
        }`}
      >
        {(item.badge || item.popular) && (
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {item.badge || "Most Popular"}
            </span>
          </div>
        )}

        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors duration-500">
            <Icon className="h-5 w-5 text-foreground/80 group-hover:text-primary transition-colors duration-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        </div>

        <div className="mb-6">
          {item.priceNote && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.priceNote}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{item.price}</span>
          </div>
        </div>

        <ul className="mb-8 flex-grow space-y-2.5">
          {item.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`w-full rounded-full py-3 text-sm font-medium transition-all duration-300 ${
            item.popular
              ? "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              : "border border-border bg-secondary text-foreground hover:bg-accent"
          }`}
          onClick={() => {
            window.open("https://discord.gg/74hrs", "_blank");
          }}
        >
          {item.popular ? "Get Started" : "Learn More"}
        </button>
      </div>
    </motion.div>
  );
};

export default ShopProductCard;
