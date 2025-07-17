import { useState } from "react";
import { Search, ExternalLink, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useOrderTracking, useAffiliateLink, useClaimAffiliate } from "@/hooks/useOrderTracking";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const OrdersPage = () => {
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [claimOrderCode, setClaimOrderCode] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [claimAffiliateCode, setClaimAffiliateCode] = useState("");
  
  // Use the hooks
  const { data: orderData, isLoading: isOrderLoading, refetch: refetchOrder } = useOrderTracking(orderSearchQuery);
  const { data: affiliateData, isLoading: isAffiliateLoading, refetch: refetchAffiliate } = useAffiliateLink(affiliateCode);
  const { data: claimData, isLoading: isClaimLoading, refetch: refetchClaim } = useClaimAffiliate(claimOrderCode, claimAffiliateCode);
  
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
    refetchOrder();
  };

  // Function to generate an affiliate link
  const handleGenerateAffiliateLink = async () => {
    if (!affiliateCode.trim()) {
      toast({
        title: "Affiliate code required",
        description: "Please enter an affiliate code to generate a link.",
        variant: "destructive"
      });
      return;
    }
    refetchAffiliate();
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

  // Function to claim an affiliate reward
  const handleClaimAffiliateReward = () => {
    if (!claimOrderCode.trim() || !claimAffiliateCode.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both the order ID and your affiliate code.",
        variant: "destructive"
      });
      return;
    }
    refetchClaim();
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <section className="container px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">74HRS</span> Orders
          </h1>
          
          <Tabs defaultValue="track" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="track">Track Order</TabsTrigger>
              <TabsTrigger value="affiliate">Affiliate Program</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#1B1B1B] border-white/10">
                  <CardHeader>
                    <CardTitle>Track Your Order</CardTitle>
                    <CardDescription>Enter your order ID to check its status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOrderSearch} className="space-y-4">
                      <div className="flex w-full max-w-md items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Order ID (e.g., ORD-74HRS-12345)"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                        <Button type="submit" disabled={isOrderLoading}>
                          {isOrderLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {orderData && (
                  <Card className="bg-[#1B1B1B] border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{orderData.order_name}</CardTitle>
                          <CardDescription>Order ID: {orderData.order_code}</CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(orderData.status)}>
                          {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Order Details</h4>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm">Category:</div>
                          <div className="text-sm font-medium">{orderData.category}</div>
                          
                          <div className="text-sm">Price:</div>
                          <div className="text-sm font-medium">${orderData.price.toFixed(2)}</div>
                          
                          <div className="text-sm">Order Date:</div>
                          <div className="text-sm font-medium">{new Date(orderData.created_at).toLocaleDateString()}</div>
                          
                          <div className="text-sm">Expected Delivery:</div>
                          <div className="text-sm font-medium">
                            {orderData.delivery_date ? new Date(orderData.delivery_date).toLocaleDateString() : 'To be determined'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Status Timeline</h4>
                        <Separator className="my-2" />
                        <ul className="space-y-2">
                          <li className="text-sm flex items-center space-x-2">
                            <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                            <span>Order received on {new Date(orderData.created_at).toLocaleDateString()}</span>
                          </li>
                          {(orderData.status === "in-progress" || orderData.status === "completed") && (
                            <li className="text-sm flex items-center space-x-2">
                              <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                              <span>Work in progress</span>
                            </li>
                          )}
                          {orderData.status === "completed" && (
                            <li className="text-sm flex items-center space-x-2">
                              <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                              <span>Completed on {orderData.delivery_date ? new Date(orderData.delivery_date).toLocaleDateString() : 'N/A'}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        Questions? Join our <a href="https://discord.gg/VFX" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center">Discord <ExternalLink className="ml-1 h-3 w-3" /></a>
                      </div>
                    </CardFooter>
                  </Card>
                )}
                
                {!orderData && orderSearchQuery && !isOrderLoading && (
                  <Card className="bg-[#1B1B1B] border-white/10">
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
                        <p className="text-muted-foreground">
                          We couldn't find an order with ID: {orderSearchQuery}
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                          Please check the order ID and try again or contact support.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button variant="outline" asChild>
                        <a href="https://discord.gg/VFX" target="_blank" rel="noreferrer">
                          Contact Support <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="affiliate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-[#1B1B1B] border-white/10">
                  <CardHeader>
                    <CardTitle>Generate Affiliate Link</CardTitle>
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
                        className="w-full" 
                        disabled={isAffiliateLoading || !affiliateCode.trim()}
                      >
                        {isAffiliateLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {isAffiliateLoading ? "Generating..." : "Generate Affiliate Link"}
                      </Button>
                      
                      {affiliateData?.link && (
                        <div className="mt-4 space-y-2">
                          <label className="text-sm font-medium">Your Affiliate Link:</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={affiliateData.link}
                              readOnly
                              className="bg-black/40 border-white/20"
                            />
                            <Button onClick={copyToClipboard} size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Share this link with your audience. You'll earn a commission for each order placed through it.
                          </p>
                        </div>
                      )}
                      
                      {!affiliateData && affiliateCode && !isAffiliateLoading && (
                        <div className="mt-4 p-4 bg-black/40 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-400">
                            Affiliate code not found. Please check the code and try again.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1B1B1B] border-white/10">
                  <CardHeader>
                    <CardTitle>Claim Affiliate Rewards</CardTitle>
                    <CardDescription>Verify and claim your affiliate commissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Order ID:</label>
                        <Input
                          type="text"
                          placeholder="Enter the order ID to claim"
                          value={claimOrderCode}
                          onChange={(e) => setClaimOrderCode(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Affiliate Code:</label>
                        <Input
                          type="text"
                          placeholder="Your affiliate code"
                          value={claimAffiliateCode}
                          onChange={(e) => setClaimAffiliateCode(e.target.value)}
                          className="bg-black/40 border-white/20"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleClaimAffiliateReward} 
                        className="w-full"
                        disabled={isClaimLoading || !claimOrderCode || !claimAffiliateCode}
                      >
                        {isClaimLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {isClaimLoading ? "Processing..." : "Verify & Claim Reward"}
                      </Button>
                      
                      {claimData && (
                        <div className={`mt-4 p-4 rounded-lg border ${claimData.success ? 'bg-green-950/20 border-green-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                          <h4 className={`font-medium ${claimData.success ? 'text-green-400' : 'text-red-400'}`}>
                            {claimData.success ? 'Success!' : 'Error'}
                          </h4>
                          <p className="text-sm mt-1">
                            {claimData.message}
                          </p>
                          {claimData.success && claimData.amount && (
                            <p className="text-sm mt-2 font-medium">
                              Commission amount: ${claimData.amount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      <p>Affiliate rates: 10% commission on all orders referred.</p>
                      <p className="mt-1">Payments processed monthly. Minimum payout: $50.</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="mt-8">
                <Card className="bg-[#1B1B1B] border-white/10">
                  <CardHeader>
                    <CardTitle>Affiliate Program Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">How It Works</h3>
                        <p className="text-muted-foreground">Share your unique affiliate link with your audience. When someone makes a purchase using your link, you earn a commission.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg">
                          <h4 className="font-medium">1. Generate</h4>
                          <p className="text-sm text-muted-foreground">Create your unique affiliate link using your code</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg">
                          <h4 className="font-medium">2. Share</h4>
                          <p className="text-sm text-muted-foreground">Promote your link to your audience</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg">
                          <h4 className="font-medium">3. Earn</h4>
                          <p className="text-sm text-muted-foreground">Get 10% commission on all referred orders</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Commission rate is 10% of the order value</li>
                          <li>Minimum payout threshold is $50</li>
                          <li>Payments are processed monthly</li>
                          <li>You must verify your identity before receiving payments</li>
                          <li>Fraudulent activity will result in program termination</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <a href="https://discord.gg/VFX" target="_blank" rel="noreferrer">
                        Join Discord for Support <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;