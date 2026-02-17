import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Star, ShoppingCart, Palette, Code, Video, Box, Headphones, Gift, Shield, Zap,
  Layers, Monitor, Music, Sparkles, Crown, Image,
} from "lucide-react";
import type { ShopItem } from "@/config/shopData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette, code: Code, video: Video, box: Box, headphones: Headphones,
  star: Star, gift: Gift, shield: Shield, zap: Zap, layers: Layers,
  monitor: Monitor, music: Music, sparkles: Sparkles, crown: Crown, image: Image,
};

interface ShopGridCardProps {
  item: ShopItem;
  index: number;
  onClick?: () => void;
}

const ShopGridCard = ({ item, index, onClick }: ShopGridCardProps) => {
  const Icon = iconMap[item.icon] || Box;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const glowColor = item.glowColor || "hsl(var(--primary) / 0.15)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md overflow-hidden cursor-pointer transition-colors duration-500 hover:border-border/50"
      style={{
        boxShadow: hovered
          ? `0 20px 50px -12px ${glowColor}, 0 0 0 1px hsl(var(--border) / 0.1)`
          : "0 2px 12px -4px hsl(var(--primary) / 0.04)",
        transition: "box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* Image / Video Area */}
      <div className="relative h-44 bg-secondary/40 overflow-hidden">
        {item.image ? (
          <>
            <img
              src={item.image}
              alt={item.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                hovered && item.hoverPreview ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
              loading="lazy"
            />
            {item.hoverPreview && (
              item.hoverPreview.endsWith(".mp4") ? (
                <video
                  ref={videoRef}
                  src={item.hoverPreview}
                  muted loop playsInline preload="none"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <img
                  src={item.hoverPreview}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              )
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-background/60 backdrop-blur-sm">
              <Icon className="h-9 w-9 text-foreground/70" />
            </div>
          </div>
        )}

        {/* Subtle inner gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {item.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            {item.badge}
          </span>
        )}

        {item.originalPrice && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: index * 0.05 + 0.2 }}
            className="absolute top-3 right-3 flex flex-col items-center justify-center h-12 w-12 rounded-full bg-red-500 shadow-lg shadow-red-500/30"
          >
            <span className="text-[10px] font-bold text-white leading-none">SAVE</span>
            <span className="text-sm font-black text-white leading-none">
              {Math.round(((parseFloat(item.originalPrice.replace(/[^0-9.]/g, '')) - parseFloat(item.price.replace(/[^0-9.]/g, ''))) / parseFloat(item.originalPrice.replace(/[^0-9.]/g, ''))) * 100)}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 gap-4">
        <h3 className="text-lg font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-500">
          {item.name}
        </h3>

        {item.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(item.rating!)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {item.rating} ({item.reviews})
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {item.features.slice(0, 3).map((f, i) => (
            <span key={i} className="rounded-lg bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {item.priceNote && (
              <span className="text-xs text-muted-foreground">{item.priceNote}</span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">{item.price}</span>
              {item.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); window.open(item.purchaseUrl, "_blank"); }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] active:scale-95 shadow-md"
            aria-label="Buy Now"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopGridCard;
