import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

// ── Toggle this to enable/disable the popup ──
const SALE_POPUP_ENABLED = true;

const SalePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!SALE_POPUP_ENABLED) return;
    const dismissed = sessionStorage.getItem("sale-popup-dismissed");
    if (dismissed) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem("sale-popup-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl p-8 text-center shadow-2xl pointer-events-auto">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Launch Sale 🎉
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Use code <span className="font-semibold text-primary">SALE</span> at checkout for exclusive discounts on all products. Limited time only.
              </p>

              <button
                onClick={() => {
                  dismiss();
                  window.location.href = "/shop";
                }}
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Shop Now
              </button>

              <p className="mt-3 text-xs text-muted-foreground/60">
                Can be dismissed — won't show again this session.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SalePopup;
