import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ExternalLink, Star } from "lucide-react";
import { useCreateAffiliate, useAffiliateLink } from "@/hooks/useOrderTracking";
import { toast } from "sonner";

export const AffiliateCreator = () => {
  const [affiliateName, setAffiliateName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  const createAffiliate = useCreateAffiliate();
  const { data: affiliateData } = useAffiliateLink(referralCode);

  const generateReferralCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(randomCode);
  };

  const handleCreateAffiliate = async () => {
    if (!affiliateName.trim() || !referralCode.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createAffiliate.mutateAsync({
        affiliate_name: affiliateName,
        referral_code: referralCode
      });
      
      const link = `${window.location.origin}?ref=${referralCode}`;
      setGeneratedLink(link);
      toast.success("Affiliate link created successfully!");
    } catch (error) {
      toast.error("Failed to create affiliate link. Code might already exist.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-gradient">Create Affiliate Link</h2>
          <Star className="w-6 h-6 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Generate your custom referral link instantly and start earning commissions
        </p>
      </motion.div>

      {/* Creation Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Generate Your Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Name/Brand
              </label>
              <Input
                placeholder="Enter your name or brand"
                value={affiliateName}
                onChange={(e) => setAffiliateName(e.target.value)}
                className="glass"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Referral Code
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom code or generate one"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="glass"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateReferralCode}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use 4-8 characters (letters and numbers only)
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreateAffiliate}
            disabled={createAffiliate.isPending || !affiliateName.trim() || !referralCode.trim()}
            className="w-full button-gradient"
          >
            {createAffiliate.isPending ? "Creating..." : "Create Affiliate Link"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Link Display */}
      {generatedLink && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Your Affiliate Link is Ready!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                <code className="flex-1 text-sm text-primary break-all">
                  {generatedLink}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✅ Share this link to earn commissions on every sale</p>
                <p>✅ Track your referrals and earnings</p>
                <p>✅ Link is active immediately</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="glass">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">How It Works:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Share your custom affiliate link with potential customers</li>
            <li>2. When someone clicks your link and makes a purchase, you earn a commission</li>
            <li>3. All referrals are tracked automatically</li>
            <li>4. Get paid monthly for all successful referrals</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};