import { motion } from "framer-motion";
import { Check, Palette, Code, Video, Box, Headphones, Star, Gift, Shield, Zap } from "lucide-react";
import type { ShopItem } from "@/config/shopData";

const iconMap = {
  palette: Palette,
  code: Code,
  video: Video,
  box: Box,
  headphones: Headphones,
  star: Star,
  gift: Gift,
  shield: Shield,
  zap: Zap,
};

interface ShopProductCardProps {
  item: ShopItem;
  index: number;
}

const ShopProductCard = ({ item, index }: ShopProductCardProps) => {
  const Icon = iconMap[item.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div
        className={`relative h-full rounded-2xl border bg-card/60 backdrop-blur-md p-6 flex flex-col transition-all duration-500 hover:bg-card/80 ${
          item.popular
            ? "border-primary/40 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]"
            : "border-border/40 hover:border-border/70"
        }`}
      >
        {/* Badge */}
        {(item.badge || item.popular) && (
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {item.badge || "Most Popular"}
            </span>
          </div>
        )}

        {/* Icon + Title */}
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-5 w-5 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          {item.priceNote && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.priceNote}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{item.price}</span>
          </div>
        </div>

        {/* Features */}
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

        {/* CTA */}
        <button
          className={`w-full rounded-full py-3 text-sm font-medium transition-all duration-300 ${
            item.popular
              ? "bg-primary text-primary-foreground hover:opacity-90"
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
