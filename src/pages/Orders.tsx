import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, MessageSquare, Image, Send, Upload, Loader2, Eye, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOrders, useRealtimeOrders } from '@/hooks/useOrderTracking';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { data: orders, isLoading } = useOrders();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useRealtimeOrders();

  // Get current user profile for chat
  const { data: authData } = useQuery({
    queryKey: ['orders-auth'],
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

  // If an order is selected, show the detail view
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        </div>
        <main className="pt-20 pb-20">
          <section className="container px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="gap-2 mb-6 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
              </Button>
              <CustomerOrderDetail
                order={selectedOrder}
                profile={authData?.profile}
                toast={toast}
                queryClient={queryClient}
              />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="pt-20 pb-20">
        <section className="container px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Order <span className="text-gradient">Tracking</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Track your orders in real-time and manage your account.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="glass border-border/10">
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

        <section className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {searchTerm && filteredOrders.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                <div className="grid gap-6">
                  {filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="glass border-border/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{order.order_name}</h3>
                            <p className="text-muted-foreground font-mono text-sm">{order.order_code}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} />
                            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </Button>
                          </div>
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
                          <div className="mt-4 pt-4 border-t border-border/10">
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
              <Card className="glass border-border/10 text-center">
                <CardContent className="py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground">No orders match your search criteria: "{searchTerm}"</p>
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

// ─── Customer Order Detail (chat + images view) ──────────────────────────────

const CustomerOrderDetail = ({ order, profile, toast, queryClient }: { order: any; profile: any; toast: any; queryClient: any }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'images'>('details');

  // Check if user is logged in and is the order owner (by discord_id)
  const isOrderOwner = profile?.discord_id && profile.discord_id === order.discord_id;

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['customer-order-messages', order.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: isOrderOwner,
  });

  // Fetch images
  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ['customer-order-images', order.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_images')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isOrderOwner,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase.from('order_messages').insert({
        order_id: order.id,
        sender_name: profile?.username || order.customer_name || 'Customer',
        sender_avatar_url: profile?.avatar_url,
        message: text,
        is_admin: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-order-messages', order.id] });
      setMessage('');
    },
    onError: (e: any) => toast({ title: 'Error sending message', description: e.message, variant: 'destructive' }),
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Order Header */}
      <Card className="glass border-border/10 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{order.order_name}</h2>
              <p className="font-mono text-sm text-muted-foreground">{order.order_code}</p>
            </div>
            <StatusBadge status={order.status} />
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
              <p className="font-medium">${Number(order.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{order.category}</p>
            </div>
          </div>
          {order.description && (
            <div className="mt-4 pt-4 border-t border-border/10">
              <p className="text-sm text-muted-foreground">{order.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Chat & Images — only if user is logged in and owns order */}
      {isOrderOwner ? (
        <Card className="glass border-border/10">
          <div className="border-b border-border/20">
            <div className="flex">
              {[
                { key: 'chat' as const, icon: MessageSquare, label: 'Chat', count: messages?.length },
                { key: 'images' as const, icon: Image, label: 'Updates & Images', count: images?.length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <Badge variant="secondary" className="text-xs">{tab.count}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'chat' ? (
            <div className="flex flex-col" style={{ height: '500px' }}>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
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
                            <span className="text-xs font-medium">{msg.sender_name}</span>
                            {msg.is_admin && <Badge variant="outline" className="text-[10px] px-1">Studio</Badge>}
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className={`rounded-lg px-3 py-2 text-sm ${
                            msg.is_admin
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
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
                    <p className="text-xs">Send a message to the studio about your order</p>
                  </div>
                )}
              </ScrollArea>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border/20 bg-secondary/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={sendMessageMutation.isPending || !message.trim()}>
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-4">
              {imagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : images && images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="group relative rounded-lg overflow-hidden border border-border/20 bg-secondary/30">
                      <img
                        src={getImageUrl(img.file_path)}
                        alt={img.file_name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(getImageUrl(img.file_path), '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View Full
                        </Button>
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">{img.file_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(img.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Image className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No images yet</p>
                  <p className="text-xs">The studio will upload progress images here</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card className="glass border-border/10">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium mb-1">Sign in to view chat & images</p>
            <p className="text-xs text-muted-foreground">
              Log in with your Discord account to access order chat and view progress images uploaded by the studio.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OrdersPage;
