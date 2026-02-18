import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Lock, Unlock, Coins, Target, ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import { GameCard } from "@/components/casino/GameCard";
import { SlotMachine } from "@/components/casino/SlotMachine";
import { Roulette } from "@/components/casino/Roulette";
import { CoinFlip } from "@/components/casino/CoinFlip";

type GameType = "menu" | "slots" | "roulette" | "coinflip";

const MAINTENANCE_MODE = true;
const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const Casino = () => {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");
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
    const { data: plays } = await supabase
      .from("casino_plays")
      .select("*")
      .eq("player_identifier", identifier)
      .gte("played_at", `${today}T00:00:00`)
      .lte("played_at", `${today}T23:59:59`);
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", identifier)
      .eq("category", "voucher");
    const hasPurchasedVoucher = orders && orders.length > 0;
    setHasVoucher(hasPurchasedVoucher);
    if (hasPurchasedVoucher) {
      setCanPlay(true);
    } else {
      setCanPlay(!plays || plays.length === 0);
    }
  };

  useEffect(() => { checkCanPlay(); }, []);

  const generateVoucherCode = () => `LUCKY${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const handleGamePlay = async (wins: boolean) => {
    setSpinning(true);
    setWonVoucher(null);
    setTimeout(async () => {
      setSpinning(false);
      const identifier = getPlayerIdentifier();
      let voucherCode = null;
      if (wins) {
        voucherCode = generateVoucherCode();
        await supabase.from("voucher_codes").insert({ code: voucherCode, discount_amount: 10 });
        setWonVoucher(voucherCode);
        toast({ title: "🎉 JACKPOT! 🎉", description: `You won a $10 voucher! Code: ${voucherCode}`, duration: 10000 });
      } else {
        toast({ title: "Better luck next time!", description: "Try again tomorrow or purchase a voucher for unlimited plays!" });
      }
      await supabase.from("casino_plays").insert({ player_identifier: identifier, won: wins, voucher_code: voucherCode });
      if (!hasVoucher) setCanPlay(false);
    }, 100);
  };

  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <AmbientBackground />
        <Navigation />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wrench className="w-24 h-24 mx-auto mb-6 text-primary" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
              Under Maintenance
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're currently upgrading our casino for an even better experience. Check back soon!
            </p>
            <Button size="lg" onClick={() => window.location.href = '/'} className="button-gradient">
              Back to Home
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AmbientBackground />
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
          className="text-center mb-12"
        >
          <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
            🎰 Lucky Casino 🎰
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your game and win exclusive vouchers!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: premiumEase }}
            className="mb-8 flex justify-center"
          >
            <div className={`px-6 py-3 rounded-full glass flex items-center gap-3 ${
              hasVoucher ? "border-primary/30" : canPlay ? "border-primary/20" : "border-destructive/20"
            }`}>
              {hasVoucher ? (
                <><Unlock className="w-5 h-5 text-primary" /><span className="text-primary font-semibold">Unlimited plays (Voucher holder)</span></>
              ) : canPlay ? (
                <><Sparkles className="w-5 h-5 text-primary" /><span className="text-primary font-semibold">Free play available today!</span></>
              ) : (
                <><Lock className="w-5 h-5 text-destructive" /><span className="text-destructive font-semibold">Come back tomorrow or purchase a voucher!</span></>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentGame === "menu" ? (
              <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: premiumEase }} className="grid md:grid-cols-3 gap-6">
                <GameCard title="Slot Machine" description="Match 3 symbols to win big!" icon={Sparkles} gradient="from-primary/20 to-primary/5" onClick={() => setCurrentGame("slots")} />
                <GameCard title="Roulette" description="Pick a color and spin the wheel!" icon={Target} gradient="from-primary/15 to-primary/5" onClick={() => setCurrentGame("roulette")} />
                <GameCard title="Coin Flip" description="Heads or tails? Make your choice!" icon={Coins} gradient="from-primary/10 to-primary/5" onClick={() => setCurrentGame("coinflip")} />
              </motion.div>
            ) : (
              <motion.div key={currentGame} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: premiumEase }} className="space-y-6">
                <Button variant="outline" onClick={() => setCurrentGame("menu")} className="mb-4">
                  <ArrowLeft className="mr-2" /> Back to Games
                </Button>
                {currentGame === "slots" && <SlotMachine onSpin={handleGamePlay} spinning={spinning} canPlay={canPlay} />}
                {currentGame === "roulette" && <Roulette onSpin={handleGamePlay} spinning={spinning} canPlay={canPlay} />}
                {currentGame === "coinflip" && <CoinFlip onFlip={handleGamePlay} flipping={spinning} canPlay={canPlay} />}

                <AnimatePresence>
                  {wonVoucher && (
                    <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.5, ease: premiumEase }}
                      className="glass border-primary/30 rounded-xl p-8 text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                      <h3 className="text-3xl font-bold mb-3 text-gradient">CONGRATULATIONS!</h3>
                      <p className="text-xl mb-4">You won a $10 voucher!</p>
                      <code className="block bg-background/80 px-6 py-4 rounded-lg font-mono text-2xl font-bold border border-primary/30">{wonVoucher}</code>
                      <p className="text-sm text-muted-foreground mt-4">💾 Save this code to use on your next purchase!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center text-sm text-muted-foreground space-y-1 pt-4">
                  <p>🎮 Play daily for a chance to win!</p>
                  <p>Free users: 1 play per day | Voucher holders: Unlimited plays</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Casino;
