import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");

    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 right-6 z-[9999]"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    We use cookies
                  </h3>

                  <p className="text-sm text-gray-400 mt-1 max-w-xl">
                    74hrs uses cookies and similar technologies to keep you
                    signed in, improve performance, and enhance your browsing
                    experience.
                  </p>

                  <a
                    href="/privacy"
                    className="inline-block mt-2 text-sm text-primary hover:underline"
                  >
                    Read Privacy Policy
                  </a>
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={acceptCookies}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}