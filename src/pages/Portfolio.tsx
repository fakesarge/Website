import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GalleryCard from "@/components/gallery/GalleryCard";
import GalleryShowcase from "@/components/gallery/GalleryShowcase";
import AmbientBackground from "@/components/AmbientBackground";
import { galleryProjects, type GalleryProject } from "@/config/galleryData";
import { supabase } from "@/integrations/supabase/client";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const extractYoutubeId = (url: string) => {
  if (!url) return "";
  if (!url.includes("/") && !url.includes("?")) return url; // already ID
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? m[1] : url;
};

const Portfolio = () => {
  const [activeProject, setActiveProject] = useState<GalleryProject | null>(null);
  const [dbProjects, setDbProjects] = useState<GalleryProject[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("kind", "vfx")
        .order("sort_order");
      if (!data) return;
      setDbProjects(
        (data as any[]).map((r) => ({
          id: r.id,
          title: r.title,
          tagline: r.attributes?.tagline || "",
          description: r.description || "",
          youtubeId: extractYoutubeId(r.media_url || ""),
          features: Array.isArray(r.attributes?.features) ? r.attributes.features : [],
          productUrl: r.attributes?.productUrl,
          size: (r.attributes?.size as GalleryProject["size"]) || "normal",
        }))
      );
    })();
  }, []);

  const allProjects: GalleryProject[] = [...dbProjects, ...galleryProjects];

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <AmbientBackground />

      <main className="pt-20">
        {/* Hero */}
        <section className="container px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase }}
            >
              <motion.div
                className="w-12 h-[2px] bg-primary mx-auto mb-8"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
              />
              <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-foreground mb-4">
                Our Work<span className="text-primary">.</span>
              </h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: premiumEase }}
              >
                Built for elite FiveM servers.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Masonry Gallery */}
        <section className="container px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-4 md:gap-5 max-w-7xl mx-auto">
            {allProjects.map((project, index) => (
              <GalleryCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <GalleryShowcase
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </div>
  );
};

export default Portfolio;
