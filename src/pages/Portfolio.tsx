
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const portfolioItems = {
  gfx: [
    {
      id: 1,
      title: "FiveM Server Logo Pack",
      type: "image",
      thumbnail: "/lovable-uploads/7335619d-58a9-41ad-a233-f7826f56f3e9.png",
      description: "Professional logo designs for FiveM servers"
    },
    {
      id: 2,
      title: "Custom Banner Set",
      type: "image", 
      thumbnail: "/lovable-uploads/79f2b901-8a4e-42a5-939f-fae0828e0aef.png",
      description: "High-quality banners for Discord and social media"
    },
    {
      id: 3,
      title: "UI Element Package",
      type: "image",
      thumbnail: "/lovable-uploads/b6436838-5c1a-419a-9cdc-1f9867df073d.png", 
      description: "Complete UI graphics for server interfaces"
    }
  ],
  vfx: [
    {
      id: 4,
      title: "Cinematic Loading Screen",
      type: "video",
      thumbnail: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png",
      videoUrl: "https://example.com/video1.mp4",
      description: "Epic Blender-rendered loading screen with particles"
    },
    {
      id: 5,
      title: "3D Animation Intro",
      type: "video", 
      thumbnail: "/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png",
      videoUrl: "https://example.com/video2.mp4",
      description: "Stunning 3D animated server introduction"
    },
    {
      id: 6,
      title: "VFX Transition Pack",
      type: "video",
      thumbnail: "/lovable-uploads/c32c6788-5e4a-4fee-afee-604b03113c7f.png",
      videoUrl: "https://example.com/video3.mp4", 
      description: "Smooth transition effects for video content"
    }
  ],
  templates: [
    {
      id: 7,
      title: "Premium Loading Screen Template",
      type: "template",
      thumbnail: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png",
      price: "$15",
      description: "Customizable Blender template for loading screens"
    },
    {
      id: 8,
      title: "Logo Animation Template",
      type: "template",
      thumbnail: "/lovable-uploads/7335619d-58a9-41ad-a233-f7826f56f3e9.png", 
      price: "$25",
      description: "Animated logo template with multiple variations"
    },
    {
      id: 9,
      title: "Complete Branding Kit",
      type: "template",
      thumbnail: "/lovable-uploads/79f2b901-8a4e-42a5-939f-fae0828e0aef.png",
      price: "$45", 
      description: "Full branding template package for servers"
    }
  ]
};

const PortfolioItem = ({ item, onView, onPurchase }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1B1B1B] rounded-lg overflow-hidden border border-white/10 group hover:border-primary/50 transition-all duration-300"
  >
    <div className="relative aspect-video">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(item)}
          className="glass"
        >
          {item.type === "video" ? <Play className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          View
        </Button>
        {item.type === "template" && (
          <Button
            size="sm"
            onClick={() => onPurchase(item)}
            className="button-gradient"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {item.price}
          </Button>
        )}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold mb-2">{item.title}</h3>
      <p className="text-sm text-gray-400">{item.description}</p>
    </div>
  </motion.div>
);

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleView = (item: any) => {
    setSelectedItem(item);
  };

  const handlePurchase = (item: any) => {
    console.log("Purchase:", item.title);
    // TODO: Integrate with payment system
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-20">
        <section className="container px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore our collection of premium FiveM graphics, VFX animations, and customizable templates
            </p>
          </motion.div>

          <Tabs defaultValue="gfx" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1B1B1B] mb-8">
              <TabsTrigger value="gfx">GFX Graphics</TabsTrigger>
              <TabsTrigger value="vfx">VFX Animations</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="gfx">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.gfx.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vfx">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.vfx.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.templates.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />

      {/* Modal for viewing items */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#1B1B1B] rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <Button variant="outline" onClick={closeModal}>
                  ×
                </Button>
              </div>
              
              {selectedItem.type === "video" ? (
                <div className="aspect-video mb-4">
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    poster={selectedItem.thumbnail}
                  >
                    <source src={selectedItem.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="aspect-video mb-4">
                  <img
                    src={selectedItem.thumbnail}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-gray-400 mb-4">{selectedItem.description}</p>
              
              {selectedItem.type === "template" && (
                <Button
                  onClick={() => handlePurchase(selectedItem)}
                  className="button-gradient"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase for {selectedItem.price}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
