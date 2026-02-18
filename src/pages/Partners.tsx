import { motion } from "framer-motion";
import { ExternalLink, Users, Award, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const PartnersPage = () => {
  const partners = [
    {
      name: "Storm - Automated PC Checker",
      logo: "/images/8fda5ca4124b19e025330d3ca1abfb69.jpg",
      description: "Advanced Methods. Automated PC Checking. International Support. All in one click.\nSupports FiveM, RageMP, AltV, GTA San Andreas, Roblox, and more.",
      tier: "Gold",
      projects: 1,
      specialty: "PC Checking Solutions"
    }
  ];

  const partnerships = [
    { title: "Creative Collaboration", description: "Work directly with industry leaders on cutting-edge projects", icon: Users, color: "text-primary" },
    { title: "Award-Winning Work", description: "Our partnerships have resulted in multiple industry awards", icon: Award, color: "text-primary" },
    { title: "Premium Quality", description: "Delivering Hollywood-grade VFX for every project", icon: Star, color: "text-primary" },
    { title: "Growth Together", description: "Building long-term relationships that drive mutual success", icon: TrendingUp, color: "text-primary" },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premium': return 'bg-gradient-to-r from-primary/80 to-primary';
      case 'Gold': return 'bg-gradient-to-r from-primary/60 to-primary/90';
      default: return 'bg-gradient-to-r from-primary/40 to-primary/70';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <AmbientBackground />

      <main className="pt-20 pb-20">
        {/* Partners Grid */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase }}
              className="text-center mb-16"
            >
              <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Trusted by Industry <span className="text-gradient">Leaders</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Building the future of entertainment together
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index, ease: premiumEase }}
                >
                  <Card className="glass border-border/10 hover:border-primary/20 transition-all duration-500 group overflow-hidden"
                    style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className={`${getTierColor(partner.tier)} text-primary-foreground px-3 py-1`}>
                          {partner.tier} Partner
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                            {partner.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">{partner.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">{partner.projects}</p>
                            <p className="text-xs text-muted-foreground">Projects</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{partner.specialty}</p>
                            <p className="text-xs text-muted-foreground">Specialty</p>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full button-gradient"
                          onClick={() => window.open('https://stormss.cc/', '_blank')}
                        >
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="relative h-px w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        {/* Partnership Benefits */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase }}
              className="text-center mb-16"
            >
              <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Why Partner with <span className="text-gradient">74HRS</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partnerships.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: premiumEase }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.1)",
                    transition: { duration: 0.3, ease: premiumEase },
                  }}
                >
                  <Card className="glass border-border/10 text-center h-full hover:border-primary/20 transition-all duration-500">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <benefit.icon className="h-12 w-12 mx-auto text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersPage;
