import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

const COLORS = ["red", "black", "green"] as const;
const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36

interface RouletteProps {
  onSpin: (won: boolean) => Promise<void>;
  spinning: boolean;
  canPlay: boolean;
}

export const Roulette = ({ onSpin, spinning, canPlay }: RouletteProps) => {
  const [selectedColor, setSelectedColor] = useState<typeof COLORS[number] | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const getNumberColor = (num: number): typeof COLORS[number] => {
    if (num === 0) return "green";
    return num % 2 === 0 ? "red" : "black";
  };

  const handleSpin = async () => {
    if (!canPlay || spinning || !selectedColor) return;

    const finalNumber = Math.floor(Math.random() * NUMBERS.length);
    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + (spins * 360) + (finalNumber * (360 / 37));
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setResult(finalNumber);
      const resultColor = getNumberColor(finalNumber);
      const won = resultColor === selectedColor && Math.random() < 0.3; // 30% win rate if color matches
      onSpin(won);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-card/50 backdrop-blur-lg border-2 border-primary/20">
        <div className="flex flex-col items-center gap-6 mb-8">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="relative w-64 h-64 rounded-full border-8 border-yellow-600 shadow-2xl shadow-primary/30"
            style={{
              background: "conic-gradient(from 0deg, #ef4444 0deg 120deg, #000000 120deg 240deg, #22c55e 240deg 360deg)"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-background rounded-full border-4 border-yellow-600 flex items-center justify-center text-2xl font-bold">
                {result !== null ? result : "?"}
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-600" />
          </motion.div>

          <div className="flex gap-4">
            {COLORS.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color)}
                className={`w-24 h-24 rounded-lg font-bold text-lg border-4 transition-all ${
                  selectedColor === color
                    ? "border-primary scale-110"
                    : "border-muted"
                } ${
                  color === "red"
                    ? "bg-red-600"
                    : color === "black"
                    ? "bg-black"
                    : "bg-green-600"
                }`}
                disabled={spinning}
              >
                {color.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSpin}
          disabled={!canPlay || spinning || !selectedColor}
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-600/90 hover:to-orange-600/90"
        >
          {spinning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Target className="mr-2" />
              </motion.div>
              Spinning...
            </>
          ) : (
            <>
              <Target className="mr-2" />
              Spin the Wheel!
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};
