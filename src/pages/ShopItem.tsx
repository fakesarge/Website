import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Check, ExternalLink, ChevronRight, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopGridCard from "@/components/shop/ShopGridCard";
import { getItemById, getCategoryByItemId, getRelatedItems, type ShopItem as ShopItemType } from "@/config/shopData";

const iconEmoji: Record<string, string> = {
  palette: "🎨", code: "💻", video: "🎬", box: "📦", headphones: "🎧",
  star: "⭐", gift: "🎁", shield: "🛡️", zap: "⚡", layers: "📚",
  sparkles: "✨", crown: "👑", music: "🎵", monitor: "🖥️", image: "🖼️",
};

const ShopItemPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const item = itemId ? getItemById(itemId) : undefined;
  const category = itemId ? getCategoryByItemId(itemId) : undefined;
  const related = itemId ? getRelatedItems(itemId, 4) : [];

  if (!item) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <Link to="/shop" className="text-primary hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <Navigation />

      {/* Breadcrumbs */}
      <div className="container px-4 pt-24 pb-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link to="/shop" className="hover:text-foreground transition-colors">{category.label}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-[200px]">{item.name}</span>
        </motion.nav>
      </div>

      {/* Hero Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative flex items-center justify-center aspect-square rounded-3xl bg-secondary/40 border border-border/30 overflow-hidden">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-background/60 backdrop-blur-sm">
                <span className="text-7xl">{iconEmoji[item.icon] || "📦"}</span>
              </div>
              {item.badge && (
                <span className="absolute top-5 left-5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                  {item.badge}
                </span>
              )}
              {item.originalPrice && (
                <span className="absolute top-5 right-5 rounded-full bg-destructive/90 px-3 py-1 text-xs font-bold text-white">
                  Save {Math.round(((parseInt(item.originalPrice.replace("$", "")) - parseInt(item.price.replace("$", ""))) / parseInt(item.originalPrice.replace("$", ""))) * 100)}%
                </span>
              )}
            </div>
          </motion.div>

          {/* Right — Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {item.popular && (
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                ⭐ Most Popular
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{item.name}</h1>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(item.rating!) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{item.rating}</span>
                <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed text-base">
              {item.fullDescription || item.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {item.priceNote && (
                <span className="text-sm text-muted-foreground">{item.priceNote}</span>
              )}
              <span className="text-4xl font-bold text-foreground">{item.price}</span>
              {item.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{item.originalPrice}</span>
              )}
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-5">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">What's Included</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Buy Now
              <ExternalLink className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              You'll be redirected to our Discord to complete your order
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      {item.userReviews && item.userReviews.length > 0 && (
        <section className="container px-4 pb-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(item.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Based on {item.reviews} reviews</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {item.userReviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground/70">
                        {review.username.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{review.username}</p>
                        <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    {review.helpful && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                        Most Helpful
                      </span>
                    )}
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${j < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Items */}
      {related.length > 0 && (
        <section className="container px-4 pb-32">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-foreground mb-8"
            >
              You Might Also Like
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((rel, i) => (
                <ShopGridCard
                  key={rel.id}
                  item={rel}
                  index={i}
                  onClick={() => navigate(`/shop/${rel.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ShopItemPage;
