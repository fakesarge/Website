import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Lock, Unlock, Coins, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GameCard } from "@/components/casino/GameCard";
import { SlotMachine } from "@/components/casino/SlotMachine";
import { Roulette } from "@/components/casino/Roulette";
import { CoinFlip } from "@/components/casino/CoinFlip";

type GameType = "menu" | "slots" | "roulette" | "coinflip";

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

  const handleGamePlay = async (wins: boolean) => {
    setSpinning(true);
    setWonVoucher(null);

    setTimeout(async () => {
      setSpinning(false);

      const identifier = getPlayerIdentifier();
      let voucherCode = null;

      if (wins) {
        voucherCode = generateVoucherCode();
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

      await supabase.from("casino_plays").insert({
        player_identifier: identifier,
        won: wins,
        voucher_code: voucherCode,
      });

      if (!hasVoucher) {
        setCanPlay(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
          backgroundSize: "100% 100%",
        }}
      />

      <Navigation />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            🎰 Lucky Casino 🎰
          </motion.h1>
          <p className="text-xl text-muted-foreground">
            Choose your game and win exclusive vouchers!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Play Status Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <div className={`px-6 py-3 rounded-full border-2 flex items-center gap-3 ${
              hasVoucher 
                ? "bg-green-500/20 border-green-500" 
                : canPlay 
                ? "bg-yellow-500/20 border-yellow-500"
                : "bg-red-500/20 border-red-500"
            }`}>
              {hasVoucher ? (
                <>
                  <Unlock className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">Unlimited plays (Voucher holder)</span>
                </>
              ) : canPlay ? (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">Free play available today!</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-semibold">Come back tomorrow or purchase a voucher!</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Game Menu */}
          <AnimatePresence mode="wait">
            {currentGame === "menu" ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <GameCard
                  title="Slot Machine"
                  description="Match 3 symbols to win big!"
                  icon={Sparkles}
                  gradient="from-purple-500 to-pink-500"
                  onClick={() => setCurrentGame("slots")}
                />
                <GameCard
                  title="Roulette"
                  description="Pick a color and spin the wheel!"
                  icon={Target}
                  gradient="from-red-500 to-yellow-500"
                  onClick={() => setCurrentGame("roulette")}
                />
                <GameCard
                  title="Coin Flip"
                  description="Heads or tails? Make your choice!"
                  icon={Coins}
                  gradient="from-blue-500 to-cyan-500"
                  onClick={() => setCurrentGame("coinflip")}
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentGame}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentGame("menu")}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2" />
                  Back to Games
                </Button>

                {currentGame === "slots" && (
                  <SlotMachine
                    onSpin={handleGamePlay}
                    spinning={spinning}
                    canPlay={canPlay}
                  />
                )}
                {currentGame === "roulette" && (
                  <Roulette
                    onSpin={handleGamePlay}
                    spinning={spinning}
                    canPlay={canPlay}
                  />
                )}
                {currentGame === "coinflip" && (
                  <CoinFlip
                    onFlip={handleGamePlay}
                    flipping={spinning}
                    canPlay={canPlay}
                  />
                )}

                {/* Win Display */}
                <AnimatePresence>
                  {wonVoucher && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-4 border-yellow-500 rounded-xl p-8 text-center backdrop-blur-lg"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                      </motion.div>
                      <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        CONGRATULATIONS!
                      </h3>
                      <p className="text-xl mb-4">You won a $10 voucher!</p>
                      <code className="block bg-background/80 px-6 py-4 rounded-lg font-mono text-2xl font-bold border-2 border-yellow-500">
                        {wonVoucher}
                      </code>
                      <p className="text-sm text-muted-foreground mt-4">
                        💾 Save this code to use on your next purchase!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Info */}
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