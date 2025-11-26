import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Sparkles, Zap, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// MAINTENANCE MODE - Set to true to enable maintenance page
const MAINTENANCE_MODE = true;

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<"templates" | "services">("templates");

  const templates = [
    {
      id: 1,
      name: "Cinematic VFX Pack",
      price: 149,
      image: "/lovable-uploads/79f2b901-8a4e-42a5-939f-fae0828e0aef.png",
      category: "VFX",
      features: ["50+ Effects", "4K Quality", "Cinema Grade"],
      popular: true,
    },
    {
      id: 2,
      name: "Motion Graphics Bundle",
      price: 99,
      image: "/lovable-uploads/7335619d-58a9-41ad-a233-f7826f56f3e9.png",
      category: "Motion",
      features: ["100+ Templates", "Customizable", "After Effects"],
      popular: false,
    },
    {
      id: 3,
      name: "Logo Animation Pack",
      price: 79,
      image: "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png",
      category: "Animation",
      features: ["25 Animations", "Full HD", "Easy Setup"],
      popular: false,
    },
  ];

  const services = [
    {
      id: 1,
      name: "Custom VFX Production",
      price: 499,
      duration: "Starting at",
      features: ["Unlimited Revisions", "4K Delivery", "2 Week Turnaround", "Commercial Rights"],
      popular: true,
    },
    {
      id: 2,
      name: "Character Animation",
      price: 299,
      duration: "Per Character",
      features: ["Full Body Rigging", "Facial Animation", "Motion Capture", "Source Files"],
      popular: false,
    },
    {
      id: 3,
      name: "Post-Production Package",
      price: 399,
      duration: "Per Project",
      features: ["Color Grading", "Sound Design", "VFX Integration", "Final Render"],
      popular: false,
    },
  ];

  const currentItems = selectedCategory === "templates" ? templates : services;

  // Maintenance mode page
  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-primary/5" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        </div>
        <Navigation />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wrench className="w-24 h-24 mx-auto mb-6 text-primary" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Coming <span className="text-gradient">Soon</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're preparing an amazing shop experience. Stay tuned for exclusive templates and services!
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-primary/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1 text-sm">Premium Quality</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Premium <span className="text-gradient">VFX Assets</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Professional-grade templates and custom services for creators who demand excellence
            </p>
          </motion.div>

          {/* Category Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 mb-16"
          >
            <Button
              variant={selectedCategory === "templates" ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory("templates")}
              className="min-w-[180px] relative overflow-hidden group"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              variant={selectedCategory === "services" ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory("services")}
              className="min-w-[180px] relative overflow-hidden group"
            >
              <Zap className="w-4 h-4 mr-2" />
              Services
            </Button>
          </motion.div>
        </section>

        {/* Products Grid */}
        <section className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 h-full">
                  {item.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-primary/90 backdrop-blur-sm">Popular</Badge>
                    </div>
                  )}
                  
                  {selectedCategory === "templates" && "image" in item && (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60" />
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    {"category" in item && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gradient">${item.price}</span>
                        {"duration" in item && (
                          <span className="text-sm text-muted-foreground">{item.duration}</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full group-hover:scale-[1.02] transition-transform">
                      Purchase Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center glass rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Need Something <span className="text-gradient">Custom?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get in touch with our team to discuss your unique project requirements
            </p>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Contact Sales
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
