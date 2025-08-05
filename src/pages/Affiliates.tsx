import { motion } from "framer-motion";
import { Star, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AffiliateBalance from "@/components/AffiliateBalance";

const AffiliatesPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "15% Commission",
      description: "Earn 15% on every sale you refer to our platform",
      color: "text-green-400"
    },
    {
      icon: Users,
      title: "Growing Network",
      description: "Join thousands of creators already earning with us",
      color: "text-blue-400"
    },
    {
      icon: Star,
      title: "Real-time Tracking",
      description: "Monitor your referrals and earnings instantly",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Monthly Payouts",
      description: "Receive your commissions every month like clockwork",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                <span className="text-gradient">Affiliate</span> Program
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Turn your creativity into income. Share our premium VFX content and earn commission on every sale.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Join Our <span className="text-gradient">Affiliate Program</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Start earning with the industry's most trusted VFX platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <Card className="glass border-white/10 text-center h-full hover:border-primary/30 transition-all duration-300">
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

        {/* How It Works */}
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It <span className="text-gradient">Works</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Check Your Status",
                  description: "Enter your email below to see if you're eligible for our affiliate program"
                },
                {
                  step: "02", 
                  title: "Get Your Link",
                  description: "Generate your unique referral link instantly if you qualify"
                },
                {
                  step: "03",
                  title: "Start Earning",
                  description: "Share your link and earn 15% commission on every sale"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                >
                  <Card className="glass border-white/10 text-center">
                    <CardHeader>
                      <div className="text-4xl font-bold text-primary mb-2">{step.step}</div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliate Balance Checker */}
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="glass border-primary/20">
                <CardContent className="p-8">
                  <AffiliateBalance />
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

export default AffiliatesPage;