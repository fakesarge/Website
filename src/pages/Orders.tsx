import { useState, useEffect } from "react";
import { Search, ExternalLink, Copy, Loader2, Webhook, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useOrders, useRealtimeOrders, useAffiliateLink, useWebhookManagement } from "@/hooks/useOrderTracking";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const OrdersPage = () => {
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // Real-time orders
  const { data: orders, isLoading: isOrdersLoading } = useOrders();
  const { data: affiliateData, isLoading: isAffiliateLoading } = useAffiliateLink(affiliateCode);
  const { addWebhook, getWebhooks } = useWebhookManagement();
  
  // Set up real-time subscription
  useEffect(() => {
    const cleanup = useRealtimeOrders();
    return cleanup;
  }, []);

  // Filter orders based on search
  const filteredOrders = orders?.filter(order => 
    order.order_code?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.order_name?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.id?.toLowerCase().includes(orderSearchQuery.toLowerCase())
  ) || [];

  const foundOrder = orderSearchQuery ? filteredOrders[0] : null;

  // Function to handle order tracking search
  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderSearchQuery.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter an order ID to track.",
        variant: "destructive"
      });
      return;
    }
  };

  // Function to generate an affiliate link
  const handleGenerateAffiliateLink = () => {
    if (!affiliateCode.trim()) {
      toast({
        title: "Affiliate code required",
        description: "Please enter an affiliate code to generate a link.",
        variant: "destructive"
      });
      return;
    }
  };

  // Function to copy the affiliate link to clipboard
  const copyToClipboard = () => {
    if (affiliateData?.link) {
      navigator.clipboard.writeText(affiliateData.link);
      toast({
        title: "Copied to clipboard",
        description: "Your affiliate link has been copied to your clipboard.",
      });
    }
  };

  // Function to add webhook
  const handleAddWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Webhook URL required",
        description: "Please enter a Discord webhook URL.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addWebhook.mutateAsync(webhookUrl);
      setWebhookUrl("");
      toast({
        title: "Webhook added",
        description: "Discord webhook has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add webhook.",
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
      
      <main className="pt-20 pb-20">
        <section className="container px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              <span className="text-gradient">74HRS</span> Orders
            </h1>
            
            <Tabs defaultValue="track" className="w-full">
              <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8 glass">
                <TabsTrigger value="track">Track Order</TabsTrigger>
                <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
                <TabsTrigger value="webhook">Webhooks</TabsTrigger>
              </TabsList>
            
            <TabsContent value="track">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="glass border-white/10 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Track Your Order
                    </CardTitle>
                    <CardDescription>Enter your order ID to check its status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOrderSearch} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Order ID or Order Code"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                        <Button type="submit" className="w-full button-gradient" disabled={isOrdersLoading}>
                          {isOrdersLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                          Track Order
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {foundOrder && (
                  <Card className="glass border-primary/20 lg:col-span-2 animate-scale-in">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{foundOrder.order_name}</CardTitle>
                          <CardDescription>Order: {foundOrder.order_code || foundOrder.id}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(foundOrder.status)} className="text-sm">
                          {foundOrder.status.charAt(0).toUpperCase() + foundOrder.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                          <p className="text-sm font-medium">{foundOrder.category}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                          <p className="text-sm font-medium">${foundOrder.price}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Order Date</h4>
                          <p className="text-sm font-medium">{new Date(foundOrder.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Delivery</h4>
                          <p className="text-sm font-medium">
                            {foundOrder.delivery_date ? new Date(foundOrder.delivery_date).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Status Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span className="text-sm">Order received - {new Date(foundOrder.created_at).toLocaleDateString()}</span>
                          </div>
                          {(foundOrder.status === "in-progress" || foundOrder.status === "completed") && (
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                              <span className="text-sm">Work in progress</span>
                            </div>
                          )}
                          {foundOrder.status === "completed" && (
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                              <span className="text-sm">Completed - {foundOrder.delivery_date ? new Date(foundOrder.delivery_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Questions? Join our <a href="https://discord.gg/VFX" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">Discord <ExternalLink className="ml-1 h-3 w-3" /></a>
                      </p>
                    </CardFooter>
                  </Card>
                )}
                
                {!foundOrder && orderSearchQuery && !isOrdersLoading && (
                  <Card className="glass border-red-500/20 lg:col-span-2">
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
                        <p className="text-muted-foreground">
                          We couldn't find an order with ID: {orderSearchQuery}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* All Orders Table */}
              <div className="mt-12">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      All Recent Orders
                    </CardTitle>
                    <CardDescription>Real-time order updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {orders?.slice(0, 10).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-white/10 hover:border-primary/30 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium">{order.order_name}</p>
                            <p className="text-sm text-muted-foreground">{order.order_code || order.id}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">${order.price}</p>
                              <p className="text-sm text-muted-foreground">{order.category}</p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="affiliate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Copy className="h-5 w-5" />
                      Generate Affiliate Link
                    </CardTitle>
                    <CardDescription>Create your custom affiliate link to earn commissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Affiliate Code:</label>
                        <Input
                          type="text"
                          placeholder="Enter your affiliate code"
                          value={affiliateCode}
                          onChange={(e) => setAffiliateCode(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleGenerateAffiliateLink} 
                        className="w-full button-gradient" 
                        disabled={isAffiliateLoading || !affiliateCode.trim()}
                      >
                        {isAffiliateLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Copy className="h-4 w-4 mr-2" />}
                        {isAffiliateLoading ? "Generating..." : "Generate Affiliate Link"}
                      </Button>
                      
                      {affiliateData?.link && (
                        <div className="mt-4 space-y-2 animate-fade-in">
                          <label className="text-sm font-medium">Your Affiliate Link:</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={affiliateData.link}
                              readOnly
                              className="bg-black/40 border-white/20"
                            />
                            <Button onClick={copyToClipboard} size="icon" className="button-gradient">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Share this link with your audience. You'll earn a commission for each order placed through it.
                          </p>
                        </div>
                      )}
                      
                      {!affiliateData && affiliateCode && !isAffiliateLoading && (
                        <div className="mt-4 p-4 bg-red-950/20 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-400">
                            Affiliate code not found. Please check the code and try again.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle>Affiliate Program Info</CardTitle>
                    <CardDescription>How our affiliate program works</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <h4 className="font-medium text-primary">💰 10% Commission</h4>
                        <p className="text-sm text-muted-foreground">Earn 10% on every order placed through your link</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <h4 className="font-medium">📊 Real-time Tracking</h4>
                        <p className="text-sm text-muted-foreground">Track your referrals and earnings in real-time</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <h4 className="font-medium">💳 Monthly Payouts</h4>
                        <p className="text-sm text-muted-foreground">Minimum payout: $50</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="webhook">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Webhook className="h-5 w-5" />
                      Discord Webhook Setup
                    </CardTitle>
                    <CardDescription>Get real-time order notifications in Discord</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Discord Webhook URL:</label>
                        <Input
                          type="text"
                          placeholder="https://discord.com/api/webhooks/..."
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAddWebhook} 
                        className="w-full button-gradient" 
                        disabled={addWebhook.isPending || !webhookUrl.trim()}
                      >
                        {addWebhook.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        {addWebhook.isPending ? "Adding..." : "Add Webhook"}
                      </Button>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>📋 How to get a Discord webhook URL:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Go to your Discord server settings</li>
                          <li>Navigate to Integrations → Webhooks</li>
                          <li>Create a new webhook</li>
                          <li>Copy the webhook URL</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle>Active Webhooks</CardTitle>
                    <CardDescription>Manage your Discord webhooks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getWebhooks.data?.map((webhook) => (
                        <div key={webhook.id} className="p-3 rounded-lg bg-background/50 border border-white/10">
                          <p className="text-sm font-mono">{webhook.webhook_url.slice(0, 50)}...</p>
                          <p className="text-xs text-muted-foreground">Added {new Date(webhook.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Card className="glass border-white/10">
                  <CardHeader>
                    <CardTitle>Webhook Information</CardTitle>
                    <CardDescription>Real-time Discord notifications for all order events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-green-950/20 border border-green-500/30">
                          <h4 className="font-medium text-green-400">🆕 New Orders</h4>
                          <p className="text-sm text-muted-foreground">Get notified when new orders are created</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/30">
                          <h4 className="font-medium text-blue-400">📝 Order Updates</h4>
                          <p className="text-sm text-muted-foreground">Status changes and progress updates</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30">
                          <h4 className="font-medium text-red-400">🗑️ Order Deletions</h4>
                          <p className="text-sm text-muted-foreground">When orders are removed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;