import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Sparkles } from "lucide-react";
import { useState } from "react";

interface Plan {
  id: "weekly" | "monthly";
  label: string;
  price: string;
  period: string;
  savings?: string;
  perks: string[];
  cta: string;
}

const plans: Plan[] = [
    {
    id: "monthly",
    label: "Monthly Membership",
    price: "$10",
    period: "/month",
    savings: "Save 25%",
    perks: [
      "Everything in Weekly",
      "Unlimited VIP downloads",
      "1-on-1 monthly review call",
      "Exclusive templates",
      "Early product access",
    ],
    cta: "Go Elite",
  },
  {
    id: "weekly",
    label: "Weekly Pass",
    price: "$9",
    period: "/week",
    perks: [
      "Access to VIP asset library",
      "Priority Discord channel",
      "Weekly drop previews",
      "Cancel anytime",
    ],
    cta: "Start Weekly",
  },
];

const VipMembershipSection = () => {
  const [active, setActive] = useState<"weekly" | "monthly">("monthly");

  const plan = plans.find((p) => p.id === active)!;

  return (
    <section id="vip" className="container px-4 py-32">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <Crown className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs tracking-[0.3em] uppercase text-primary">
              VIP Membership
            </span>
          </div>

          <h2 className="text-5xl font-bold tracking-tight">
            Join the <span className="text-gradient">Inner Circle</span>
          </h2>
        </motion.div>

        {/* SINGLE CARD */}
        <motion.div
          layout
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8"
        >

          {/* TABS */}
          <div className="flex justify-center mb-8">
            <div className="relative flex rounded-full border border-white/10 bg-white/5 p-1">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className="relative px-6 py-2 text-sm font-medium"
                >
                  {active === p.id && (
                    <motion.span
                      layoutId="vip-tab"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative transition-colors ${
                      active === p.id
                        ? "text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT (ANIMATED SWITCH) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
            >

              {/* BADGE */}
              {plan.savings && (
                <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-primary">
                  <Sparkles className="h-3 w-3" />
                  {plan.savings}
                </div>
              )}

              {/* TITLE + PRICE */}
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{plan.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Premium access for creators
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-5xl font-bold">{plan.price}</div>
                  <div className="text-muted-foreground text-sm">
                    {plan.period}
                  </div>
                </div>
              </div>

              {/* PERKS */}
              <div className="mt-8 space-y-3">
                {plan.perks.map((perk, i) => (
                  <motion.div
                    key={perk}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <div className="h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    {perk}
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open("https://discord.gg/74hrs", "_blank")
                }
                className="mt-10 w-full rounded-full py-3 text-sm font-medium bg-white text-black hover:shadow-lg transition-all"
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default VipMembershipSection;