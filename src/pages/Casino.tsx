import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SYMBOLS = ["💎", "🎰", "🍀", "⭐", "🎲"];
const WIN_CHANCE = 0.25; // 25% base win rate (rigged lower)

const Casino = () => {
  const [slots, setSlots] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [hasVoucher, setHasVoucher] = useState(false);
  const [wonVoucher, setWonVoucher] = useState<string | null>(null);
  const { toast } = useToast();

  const getPlayerIdentifier = () => {
    let identifier = localStorage.getItem("casino_player_id");
    if (!identifier) {
      identifier = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("casino_player_id", identifier);
    }
    return identifier;
  };

  const checkCanPlay = async () => {
    const identifier = getPlayerIdentifier();
    const today = new Date().toISOString().split("T")[0];
    
    // Check if player has played today
    const { data: plays } = await supabase
      .from("casino_plays")
      .select("*")
      .eq("player_identifier", identifier)
      .gte("played_at", `${today}T00:00:00`)
      .lte("played_at", `${today}T23:59:59`);

    // Check if player has purchased a voucher
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", identifier)
      .eq("category", "voucher");

    const hasPurchasedVoucher = orders && orders.length > 0;
    setHasVoucher(hasPurchasedVoucher);

    // If has voucher, can always play. Otherwise, once per day
    if (hasPurchasedVoucher) {
      setCanPlay(true);
    } else {
      setCanPlay(!plays || plays.length === 0);
    }
  };

  useEffect(() => {
    checkCanPlay();
  }, []);

  const generateVoucherCode = () => {
    return `LUCKY${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  };

  const spin = async () => {
    if (!canPlay || spinning) return;

    setSpinning(true);
    setWonVoucher(null);

    // Animate slots spinning
    const spinInterval = setInterval(() => {
      setSlots([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
      ]);
    }, 100);

    // Determine if player wins (rigged)
    const wins = Math.random() < WIN_CHANCE;
    
    setTimeout(async () => {
      clearInterval(spinInterval);
      
      let finalSlots;
      if (wins) {
        // All same symbol = WIN
        const winningSymbol = Math.floor(Math.random() * SYMBOLS.length);
        finalSlots = [winningSymbol, winningSymbol, winningSymbol];
      } else {
        // Random non-matching symbols = LOSE
        finalSlots = [
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length),
        ];
        // Make sure they don't accidentally match
        if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
          finalSlots[2] = (finalSlots[2] + 1) % SYMBOLS.length;
        }
      }

      setSlots(finalSlots);
      setSpinning(false);

      // Record play
      const identifier = getPlayerIdentifier();
      let voucherCode = null;

      if (wins) {
        voucherCode = generateVoucherCode();
        // Save voucher to database
        await supabase.from("voucher_codes").insert({
          code: voucherCode,
          discount_amount: 10,
        });
        setWonVoucher(voucherCode);
        toast({
          title: "🎉 JACKPOT! 🎉",
          description: `You won a $10 voucher! Code: ${voucherCode}`,
          duration: 10000,
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: "Try again tomorrow or purchase a voucher for unlimited plays!",
        });
      }

      // Record the play
      await supabase.from("casino_plays").insert({
        player_identifier: identifier,
        won: wins,
        voucher_code: voucherCode,
      });

      // Update can play status
      if (!hasVoucher) {
        setCanPlay(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Lucky Casino
          </h1>
          <p className="text-xl text-muted-foreground">
            Spin to win exclusive vouchers!
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-2">
            <div className="mb-8">
              <div className="flex justify-center gap-4 mb-8">
                {slots.map((slot, index) => (
                  <motion.div
                    key={index}
                    animate={spinning ? { y: [0, -10, 0] } : {}}
                    transition={{ duration: 0.2, repeat: spinning ? Infinity : 0 }}
                    className="w-24 h-24 bg-background rounded-lg flex items-center justify-center text-5xl border-2 border-primary"
                  >
                    {SYMBOLS[slot]}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                {hasVoucher ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <Unlock className="w-5 h-5" />
                    <span>Unlimited plays (Voucher holder)</span>
                  </div>
                ) : canPlay ? (
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Sparkles className="w-5 h-5" />
                    <span>Free play available today!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <Lock className="w-5 h-5" />
                    <span>Come back tomorrow or purchase a voucher!</span>
                  </div>
                )}
              </div>

              <Button
                onClick={spin}
                disabled={!canPlay || spinning}
                size="lg"
                className="w-full"
              >
                {spinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      🎰
                    </motion.div>
                    Spinning...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Spin the Slots!
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {wonVoucher && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-lg p-6 text-center"
                >
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                  <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                  <p className="text-lg mb-3">Your voucher code:</p>
                  <code className="block bg-background px-4 py-2 rounded font-mono text-xl font-bold">
                    {wonVoucher}
                  </code>
                  <p className="text-sm text-muted-foreground mt-3">
                    Save this code to use on your next purchase!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">🎰 Match 3 symbols to win!</p>
              <p>Free users: 1 play per day</p>
              <p>Voucher holders: Unlimited plays</p>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Casino;