import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Box, Palette, Code, Video, Headphones, Gift, Shield, Zap, Layers, Monitor, Music, Sparkles, Crown, Image } from "lucide-react";
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

  const discount = item.originalPrice
    ? Math.round(
        ((parseFloat(item.originalPrice.replace(/[^0-9.]/g, "")) -
          parseFloat(item.price.replace(/[^0-9.]/g, ""))) /
          parseFloat(item.originalPrice.replace(/[^0-9.]/g, ""))) * 100
      )
    : null;

  // Category label derived from icon
  const categoryLabel = item.popular ? "PACK" : item.icon === "code" ? "PLUGIN" : item.icon === "box" ? "PACK" : "ITEM";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
      onMouseEnter={() => { setHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/70 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-500 hover:border-[hsl(var(--accent-glow)/0.5)]"
      style={{
        boxShadow: hovered
          ? "0 24px 60px -12px hsl(var(--accent-glow) / 0.25), 0 0 0 1px hsl(var(--accent-glow) / 0.25)"
          : "0 2px 12px -4px hsl(0 0% 0% / 0.5)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary/40 overflow-hidden">
        {item.image ? (
          <>
            <img
              src={item.image}
              alt={item.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                hovered && item.hoverPreview ? "opacity-0 scale-105" : "opacity-100 scale-100 group-hover:scale-[1.04]"
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
          <div className="flex h-full items-center justify-center">
            <Icon className="h-12 w-12 text-foreground/40" />
          </div>
        )}

        {/* Category badge — top-left */}
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider"
          style={{
            background: "hsl(var(--accent-glow) / 0.15)",
            color: "hsl(var(--accent-glow))",
            border: "1px solid hsl(var(--accent-glow) / 0.4)",
          }}
        >
          {item.badge?.toUpperCase() || categoryLabel}
        </span>

        {/* Discount % badge — top-right */}
        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-red-500/30">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
          {item.name}
        </h3>

        {item.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(item.rating!)
                      ? "fill-[hsl(var(--accent-glow))] text-[hsl(var(--accent-glow))]"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{item.rating}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">{item.price}</span>
          {item.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (item.purchaseUrl) window.open(item.purchaseUrl, "_blank");
            else onClick?.();
          }}
          className="mt-2 w-full rounded-full border border-[hsl(var(--accent-glow)/0.4)] bg-transparent py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:bg-[hsl(var(--accent-glow)/0.12)] hover:border-[hsl(var(--accent-glow)/0.7)] hover:shadow-[0_0_18px_hsl(var(--accent-glow)/0.35)]"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ShopGridCard;
