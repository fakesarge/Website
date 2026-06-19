import { motion } from "framer-motion";
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
  {
    id: "monthly",
    label: "Monthly Elite",
    price: "$29",
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
];

const VipMembershipSection = () => {
  const [active, setActive] = useState<"weekly" | "monthly">("monthly");

  return (
    <section id="vip" className="container px-4 py-32 relative overflow-hidden">
      {/* Ambient glows */}
      <motion.div
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0], opacity: [0.08, 0.16, 0.06, 0.08] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-primary blur-[180px]"
      />
      <motion.div
        animate={{ x: [0, -40, 60, 0], y: [0, 30, -20, 0], opacity: [0.05, 0.12, 0.04, 0.05] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-primary blur-[160px]"
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6"
          >
            <Crown className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary">VIP Membership</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Join the <span className="text-gradient">Inner Circle</span>
          </motion.h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Premium drops, private channels and the tools used by top creators. Pick your tempo.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative inline-flex rounded-full border border-border/50 bg-card/60 p-1 backdrop-blur-md">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`relative z-10 px-6 py-2 text-sm font-medium transition-colors ${
                  active === p.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === p.id && (
                  <motion.span
                    layoutId="vip-toggle"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => {
            const isActive = plan.id === active;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                animate={{ scale: isActive ? 1.02 : 1 }}
                className={`relative rounded-3xl border p-8 backdrop-blur-xl transition-all duration-500 ${
                  isActive
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card/80 to-card/60 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.4)]"
                    : "border-border/40 bg-card/40"
                }`}
              >
                {plan.savings && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    <Sparkles className="inline h-3 w-3 mr-1" />
                    {plan.savings}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <Crown className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="text-xl font-semibold">{plan.label}</h3>
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
                        <Check className={`h-3 w-3 ${isActive ? "text-primary" : "text-foreground/70"}`} />
                      </span>
                      <span className="text-foreground/85">{perk}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open("https://discord.gg/74hrs", "_blank")}
                  className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)]"
                      : "border border-border bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VipMembershipSection;
