import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  const plan = plans.find((p) => p.id === active) ?? plans[0];

  if (!plan) return null;

  return (
    <section id="vip" className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1120px] px-5">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <Crown className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs tracking-[0.3em] uppercase text-primary">
              VIP Membership
            </span>
          </div>

          <h2 className="font-display text-4xl font-extrabold uppercase md:text-6xl">
            Unlimited drops.<br /><span className="text-muted-foreground">One membership.</span>
          </h2>
        </motion.div>

        {/* SINGLE CARD */}
        <motion.div
          layout
          className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-10"
        >

          <div className="pointer-events-none absolute inset-0 creative-grid opacity-20" />

          {/* TABS */}
          <div className="flex justify-center mb-8">
            <div className="relative z-10 flex rounded-full border border-border bg-background p-1">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className="relative px-6 py-2 text-sm font-medium"
                >
                  {active === p.id && (
                    <motion.span
                      layoutId="vip-tab"
                    className="absolute inset-0 rounded-full border border-accent/50 bg-accent/20"
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
                         ? "text-foreground"
                         : "text-muted-foreground hover:text-foreground"
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
                <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[10px] uppercase text-primary">
                  <Sparkles className="h-3 w-3" />
                  {plan.savings}
                </div>
              )}

              {/* TITLE + PRICE */}
              <div className="relative z-10 flex flex-col justify-between gap-8 border-b border-border pb-8 sm:flex-row sm:items-end">
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
                    className="flex items-center gap-3 text-sm text-foreground/80"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-secondary">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    {perk}
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() =>
                  window.open("https://discord.gg/74hrs", "_blank")
                }
                className="relative z-10 mt-10 w-full rounded-full uppercase"
              >
                {plan.cta}
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default VipMembershipSection;