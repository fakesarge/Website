import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What exactly do you offer?", a: "Premium 3D loading screens, motion design, web development and ready-to-use digital assets — all crafted by senior creators." },
  { q: "Is there a launch discount?", a: "Yes — most products ship with a launch discount and we run seasonal sales. Sign in to unlock VIP-only pricing." },
  { q: "Will your assets work on my setup?", a: "Everything is built to be drag-and-drop in Blender, After Effects, Premiere Pro and Photoshop using their current stable versions." },
  { q: "Do I really own it, or is it a subscription?", a: "One-time payment, lifetime license, lifetime updates. No recurring fees on assets." },
  { q: "Can I use it on paid client work?", a: "Yes — every asset includes a commercial license for unlimited client projects." },
  { q: "Do you offer refunds?", a: "Because assets are delivered instantly, all sales are final — but our support will make it right if something is broken." },
];

const FAQSection = () => {
  return (
    <section className="container px-4 py-28">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-glow"
        >
          Support
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Everything you <span className="text-gradient">need to know.</span>
        </motion.h2>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-full border border-border/40 bg-card/60 backdrop-blur-md px-6 data-[state=open]:rounded-2xl data-[state=open]:bg-card/80 transition-all"
            >
              <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pr-8">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
