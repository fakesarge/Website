import { motion } from "framer-motion";
import { ExternalLink, Users, Award, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PartnersPage = () => {
  const partners = [
    {
      name: "Storm - Automated PC Checker",
      logo: "/images/8fda5ca4124b19e025330d3ca1abfb69.jpg",
      description: "Advanced Methods. Automated PC Checking. International Support. All in one click."+"\n"+
      "Supports FiveM, RageMP, AltV, GTA San Andreas, Roblox, and more.",
      tier: "Gold",
      projects: 1,
      specialty: "PC Checking Solutions"
    }
    
  ];

  const partnerships = [
    {
      title: "Creative Collaboration",
      description: "Work directly with industry leaders on cutting-edge projects",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Award-Winning Work",
      description: "Our partnerships have resulted in multiple industry awards",
      icon: Award,
      color: "text-yellow-400"
    },
    {
      title: "Premium Quality",
      description: "Delivering Hollywood-grade VFX for every project",
      icon: Star,
      color: "text-purple-400"
    },
    {
      title: "Growth Together",
      description: "Building long-term relationships that drive mutual success",
      icon: TrendingUp,
      color: "text-green-400"
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="pt-20 pb-20">
       

        {/* Partners Grid */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Industry <span className="text-gradient">Leaders</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Building the future of entertainment together
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                    {/* Visual Banner */}
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className={`${getTierColor(partner.tier)} text-white px-3 py-1`}>
                          {partner.tier} Partner
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Label Section */}
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
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
                        
                        {/* Action Button */}
                        <Button 
                          className="w-full button-gradient hover:scale-105 transition-transform"
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

        {/* Partnership Benefits */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Partner with <span className="text-gradient">74HRS</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partnerships.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <Card className="glass border-white/10 text-center h-full">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <benefit.icon className={`h-12 w-12 mx-auto ${benefit.color}`} />
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