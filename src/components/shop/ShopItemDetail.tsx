import { Star, Check, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { ShopItem } from "@/config/shopData";

interface ShopItemDetailProps {
  item: ShopItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShopItemDetail = ({ item, open, onOpenChange }: ShopItemDetailProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
        {/* Header area */}
        <div className="relative bg-secondary/50 px-6 pt-8 pb-6 text-center">
          {item.badge && (
            <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm">
            <span className="text-3xl">
              {item.icon === "palette" ? "🎨" : item.icon === "code" ? "💻" : item.icon === "video" ? "🎬" : item.icon === "box" ? "📦" : item.icon === "headphones" ? "🎧" : item.icon === "star" ? "⭐" : item.icon === "gift" ? "🎁" : item.icon === "shield" ? "🛡️" : item.icon === "zap" ? "⚡" : item.icon === "layers" ? "📚" : item.icon === "sparkles" ? "✨" : item.icon === "crown" ? "👑" : item.icon === "music" ? "🎵" : item.icon === "monitor" ? "🖥️" : item.icon === "image" ? "🖼️" : "📦"}
            </span>
          </div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">{item.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{item.description}</DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Rating */}
          {item.rating && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(item.rating!) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {item.rating} · {item.reviews} reviews
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-center">
            {item.priceNote && (
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.priceNote}</span>
            )}
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-foreground">{item.price}</span>
              {item.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{item.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-border/30 bg-secondary/30 p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's Included</h4>
            <ul className="space-y-2.5">
              {item.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={() => window.open("https://discord.gg/74hrs", "_blank")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Purchase Now
            <ExternalLink className="h-4 w-4" />
          </button>
          <p className="text-center text-xs text-muted-foreground">
            You'll be redirected to our Discord to complete your order
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopItemDetail;
