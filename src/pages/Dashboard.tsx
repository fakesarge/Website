import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrderTracking';
import { useUserRoles } from '@/hooks/useUserRoles';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useUserRoles(user?.id);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  const userOrders = orders?.filter(order => order.discord_id === profile?.discord_id) || [];

  const handleSyncRoles = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('sync-discord-roles', {
        body: { userId: user?.id }
      });

      if (error) throw error;
      
      await refetchRoles();
      toast.success('Discord roles synced successfully!');
    } catch (error) {
      console.error('Error syncing roles:', error);
      toast.error('Failed to sync Discord roles');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderator': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'vip': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  if (!profile?.discord_id) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Discord Account Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You need to connect your Discord account to view your orders.
                Please log in with Discord.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.discord_username || 'User'}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* User Profile Card */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.discord_avatar_url || ''} />
                  <AvatarFallback>{profile?.discord_username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{profile?.discord_username || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {rolesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <Badge key={role} className={getRoleColor(role)}>
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge>user</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="text-sm">{format(new Date(profile?.created_at || user.created_at), 'PPP')}</p>
              </div>

              <Button onClick={handleSyncRoles} disabled={syncing} className="w-full">
                {syncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh Discord Roles
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userOrders.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${userOrders.reduce((sum, order) => sum + Number(order.price), 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">You haven't placed any orders yet. Start exploring our services!</p>
                <Button onClick={() => window.location.href = '/shop'}>
                  Browse Shop
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.order_code}</TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>${Number(order.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono">{selectedOrder.order_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Name</p>
                <p>{selectedOrder.order_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p>{selectedOrder.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedOrder.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedOrder.description || 'No description'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-xl font-bold">${Number(selectedOrder.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{format(new Date(selectedOrder.created_at), 'PPP p')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p>{format(new Date(selectedOrder.updated_at), 'PPP p')}</p>
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
