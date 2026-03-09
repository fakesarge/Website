import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { isOwner } from '@/config/admin';
import { useOrders } from '@/hooks/useOrderTracking';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AmbientBackground from '@/components/AmbientBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Shield, Settings, LogOut, Package, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const Dashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const navigate = useNavigate();

  const userOrders = orders?.filter(order => order.discord_id === profile?.discord_id) || [];
  const isAdmin = isOwner(profile?.discord_id);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'in progress': return 'bg-primary/10 text-primary/80 border-primary/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AmbientBackground />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: premiumEase }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div className="w-8 h-[1px] bg-primary/50 mb-4" />
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.discord_username || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/settings')} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" onClick={handleSignOut} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Profile + Stats */}
        <div className="grid gap-5 md:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
          >
            <Card className="glass border-border/10 h-full">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-border/10">
                    <AvatarImage src={profile?.discord_avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile?.discord_username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{profile?.discord_username || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    {isAdmin && (
                      <Badge className="mt-1 bg-destructive/15 text-destructive border-destructive/20 text-[10px]">
                        Owner
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {[
            { icon: Package, label: 'Total Orders', value: userOrders.length, delay: 0.2 },
            { icon: DollarSign, label: 'Total Spent', value: `$${userOrders.reduce((s, o) => s + Number(o.price), 0).toFixed(2)}`, delay: 0.3 },
            { icon: Clock, label: 'Active Orders', value: userOrders.filter(o => o.status.toLowerCase() !== 'completed' && o.status.toLowerCase() !== 'cancelled').length, delay: 0.4 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: stat.delay, ease: premiumEase }}
            >
              <Card className="glass border-border/10 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: premiumEase }}
        >
          <Card className="glass border-border/10">
            <CardHeader>
              <CardTitle className="text-lg">Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto flex items-center justify-center mb-4">
                    <Package className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    You haven't placed any orders yet. Browse our services to get started.
                  </p>
                  <Button onClick={() => window.location.href = '/shop'} className="button-gradient">
                    Browse Shop
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/10">
                        <TableHead>Order</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05, ease: premiumEase }}
                          className="border-border/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{order.order_name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{order.order_code}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{order.service}</TableCell>
                          <TableCell className="font-medium">${Number(order.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                              View
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="glass border-border/10 max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order Code</p>
                  <p className="font-mono text-sm">{selectedOrder.order_code}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="text-sm">{selectedOrder.service}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm">{selectedOrder.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Order Name</p>
                  <p className="text-sm">{selectedOrder.order_name}</p>
                </div>
                {selectedOrder.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedOrder.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-xl font-bold text-gradient">${Number(selectedOrder.price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm">{format(new Date(selectedOrder.created_at), 'PPP')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
