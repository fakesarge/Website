import { motion } from "framer-motion";
import { Star, ShoppingCart, Palette, Code, Video, Box, Headphones, Gift, Shield, Zap, Layers, Monitor, Music, Sparkles, Crown, Image } from "lucide-react";
import type { ShopItem } from "@/config/shopData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  code: Code,
  video: Video,
  box: Box,
  headphones: Headphones,
  star: Star,
  gift: Gift,
  shield: Shield,
  zap: Zap,
  layers: Layers,
  monitor: Monitor,
  music: Music,
  sparkles: Sparkles,
  crown: Crown,
  image: Image,
};

interface ShopGridCardProps {
  item: ShopItem;
  index: number;
  onClick?: () => void;
}

const ShopGridCard = ({ item, index, onClick }: ShopGridCardProps) => {
  const Icon = iconMap[item.icon] || Box;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative flex flex-col rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
    >
      {/* Image / Icon area */}
      <div className="relative flex items-center justify-center h-44 bg-secondary/40">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-8 w-8 text-foreground/70" />
        </div>
        {item.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            {item.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{item.name}</h3>

        {/* Rating */}
        {item.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(item.rating!) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {item.rating} ({item.reviews})
            </span>
          </div>
        )}

        {/* Features as tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.features.slice(0, 3).map((f, i) => (
            <span key={i} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
              {f}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {item.priceNote && (
              <span className="text-[11px] text-muted-foreground">{item.priceNote}</span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-foreground">{item.price}</span>
              {item.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => window.open("https://discord.gg/74hrs", "_blank")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 hover:scale-105"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopGridCard;
