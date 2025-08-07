import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Users, DollarSign, TrendingUp, Gift, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAffiliateByEmail, useAffiliateOrders, useCreateAffiliate } from "@/hooks/useAffiliates";
import { useToast } from "@/components/ui/use-toast";

const AffiliatesPage = () => {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [name, setName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { toast } = useToast();
  const { data: affiliate, isLoading: affiliateLoading } = useAffiliateByEmail(searchEmail);
  const { data: orders } = useAffiliateOrders(searchEmail);
  const createAffiliate = useCreateAffiliate();

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "10% Commission",
      description: "Earn 10% on every successful referral",
      color: "text-green-400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Easy Sharing",
      description: "Simple referral links to share with your audience",
      color: "text-blue-400"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Monitor your earnings and referrals instantly",
      color: "text-purple-400"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Bonus Rewards",
      description: "Special bonuses for top performers",
      color: "text-yellow-400"
    }
  ];

  const handleSearch = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    setSearchEmail(email);
  };

  const handleCreateAffiliate = async () => {
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createAffiliate.mutate({ email, affiliate_name: name });
    setShowCreateForm(false);
  };

  const totalCommission = orders?.reduce((total, order) => total + (order.price * 0.1), 0) || 0;
  const isEligible = (orders?.length || 0) >= 1 && totalCommission >= 50;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="pt-20 pb-20">
        <section className="container px-4 py-20" data-animate>
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

        <section className="container px-4 py-20" data-animate>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
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
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  data-animate-child
                >
                  <Card className="glass border-white/10 text-center h-full hover:border-primary/30 transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex justify-center">
                        <div className={benefit.color}>
                          {benefit.icon}
                        </div>
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

        <section className="container px-4 py-20" data-animate>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
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
                  description: "Share your link and earn 10% commission on every sale"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  data-animate-child
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

        <section className="container px-4 py-20" data-animate>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-black/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center mb-6">
                    Affiliate Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={affiliateLoading}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {searchEmail && !affiliate && !affiliateLoading && (
                    <div className="text-center space-y-4">
                      <p className="text-gray-400">No affiliate account found for this email.</p>
                      {!showCreateForm ? (
                        <Button onClick={() => setShowCreateForm(true)}>
                          Create Affiliate Account
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <Input
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleCreateAffiliate} disabled={createAffiliate.isPending}>
                              Create Account
                            </Button>
                            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {affiliate && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">
                              ${totalCommission.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">Total Commission</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {orders?.length || 0}
                            </div>
                            <div className="text-sm text-gray-400">Total Orders</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {isEligible ? "Eligible" : "Not Eligible"}
                            </div>
                            <div className="text-sm text-gray-400">Affiliate Status</div>
                          </CardContent>
                        </Card>
                      </div>

                      {isEligible && (
                        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-700">
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">Your Referral Link:</h3>
                            <div className="flex gap-2">
                              <Input
                                value={`https://74hrs.com?ref=${affiliate.referral_code}`}
                                readOnly
                                className="bg-gray-800 border-gray-600"
                              />
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://74hrs.com?ref=${affiliate.referral_code}`);
                                  toast({ title: "Copied to clipboard!" });
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
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