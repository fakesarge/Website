import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import AmbientBackground from '@/components/AmbientBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search, Shield, ShieldOff, LogOut, Package, DollarSign, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OWNER_DISCORD_ID = '1201255976683196426';
const ease = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant="outline" className={statusColor[status] || 'bg-muted text-muted-foreground'}>
    {status.replace('_', ' ')}
  </Badge>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Auth: read session + profile directly, no complex context ──
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['dashboard-auth'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      return { user: session.user, profile };
    },
    staleTime: 60_000,
  });

  const isOwner = authData?.profile?.discord_id === OWNER_DISCORD_ID;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Loading ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Not logged in ──
  if (!authData?.user) {
    navigate('/login');
    return null;
  }

  // ── Not owner ──
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-4">This dashboard is only available to the studio owner.</p>
          <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AmbientBackground />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="relative">
                <Shield className="w-6 h-6 text-destructive" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Studio Dashboard</h1>
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Owner</Badge>
            </div>
            <p className="text-muted-foreground text-sm ml-9">
              Welcome back, {authData.profile?.discord_username}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-border/20">
              <AvatarImage src={authData.profile?.discord_avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {authData.profile?.discord_username?.[0]?.toUpperCase() || 'O'}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsRow />

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          <Tabs defaultValue="orders" className="mt-8">
            <TabsList className="bg-secondary/50 mb-6">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" /> Orders
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrdersPanel toast={toast} queryClient={queryClient} />
            </TabsContent>
            <TabsContent value="users">
              <UsersPanel toast={toast} queryClient={queryClient} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Stats Row ───────────────────────────────────────────────────────────────

const StatsRow = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('status, price');
      const total = data?.length || 0;
      const revenue = data?.reduce((s, o) => s + Number(o.price), 0) || 0;
      const active = data?.filter(o => o.status === 'pending' || o.status === 'in_progress').length || 0;
      const completed = data?.filter(o => o.status === 'completed').length || 0;
      return { total, revenue, active, completed };
    },
    staleTime: 30_000,
  });

  const items = [
    { icon: Package, label: 'Total Orders', value: stats?.total ?? '—' },
    { icon: DollarSign, label: 'Total Revenue', value: stats ? `$${stats.revenue.toFixed(2)}` : '—' },
    { icon: Clock, label: 'Active Orders', value: stats?.active ?? '—' },
    { icon: Shield, label: 'Completed', value: stats?.completed ?? '—' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div key={item.label}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 * i, ease }}
        >
          <Card className="glass border-border/10">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Orders Panel ─────────────────────────────────────────────────────────────

const OrdersPanel = ({ toast, queryClient }: { toast: any; queryClient: any }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders-direct', search, statusFilter],
    queryFn: async () => {
      let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (search) q = q.or(`customer_name.ilike.%${search}%,order_code.ilike.%${search}%,discord_id.ilike.%${search}%,customer_email.ilike.%${search}%`);
      if (statusFilter && statusFilter !== 'all') q = q.eq('status', statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (order: any) => {
      const { error } = await supabase.from('orders').update({
        order_name: order.order_name,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        price: parseFloat(order.price),
        status: order.status,
        category: order.category,
        service: order.service,
        description: order.description,
        discord_id: order.discord_id,
      }).eq('id', order.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-direct'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Order updated' });
      setEditingOrder(null);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-direct'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Order deleted' });
      setDeletingId(null);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const createMutation = useMutation({
    mutationFn: async (order: any) => {
      const { error } = await supabase.from('orders').insert({
        order_name: order.order_name,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        price: parseFloat(order.price),
        status: order.status || 'pending',
        category: order.category,
        service: order.service,
        description: order.description || null,
        discord_id: order.discord_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-direct'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Order created' });
      setCreateOpen(false);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateMutation.mutate({ id: editingOrder.id, ...Object.fromEntries(fd) });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate(Object.fromEntries(fd));
  };

  return (
    <Card className="glass border-border/10">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Create, edit and delete all customer orders</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Order</DialogTitle>
                <DialogDescription>Add a new order to the system</DialogDescription>
              </DialogHeader>
              <OrderForm onSubmit={handleCreate} isPending={createMutation.isPending} onCancel={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, email, Discord ID, code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-lg border border-border/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/20">
                  <TableHead>Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Discord</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order: any) => (
                  <TableRow key={order.id} className="border-border/10 hover:bg-white/[0.02]">
                    <TableCell className="font-mono text-xs">{order.order_code}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{order.service}</TableCell>
                    <TableCell className="font-medium">${Number(order.price).toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{order.discord_id || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingOrder(order)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Order</DialogTitle>
                              <DialogDescription>Update order details</DialogDescription>
                            </DialogHeader>
                            {editingOrder?.id === order.id && (
                              <OrderForm defaults={editingOrder} onSubmit={handleEdit} isPending={updateMutation.isPending} />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(order.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders?.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No orders found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

// ─── Order Form ───────────────────────────────────────────────────────────────

const OrderForm = ({ defaults, onSubmit, isPending, onCancel }: { defaults?: any; onSubmit: any; isPending: boolean; onCancel?: () => void }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      {[
        { id: 'order_name', label: 'Order Name', type: 'text', required: true },
        { id: 'price', label: 'Price', type: 'number', required: true },
        { id: 'customer_name', label: 'Customer Name', type: 'text', required: true },
        { id: 'customer_email', label: 'Customer Email', type: 'email', required: true },
        { id: 'category', label: 'Category', type: 'text', required: true },
        { id: 'service', label: 'Service', type: 'text', required: true },
        { id: 'discord_id', label: 'Discord ID', type: 'text', required: false },
      ].map(f => (
        <div key={f.id}>
          <Label htmlFor={f.id}>{f.label}</Label>
          <Input id={f.id} name={f.id} type={f.type} defaultValue={defaults?.[f.id] || ''} required={f.required} />
        </div>
      ))}
      <div>
        <Label>Status</Label>
        <Select name="status" defaultValue={defaults?.status || 'pending'}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" rows={3} defaultValue={defaults?.description || ''} />
    </div>
    <div className="flex justify-end gap-2">
      {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {defaults ? 'Save Changes' : 'Create Order'}
      </Button>
    </div>
  </form>
);

// ─── Users Panel ──────────────────────────────────────────────────────────────

const UsersPanel = ({ toast, queryClient }: { toast: any; queryClient: any }) => {
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users-direct', search],
    queryFn: async () => {
      let q = supabase.from('profiles').select('*, user_roles(role)').order('created_at', { ascending: false });
      if (search) q = q.or(`discord_username.ilike.%${search}%,discord_id.ilike.%${search}%,last_signed_in_ip.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { error } = await supabase.from('user_roles' as any).insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles' as any).delete().eq('user_id', userId).eq('role', role);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-direct'] });
      toast({ title: 'Role updated' });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    moderator: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    vip: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    user: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  return (
    <Card className="glass border-border/10">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View all users and manage their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by username, Discord ID, or IP..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-lg border border-border/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/20">
                  <TableHead>User</TableHead>
                  <TableHead>Discord ID</TableHead>
                  <TableHead>Last IP</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Manage Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u: any) => (
                  <TableRow key={u.id} className="border-border/10 hover:bg-white/[0.02]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.discord_avatar_url} />
                          <AvatarFallback className="text-xs">{u.discord_username?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{u.discord_username || 'Unknown'}</span>
                            {u.user_roles?.some((r: any) => r.role === 'admin') && (
                              <Shield className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}…</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.discord_id || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-muted/30">{u.last_signed_in_ip || '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.user_roles?.length > 0
                          ? u.user_roles.map((r: any, i: number) => (
                            <Badge key={i} variant="outline" className={roleColors[r.role] || ''}>
                              {r.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                              {r.role}
                            </Badge>
                          ))
                          : <span className="text-xs text-muted-foreground">No roles</span>
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Select onValueChange={(role) => {
                        const has = u.user_roles?.some((r: any) => r.role === role);
                        roleMutation.mutate({ userId: u.id, role, action: has ? 'remove' : 'add' });
                      }}>
                        <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Manage role" /></SelectTrigger>
                        <SelectContent>
                          {['admin', 'moderator', 'vip'].map(role => {
                            const has = u.user_roles?.some((r: any) => r.role === role);
                            return (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  {role === 'admin' ? (has ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />) : null}
                                  {has ? 'Remove' : 'Grant'} {role}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {users?.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No users found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
