import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import GfxCard from "@/components/gfx/GfxCard";
import GfxShowcase from "@/components/gfx/GfxShowcase";
import { gfxProjects, type GfxProject } from "@/config/gfxData";
import { supabase } from "@/integrations/supabase/client";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const GfxPortfolio = () => {
  const [active, setActive] = useState<GfxProject | null>(null);
  const [dbProjects, setDbProjects] = useState<GfxProject[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("kind", "gfx")
        .order("sort_order");
      if (!data) return;
      setDbProjects(
        (data as any[]).map((r) => ({
          id: r.id,
          title: r.title,
          tagline: (r.attributes && r.attributes.tagline) || "",
          description: r.description || "",
          image: r.cover_url || r.media_url || "",
          attributes: Array.isArray(r.attributes) ? r.attributes : (r.attributes?.attributes || []),
          software: r.attributes?.software,
          year: r.attributes?.year,
        }))
      );
    })();
  }, []);

  const all: GfxProject[] = [...dbProjects, ...gfxProjects];

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <AmbientBackground />

      <main className="pt-20">
        <section className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <motion.div
                className="mx-auto mb-8 h-[2px] w-12 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              />
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-8xl">
                GFX<span className="text-primary">.</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl">
                Graphics, thumbnails, banners & branding. Click a piece to see its DNA.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container px-4 pb-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((p, i) => (
              <GfxCard key={p.id} project={p} index={i} onClick={() => setActive(p)} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <GfxShowcase project={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default GfxPortfolio;
