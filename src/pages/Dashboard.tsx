
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Command, Package, Users, LogOut, Copy, Check, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  order_name: string;
  category: string;
  price: number;
  status: string;
  queue_position: number | null;
  created_at: string;
  description: string | null;
}

interface AffiliateData {
  referral_code: string;
  total_earnings: number;
  total_referrals: number;
  commission_rate: number;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchAffiliateData();
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    setIsAdmin(!!data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(data || []);
    }
  };

  const fetchAffiliateData = async () => {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error("Failed to fetch affiliate data:", error);
    } else {
      setAffiliateData(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const copyReferralCode = () => {
    if (affiliateData?.referral_code) {
      navigator.clipboard.writeText(affiliateData.referral_code);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <div className="flex items-center gap-2">
                <Command className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                  74hrs Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button onClick={handleSignOut} variant="outline" className="glass border-white/20 text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </h2>
          <p className="text-muted-foreground">Manage your orders and track your affiliate earnings</p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass mb-8">
            <TabsTrigger 
              value="orders" 
              className="text-white data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <Package className="w-4 h-4 mr-2" />
              My Orders
            </TabsTrigger>
            <TabsTrigger 
              value="affiliate" 
              className="text-white data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <Users className="w-4 h-4 mr-2" />
              Affiliate Program
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <Card className="glass border-white/20">
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Your orders will appear here once you make a purchase</p>
                  <Link to="/">
                    <Button className="button-gradient">
                      Browse Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="glass border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{order.order_name}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground">
                        {order.category.toUpperCase()} • Created {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="text-lg font-semibold text-white">${order.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Queue Position</p>
                          <p className="text-lg font-semibold text-white">
                            {order.queue_position ? `#${order.queue_position}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="text-lg font-semibold text-white capitalize">{order.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="text-xs font-mono text-muted-foreground">{order.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      {order.description && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="text-white">{order.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-6">
            {affiliateData && (
              <>
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Your Referral Code</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Share this code and earn {affiliateData.commission_rate}% commission on each referral
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-2 glass rounded-lg text-primary font-mono text-lg border border-white/20">
                        {affiliateData.referral_code}
                      </code>
                      <Button 
                        onClick={copyReferralCode} 
                        variant="outline" 
                        size="icon" 
                        className="glass border-white/20 hover:bg-white/10"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="glass border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">${affiliateData.total_earnings}</p>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Total Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">{affiliateData.total_referrals}</p>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Commission Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">{affiliateData.commission_rate}%</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
