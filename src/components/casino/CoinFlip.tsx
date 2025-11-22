import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface CoinFlipProps {
  onFlip: (won: boolean) => Promise<void>;
  flipping: boolean;
  canPlay: boolean;
}

export const CoinFlip = ({ onFlip, flipping, canPlay }: CoinFlipProps) => {
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = async () => {
    if (!canPlay || flipping || !selectedSide) return;

    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? "heads" : "tails";
      setResult(coinResult);
      setIsFlipping(false);
      
      const won = coinResult === selectedSide && Math.random() < 0.35; // 35% win rate
      onFlip(won);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-card/50 backdrop-blur-lg border-2 border-primary/20">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative w-48 h-48 perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipping ? "flipping" : result || "idle"}
                initial={{ rotateY: 0 }}
                animate={
                  isFlipping
                    ? { rotateY: 1080 }
                    : { rotateY: result === "tails" ? 180 : 0 }
                }
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-full h-full preserve-3d"
              >
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 border-8 border-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                    <span className="text-6xl font-bold">👑</span>
                  </div>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-8 border-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <span className="text-6xl font-bold">🎯</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSide("heads")}
              className={`px-8 py-4 rounded-lg font-bold text-lg border-4 transition-all ${
                selectedSide === "heads"
                  ? "border-primary bg-primary/20 scale-110"
                  : "border-muted bg-card"
              }`}
              disabled={flipping}
            >
              👑 HEADS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSide("tails")}
              className={`px-8 py-4 rounded-lg font-bold text-lg border-4 transition-all ${
                selectedSide === "tails"
                  ? "border-primary bg-primary/20 scale-110"
                  : "border-muted bg-card"
              }`}
              disabled={flipping}
            >
              🎯 TAILS
            </motion.button>
          </div>
        </div>

        <Button
          onClick={handleFlip}
          disabled={!canPlay || flipping || !selectedSide}
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-600/90 hover:to-cyan-600/90"
        >
          {flipping ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Coins className="mr-2" />
              </motion.div>
              Flipping...
            </>
          ) : (
            <>
              <Coins className="mr-2" />
              Flip the Coin!
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};
