import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Package, Clock, MessageSquare, Image, Send, Eye, X, Info } from 'lucide-react';
import { sendActivityWebhook } from '@/utils/activityWebhook';

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

interface CustomerDashboardProps {
  profile: any;
  user: any;
  onSignOut: () => void;
}

const CustomerDashboard = ({ profile, user, onSignOut }: CustomerDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const discordId = profile?.discord_id;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders', discordId],
    queryFn: async () => {
      if (!discordId) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('discord_id', discordId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!discordId,
  });

  const activeCount = orders?.filter(o => o.status === 'pending' || o.status === 'in_progress').length || 0;

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-border/20">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {profile?.username || 'User'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {orders?.length || 0} orders • {activeCount} active
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: 'Total Orders', value: orders?.length ?? '—' },
          { icon: Clock, label: 'Active', value: activeCount },
          { icon: Package, label: 'Completed', value: orders?.filter(o => o.status === 'completed').length ?? '—' },
        ].map((item, i) => (
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

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <Card className="glass border-border/10">
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : orders && orders.length > 0 ? (
              <div className="rounded-lg border border-border/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/20">
                      <TableHead>Order Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id} className="border-border/10 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <TableCell>
                          <div className="text-sm font-medium">{order.order_name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{order.order_code}</div>
                        </TableCell>
                        <TableCell className="text-sm">{order.service}</TableCell>
                        <TableCell className="font-medium">${Number(order.price).toFixed(2)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(order.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-lg font-medium">No orders yet</p>
                <p className="text-sm">Your orders will appear here once placed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          {selectedOrder && (
            <CustomerOrderDetail
              order={selectedOrder}
              profile={profile}
              toast={toast}
              queryClient={queryClient}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Customer Order Detail ───────────────────────────────────────────────────

const CustomerOrderDetail = ({ order, profile, toast, queryClient, onClose }: { order: any; profile: any; toast: any; queryClient: any; onClose: () => void }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

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
        sender_name: profile?.discord_username || 'Customer',
        sender_avatar_url: profile?.discord_avatar_url,
        message: text,
        is_admin: false,
      });
      if (error) throw error;
    },
    onSuccess: (_, text) => {
      queryClient.invalidateQueries({ queryKey: ['order-messages', order.id] });
      setMessage('');
      // Send customer message webhook
      sendActivityWebhook('customer_message', {
        sender_name: profile?.discord_username || 'Customer',
        order_name: order.order_name,
        message: text,
        dashboard_url: 'https://74hrs.store/dashboard',
      });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage.from('order-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="flex flex-col h-[80vh]">
      {/* Header */}
      <div className="p-4 border-b border-border/20 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{order.order_name}</h2>
              <Badge variant="outline" className="font-mono text-xs">{order.order_code}</Badge>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {order.service} • ${Number(order.price).toFixed(2)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/20">
        <div className="flex">
          {[
            { key: 'chat', icon: MessageSquare, label: 'Chat', count: messages?.length },
            { key: 'images', icon: Image, label: 'Updates & Images', count: images?.length },
            { key: 'info', icon: Info, label: 'Order Info', count: undefined },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count && tab.count > 0 && <Badge variant="secondary" className="text-xs">{tab.count}</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.is_admin ? '' : 'flex-row-reverse'}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={msg.sender_avatar_url} />
                        <AvatarFallback className="text-xs">{msg.sender_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${msg.is_admin ? '' : 'text-right'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {msg.is_admin ? 'Studio' : msg.sender_name}
                          </span>
                          {msg.is_admin && <Badge variant="outline" className="text-[10px] px-1">Studio</Badge>}
                          <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={`rounded-lg px-3 py-2 text-sm ${
                          msg.is_admin ? 'bg-muted' : 'bg-primary text-primary-foreground'
                        }`}>
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
                  <p className="text-xs">Send a message to the studio</p>
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
        ) : activeTab === 'images' ? (
          <div className="p-4 h-full overflow-auto">
            {imagesLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : images && images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img: any) => (
                  <div key={img.id} className="group relative rounded-lg overflow-hidden border border-border/20 bg-secondary/30 cursor-pointer" onClick={() => window.open(getImageUrl(img.file_path), '_blank')}>
                    <img src={getImageUrl(img.file_path)} alt={img.file_name} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
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
                <p className="text-sm">No updates yet</p>
                <p className="text-xs">Progress images will appear here</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4 overflow-auto">
            {[
              { label: 'Order Name', value: order.order_name },
              { label: 'Order Code', value: order.order_code },
              { label: 'Service', value: order.service },
              { label: 'Category', value: order.category },
              { label: 'Price', value: `$${Number(order.price).toFixed(2)}` },
              { label: 'Status', value: order.status.replace('_', ' ') },
              { label: 'Created', value: new Date(order.created_at).toLocaleDateString() },
              { label: 'Last Updated', value: new Date(order.updated_at).toLocaleDateString() },
              { label: 'Description', value: order.description || 'No description' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-start py-2 border-b border-border/10 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-right max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
