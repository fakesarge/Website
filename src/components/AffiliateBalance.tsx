import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrderTracking';
import { Search, DollarSign, Users, Link as LinkIcon, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AffiliateBalance = () => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const { data: orders } = useOrders();
  const { toast } = useToast();

  const handleEmailSearch = async () => {
    if (!email.trim()) return;
    
    setIsSearching(true);
    
    // Check if user has any orders
    const userOrders = orders?.filter(order => 
      order.customer_email.toLowerCase() === email.toLowerCase()
    );

    if (userOrders && userOrders.length > 0) {
      // Calculate affiliate stats
      const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);
      const commissionRate = 0.15; // 15% commission
      const totalCommission = totalSpent * commissionRate;
      const referralCount = userOrders.length;

      setAffiliateData({
        email,
        totalSpent,
        totalCommission,
        referralCount,
        isEligible: totalSpent >= 50, // Eligible for affiliate program after $50 spent
        affiliateLink: `${window.location.origin}/?ref=${btoa(email).slice(0, 8)}`
      });
    } else {
      setAffiliateData({
        email,
        totalSpent: 0,
        totalCommission: 0,
        referralCount: 0,
        isEligible: false,
        affiliateLink: null
      });
    }
    
    setIsSearching(false);
  };

  const copyAffiliateLink = () => {
    if (affiliateData?.affiliateLink) {
      navigator.clipboard.writeText(affiliateData.affiliateLink);
      toast({
        title: "Link Copied!",
        description: "Your affiliate link has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Affiliate Balance Checker</h3>
        <p className="text-muted-foreground">
          Enter your email to check your affiliate balance and get your referral link
        </p>
      </div>

      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
        />
        <Button 
          onClick={handleEmailSearch}
          disabled={isSearching || !email.trim()}
          className="shrink-0"
        >
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {affiliateData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Affiliate Status</h4>
                <Badge variant={affiliateData.isEligible ? "default" : "secondary"}>
                  {affiliateData.isEligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 glass rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">${affiliateData.totalCommission.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Commission</div>
                </div>

                <div className="text-center p-4 glass rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{affiliateData.referralCount}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>

                <div className="text-center p-4 glass rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">${affiliateData.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>

              {affiliateData.isEligible && affiliateData.affiliateLink && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-medium">Your Affiliate Link</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={affiliateData.affiliateLink}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button size="icon" onClick={copyAffiliateLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link to earn 15% commission on every sale!
                  </p>
                </div>
              )}

              {!affiliateData.isEligible && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You need to spend at least $50 to become eligible for our affiliate program.
                    <br />
                    Current spending: ${affiliateData.totalSpent.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AffiliateBalance;