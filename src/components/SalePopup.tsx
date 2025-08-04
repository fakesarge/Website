import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SalePopupProps {
  isEnabled?: boolean;
  headline?: string;
  subtext?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

const SalePopup = ({ 
  isEnabled = true,
  headline = "🔥 LIMITED TIME OFFER",
  subtext = "Get 30% OFF all VFX packages this week only! Transform your FiveM server with premium graphics.",
  ctaText = "Claim Discount",
  ctaAction
}: SalePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const hasSeenPopup = sessionStorage.getItem('salePopupSeen');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isEnabled]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('salePopupSeen', 'true');
  };

  const handleCTA = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      window.open('https://discord.gg/VFX', '_blank');
    }
    handleClose();
  };

  if (!isEnabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background with particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-2xl blur-xl animate-pulse" />
            
            <div className="relative glass border-2 border-primary/50 rounded-2xl p-8 text-center overflow-hidden">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse rounded-2xl" />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-gradient">
                  {headline}
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {subtext}
                </p>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <Button 
                    size="lg" 
                    className="button-gradient w-full text-lg py-6"
                    onClick={handleCTA}
                  >
                    {ctaText}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-white"
                  >
                    Maybe later
                  </Button>
                </motion.div>
              </motion.div>

              {/* Floating particles animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    initial={{ 
                      x: Math.random() * 400,
                      y: Math.random() * 300,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: Math.random() * 400,
                      y: Math.random() * 300,
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalePopup;