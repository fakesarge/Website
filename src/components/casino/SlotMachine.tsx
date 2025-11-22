import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SYMBOLS = ["💎", "🎰", "🍀", "⭐", "🎲", "🔥", "👑", "🎪"];

interface SlotMachineProps {
  onSpin: (won: boolean) => Promise<void>;
  spinning: boolean;
  canPlay: boolean;
}

export const SlotMachine = ({ onSpin, spinning, canPlay }: SlotMachineProps) => {
  const [slots, setSlots] = useState([0, 0, 0]);
  const [showWin, setShowWin] = useState(false);

  const handleSpin = async () => {
    if (!canPlay || spinning) return;
    
    setShowWin(false);
    
    // Animate slots spinning
    const spinInterval = setInterval(() => {
      setSlots([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
      ]);
    }, 100);

    // Determine outcome
    const wins = Math.random() < 0.25; // 25% win rate
    
    setTimeout(() => {
      clearInterval(spinInterval);
      
      let finalSlots;
      if (wins) {
        const winningSymbol = Math.floor(Math.random() * SYMBOLS.length);
        finalSlots = [winningSymbol, winningSymbol, winningSymbol];
        setShowWin(true);
      } else {
        finalSlots = [
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length),
          Math.floor(Math.random() * SYMBOLS.length),
        ];
        if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
          finalSlots[2] = (finalSlots[2] + 1) % SYMBOLS.length;
        }
      }

      setSlots(finalSlots);
      onSpin(wins);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-card/50 backdrop-blur-lg border-2 border-primary/20">
        <div className="flex justify-center gap-4 mb-8">
          {slots.map((slot, index) => (
            <motion.div
              key={index}
              animate={spinning ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 0.2, repeat: spinning ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-background to-muted rounded-xl flex items-center justify-center text-6xl border-4 border-primary/50 shadow-lg shadow-primary/20">
                {SYMBOLS[slot]}
              </div>
              <AnimatePresence>
                {showWin && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl border-4 border-yellow-500"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleSpin}
          disabled={!canPlay || spinning}
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
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
      </Card>
    </div>
  );
};
