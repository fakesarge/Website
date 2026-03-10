import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search, Shield, ShieldOff, LogOut, Package, DollarSign, Clock, Users, MessageSquare, Image, Send, Upload, X, Eye } from 'lucide-react';
import { sendActivityWebhook } from '@/utils/activityWebhook';
import { Loader2, Plus, Pencil, Trash2, Search, Shield, ShieldOff, LogOut, Package, DollarSign, Clock, Users, MessageSquare, Image, Send, Upload, X, Eye } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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

interface AdminDashboardProps {
  profile: any;
  onSignOut: () => void;
}

const AdminDashboard = ({ profile, onSignOut }: AdminDashboardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
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
            Welcome back, {profile?.discord_username}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-border/20">
            <AvatarImage src={profile?.discord_avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {profile?.discord_username?.[0]?.toUpperCase() || 'O'}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-2 text-muted-foreground">
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
            <OrdersPanel toast={toast} queryClient={queryClient} profile={profile} />
          </TabsContent>
          <TabsContent value="users">
            <UsersPanel toast={toast} queryClient={queryClient} />
          </TabsContent>
        </Tabs>
      </motion.div>
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

const OrdersPanel = ({ toast, queryClient, profile }: { toast: any; queryClient: any; profile: any }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-direct'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Order updated' });
      setEditingOrder(null);
      // Send webhook if status changed
      if (editingOrder && variables.status !== editingOrder.status) {
        sendActivityWebhook('order_progress_updated', {
          order_name: variables.order_name || editingOrder.order_name,
          customer_name: variables.customer_name || editingOrder.customer_name,
          new_status: variables.status,
        });
      }
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders-direct'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Order created' });
      setCreateOpen(false);
      // Send webhook
      sendActivityWebhook('order_created', {
        customer_name: variables.customer_name,
        order_name: variables.order_name,
        service: variables.service,
        price: variables.price,
      });
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
    <>
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
                    <TableRow key={order.id} className="border-border/10 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedOrder(order)}>
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
                        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
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

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {selectedOrder && (
            <OrderDetailPanel 
              order={selectedOrder} 
              profile={profile}
              toast={toast}
              queryClient={queryClient}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── Order Detail Panel with Chat & Images ────────────────────────────────────

const OrderDetailPanel = ({ order, profile, toast, queryClient, onClose }: { order: any; profile: any; toast: any; queryClient: any; onClose: () => void }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['order-messages', order.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['order-images', order.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_images')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase.from('order_messages').insert({
        order_id: order.id,
        sender_name: profile?.discord_username || 'Admin',
        sender_avatar_url: profile?.discord_avatar_url,
        message: text,
        is_admin: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-messages', order.id] });
      setMessage('');
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (image: any) => {
      const { error: storageError } = await supabase.storage
        .from('order-images')
        .remove([image.file_path]);
      if (storageError) console.warn('Storage delete error:', storageError);
      const { error } = await supabase.from('order_images').delete().eq('id', image.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-images', order.id] });
      toast({ title: 'Image deleted' });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${order.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        const { error: dbError } = await supabase.from('order_images').insert({
          order_id: order.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
        });
        if (dbError) throw dbError;
      }
      queryClient.invalidateQueries({ queryKey: ['order-images', order.id] });
      toast({ title: 'Images uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage.from('order-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="p-4 border-b border-border/20 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{order.order_name}</h2>
              <Badge variant="outline" className="font-mono text-xs">{order.order_code}</Badge>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {order.customer_name} • {order.service} • ${Number(order.price).toFixed(2)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-border/20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
            {messages && messages.length > 0 && <Badge variant="secondary" className="text-xs">{messages.length}</Badge>}
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'images' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Image className="w-4 h-4" />
            Images
            {images && images.length > 0 && <Badge variant="secondary" className="text-xs">{images.length}</Badge>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.is_admin ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={msg.sender_avatar_url} />
                        <AvatarFallback className="text-xs">{msg.sender_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${msg.is_admin ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{msg.sender_name}</span>
                          {msg.is_admin && <Badge variant="outline" className="text-[10px] px-1">Admin</Badge>}
                          <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={`rounded-lg px-3 py-2 text-sm ${msg.is_admin ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start a conversation about this order</p>
                </div>
              )}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/20 bg-secondary/20">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" />
                <Button type="submit" size="sm" disabled={sendMessageMutation.isPending || !message.trim()}>
                  {sendMessageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 h-full overflow-auto">
            <div className="mb-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Images
              </Button>
            </div>
            {imagesLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : images && images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img: any) => (
                  <div key={img.id} className="group relative rounded-lg overflow-hidden border border-border/20 bg-secondary/30">
                    <img src={getImageUrl(img.file_path)} alt={img.file_name} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => window.open(getImageUrl(img.file_path), '_blank')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteImageMutation.mutate(img)} disabled={deleteImageMutation.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate">{img.file_name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(img.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Image className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No images yet</p>
                <p className="text-xs">Upload images related to this order</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
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

export default AdminDashboard;
