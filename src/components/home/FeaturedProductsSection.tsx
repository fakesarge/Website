import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shopCategories } from "@/config/shopData";
import MediaPlaceholder from "./MediaPlaceholder";

const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const products = shopCategories.find((category) => category.id === "products")?.items.slice(0, 3) ?? [];

  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div><p className="section-kicker">Digital goods</p><h2 className="mt-4 font-display text-5xl font-extrabold uppercase md:text-7xl">Shop the drop.</h2></div>
          <button onClick={() => navigate("/shop")} className="hidden items-center gap-2 text-xs font-bold uppercase md:flex">View shop <ArrowUpRight className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product, index) => (
            <motion.button key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} onClick={() => navigate(`/shop/${product.id}`)} className="group border border-border bg-card text-left">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <MediaPlaceholder label={`${product.name} cover`} className="h-full border-0" format="4:3" />}
              </div>
              <div className="flex items-start justify-between border-t border-border p-5">
                <div><h3 className="font-display text-lg font-bold uppercase">{product.name}</h3><p className="mt-2 text-sm text-muted-foreground">{product.price}</p></div>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </motion.button>
          ))}
          {products.length < 3 && <MediaPlaceholder label="New product cover" className="aspect-[4/3]" format="4:3" />}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;