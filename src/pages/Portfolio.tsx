import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ShoppingCart, Eye, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const portfolioItems = {
  gfx: [
    // {
    //   id: 1,
    //   title: "FiveM Server Logo Pack",
    //   type: "image",
    //   thumbnail: "/images/7335619d-58a9-41ad-a233-f7826f56f3e9.png",
    //   description: "Professional logo designs for FiveM servers"
    // },
    // {
    //   id: 2,
    //   title: "Custom Banner Set",
    //   type: "image", 
    //   thumbnail: "/images/79f2b901-8a4e-42a5-939f-fae0828e0aef.png",
    //   description: "High-quality banners for Discord and social media"
    // },
    // {
    //   id: 3,
    //   title: "UI Element Package",
    //   type: "image",
    //   thumbnail: "/images/b6436838-5c1a-419a-9cdc-1f9867df073d.png", 
    //   description: "Complete UI graphics for server interfaces"
    // }
  ],
  vfx: [
    {
      id: 4,
      title: "Treches WL Loading Screen",
      type: "video",
      thumbnail: "/images/dwan9duhawd-awdawdawd.png",
      videoUrl: "https://cdn.discordapp.com/attachments/1392669728559992973/1392669730980237372/07091.mp4?ex=69284982&is=6926f802&hm=21cbe44d02d02e001cd149278686052329bcb1b5cccd9b28baee7de0ac9bdb87&",
      description: "Blender Loading screen for Treches WL FiveM server. 2 Custom Characters With 2 Scenes. Made by @fakesarge"
    },
    {
      id: 5,
      title: "Stream Intro Blender Animation",
      type: "video", 
      thumbnail: "/images/i0j43098fj-3v90.png",
      videoUrl: "https://cdn.discordapp.com/attachments/1406833828680695808/1406833834124644444/0817_1.mp4?ex=6928665b&is=692714db&hm=8b4cd63aa6090b8542b6b6b6fbf21ca0d37af91af7dcaae01c213ffc3e896316&",
      description: "Twitch Stream intro animation with dynamic VFX elements"
    },
    {
      id: 6,
      title: "VFX Transition Pack",
      type: "video",
      thumbnail: "/images/dw9audn10-2893124.png",
      videoUrl: "https://cdn.discordapp.com/attachments/1385994351708078100/1385994353578868777/QlvCw3e.mp4?ex=69286454&is=692712d4&hm=021d22750d0e734bdc725cf8fb8547312e9ccb032106d52c81f1c21475ff39d1&", 
      description: "Fivem Blender Loading Screen with custom character and 1 scene. Made by @fakesarge"
    }
  ],
  templates: [
    {
      id: 7,
      title: "Premium Loading Screen Template",
      type: "template",
      thumbnail: "/images/86329743-ee49-4f2e-96f7-50508436273d.png",
      price: 15,
      description: "Customizable Blender template for loading screens"
    },
    {
      id: 8,
      title: "Logo Animation Template",
      type: "template",
      thumbnail: "/images/7335619d-58a9-41ad-a233-f7826f56f3e9.png", 
      price: 25,
      description: "Animated logo template with multiple variations"
    },
    {
      id: 9,
      title: "Complete Branding Kit",
      type: "template",
      thumbnail: "/images/79f2b901-8a4e-42a5-939f-fae0828e0aef.png",
      price: 45, 
      description: "Full branding template package for servers"
    }
  ]
};

const PortfolioItem = ({ item, onView, onPurchase }: {
  item: any;
  onView: (item: any) => void;
  onPurchase: (item: any) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ 
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    className="glass rounded-xl overflow-hidden group cursor-pointer relative"
  >
    {/* Hover Glow Effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      initial={false}
    />
    
    {/* Floating Particles on Hover */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100"
          style={{
            left: `${20 + i * 20}%`,
            top: `${20 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.5, 1],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>

    <div className="aspect-video relative overflow-hidden">
      <motion.img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        whileHover={{ filter: "brightness(1.1)" }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    
    <div className="p-6 relative z-10">
      <motion.h3 
        className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300"
        whileHover={{ x: 5 }}
      >
        {item.title}
      </motion.h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {item.description}
      </p>
      
      <div className="flex gap-3">
        <motion.button
          onClick={() => onView(item)}
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 glass hover:glass-hover px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          {item.type === 'video' ? (
            <Play className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">View</span>
        </motion.button>
        
        {item.price && (
          <motion.button
            onClick={() => onPurchase(item)}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 button-gradient px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">${item.price}</span>
          </motion.button>
        )}
      </div>
    </div>

    {/* Corner decoration */}
    <motion.div
      className="absolute top-2 right-2 w-2 h-2 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleView = (item: any) => {
    setSelectedItem(item);
  };

  const handlePurchase = (item: any) => {
    toast.success(`Added ${item.title} to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="container px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creative <span className="text-gradient">Portfolio</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore our collection of premium VFX graphics, cinematic animations, and custom templates designed for gaming communities.
            </motion.p>
            
            {/* Decorative elements */}
            <div className="relative mt-8">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/40 rounded-full"
                  style={{
                    left: `${40 + i * 10}%`,
                    top: `${20 + i * 5}px`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Portfolio Content */}
        <section className="container px-1 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Tabs defaultValue="gfx" className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex justify-center mb-12"
              >
                <TabsList className="glass p-2 backdrop-blur-xl border border-white/10">
                  {[
                    { value: "vfx", label: "VFX Animations" },
                  ].map((tab, index) => (
                    <motion.div key={tab.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TabsTrigger 
                        value={tab.value}
                        className="px-6 py-3 cursor-pointer data-[state=active]:glass data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          {tab.label}
                        </motion.span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </motion.div>

              {/* Tab Contents */}
              {[
                { value: "gfx", items: portfolioItems.gfx },
                { value: "vfx", items: portfolioItems.vfx },
                { value: "templates", items: portfolioItems.templates }
              ].map((tab, tabIndex) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {tab.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.1 * index,
                          ease: "easeOut"
                        }}
                        className="group"
                      >
                        <div className="glass border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]">
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={item.thumbnail} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                              <p className="text-white/80 text-xs">{item.description}</p>
                            </div>
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleView(item)}
                                className="flex-1 px-3 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-colors text-xs font-medium"
                              >
                                View
                              </button>
                              {(item as any).price && (
                                <button
                                  onClick={() => handlePurchase(item)}
                                  className="flex-1 px-3 py-2 button-gradient text-white rounded-lg hover:scale-105 transition-transform text-xs font-medium"
                                >
                                  ${(item as any).price}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </section>
      </main>

      <Footer />

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 cursor-auto"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedItem(null)}
                className="absolute top-[-10px] right-2 w-8 h-8 glass hover:glass-hover rounded-full flex items-center justify-center cursor-pointer z-10"
              >
                <X className="w- h-4" />
              </motion.button>

              {/* Content */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gradient mb-2">{selectedItem.title}</h2>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="aspect-video rounded-xl overflow-hidden glass"
                >
                  {selectedItem.videoUrl ? (
                    <video
                      src={selectedItem.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedItem.thumbnail}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>

                {selectedItem.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePurchase(selectedItem)}
                      className="button-gradient px-8 py-3 rounded-xl flex items-center gap-3 cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Purchase for ${selectedItem.price}</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Background decoration */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;