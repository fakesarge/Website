
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Command, Shield, Users, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface AdminOrder {
  id: string;
  order_name: string;
  category: string;
  price: number;
  status: string;
  queue_position: number | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface AdminAffiliate {
  id: string;
  referral_code: string;
  total_earnings: number;
  total_referrals: number;
  commission_rate: number;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const checkAdminStatus = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      toast.error("Access denied: Admin privileges required");
      navigate("/dashboard");
    } else {
      setIsAdmin(true);
      fetchAdminData();
    }
    setAdminLoading(false);
  };

  const fetchAdminData = async () => {
    // Fetch all orders with user profiles
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(ordersData || []);
    }

    // Fetch all affiliates with user profiles
    const { data: affiliatesData, error: affiliatesError } = await supabase
      .from('affiliates')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('total_earnings', { ascending: false });

    if (affiliatesError) {
      toast.error("Failed to fetch affiliates");
    } else {
      setAffiliates(affiliatesData || []);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      toast.success("Order status updated successfully");
      fetchAdminData();
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

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-silver/20 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/dashboard")} variant="outline" size="icon" className="glass border-silver/20">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-silver bg-clip-text text-transparent">
                  74hrs Admin Panel
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage orders, users, and affiliate program</p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/40 mb-8">
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-primary">
              <Package className="w-4 h-4 mr-2" />
              All Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="text-white data-[state=active]:bg-primary">
              <Users className="w-4 h-4 mr-2" />
              Affiliates ({affiliates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="glass border-silver/20">
              <CardHeader>
                <CardTitle className="text-white">Order Management</CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage all customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-silver/20">
                      <TableHead className="text-gray-300">Customer</TableHead>
                      <TableHead className="text-gray-300">Order</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Queue</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-silver/20">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{order.profiles?.full_name}</p>
                            <p className="text-gray-400 text-sm">{order.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">{order.order_name}</TableCell>
                        <TableCell className="text-gray-300 capitalize">{order.category}</TableCell>
                        <TableCell className="text-white">${order.price}</TableCell>
                        <TableCell className="text-white">
                          {order.queue_position ? `#${order.queue_position}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'in_progress')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Start
                              </Button>
                            )}
                            {order.status === 'in_progress' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates">
            <Card className="glass border-silver/20">
              <CardHeader>
                <CardTitle className="text-white">Affiliate Program</CardTitle>
                <CardDescription className="text-gray-400">
                  View affiliate performance and manage commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-silver/20">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Referral Code</TableHead>
                      <TableHead className="text-gray-300">Total Referrals</TableHead>
                      <TableHead className="text-gray-300">Total Earnings</TableHead>
                      <TableHead className="text-gray-300">Commission Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((affiliate) => (
                      <TableRow key={affiliate.id} className="border-silver/20">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{affiliate.profiles?.full_name}</p>
                            <p className="text-gray-400 text-sm">{affiliate.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-primary font-mono">{affiliate.referral_code}</code>
                        </TableCell>
                        <TableCell className="text-white">{affiliate.total_referrals}</TableCell>
                        <TableCell className="text-white">${affiliate.total_earnings}</TableCell>
                        <TableCell className="text-white">{affiliate.commission_rate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
