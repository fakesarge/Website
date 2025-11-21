import { motion } from 'framer-motion';
import { Clock, Package, User, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders, useRealtimeOrders } from '@/hooks/useOrderTracking';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const OrderQueue = () => {
  const { data: orders, isLoading } = useOrders();
  
  // Set up real-time subscription
  useRealtimeOrders();

  // Sort orders from oldest to newest (first to last)
  const queuedOrders = orders?.slice().sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="container px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Order <span className="text-gradient">Queue</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Live order queue - from first to last
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Real-time updates</span>
                </div>
                <span>•</span>
                <span>{queuedOrders.length} orders in queue</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Order Queue */}
        <section className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <Card className="glass border-white/10">
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </CardContent>
              </Card>
            ) : queuedOrders.length === 0 ? (
              <Card className="glass border-white/10">
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground">
                    The order queue is empty. New orders will appear here automatically.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {queuedOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Queue Position */}
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-2xl font-bold text-primary">
                              #{index + 1}
                            </span>
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                  {order.order_name}
                                </h3>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {order.order_code}
                                </p>
                              </div>
                              <Badge variant={getStatusBadgeVariant(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground text-xs">Customer</p>
                                  <p className="font-medium">{order.customer_name}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground text-xs">Service</p>
                                  <p className="font-medium">{order.service}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground text-xs">Price</p>
                                  <p className="font-medium">${order.price}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground text-xs">Date</p>
                                  <p className="font-medium">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {order.description && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-sm text-muted-foreground">{order.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{queuedOrders.length}</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-500">
                    {queuedOrders.filter(o => o.status === 'pending').length}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">
                    {queuedOrders.filter(o => o.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderQueue;
