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
      name: "Netflix Studios",
      logo: "/lovable-uploads/0dbe1b75-2c74-4ff8-ba55-4be4d74abe72.png",
      description: "Leading streaming platform with global reach",
      tier: "Premium",
      projects: 15,
      specialty: "Original Series VFX"
    },
    {
      name: "Warner Bros",
      logo: "/lovable-uploads/1e2a48dc-059b-4919-a1ed-44685d771a32.png", 
      description: "Iconic entertainment company",
      tier: "Premium",
      projects: 12,
      specialty: "Blockbuster Films"
    },
    {
      name: "Disney Studios",
      logo: "/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png",
      description: "Magic through innovative storytelling",
      tier: "Gold",
      projects: 8,
      specialty: "Animation & Fantasy"
    },
    {
      name: "Universal Pictures",
      logo: "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png",
      description: "Global entertainment leader",
      tier: "Gold",
      projects: 10,
      specialty: "Action Sequences"
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
        {/* Hero Section */}
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">Elite</span> Partnerships
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Collaborating with industry giants to create cinematic masterpieces that push the boundaries of visual storytelling.
              </p>
              <Button className="button-gradient text-lg px-8 py-3">
                Become a Partner
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-background/80 flex items-center justify-center border border-white/20">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {partner.name}
                      </CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <Badge className={`${getTierColor(partner.tier)} text-white px-3 py-1`}>
                          {partner.tier} Partner
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{partner.projects}</p>
                          <p className="text-sm text-muted-foreground">Projects</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{partner.specialty}</p>
                          <p className="text-xs text-muted-foreground">Specialty</p>
                        </div>
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

        {/* Affiliate CTA */}
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="glass border-primary/20 text-center">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Join Our <span className="text-gradient">Affiliate Program</span>
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Earn commission by promoting our premium VFX content to your audience
                  </p>
                  <Button 
                    className="button-gradient text-lg px-8 py-3"
                    onClick={() => window.location.href = '/affiliates'}
                  >
                    Learn More
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersPage;