import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders, useRealtimeOrders } from '@/hooks/useOrderTracking';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';


const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAffiliateBalance, setShowAffiliateBalance] = useState(false);
  
  const { data: orders, isLoading } = useOrders();
  const { toast } = useToast();

  // Set up real-time subscription
  useRealtimeOrders();

  const filteredOrders = orders?.filter(order => 
    order.order_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast({
        title: "Search term required",
        description: "Please enter an order code, name, or email to search.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

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
                Order <span className="text-gradient">Tracking</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Track your orders in real-time and manage your account.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Orders
                </CardTitle>
                <CardDescription>Enter order code, name, or email to find your order</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Search by order code, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {searchTerm && filteredOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                <div className="grid gap-6">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{order.order_name}</h3>
                            <p className="text-muted-foreground">{order.order_code}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Customer</p>
                            <p className="font-medium">{order.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Service</p>
                            <p className="font-medium">{order.service}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">${order.price}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {order.description && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-muted-foreground text-sm">{order.description}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {searchTerm && filteredOrders.length === 0 && !isLoading && (
              <Card className="glass border-white/10 text-center">
                <CardContent className="py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground">
                    No orders match your search criteria: "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>


       
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;