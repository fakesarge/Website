import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const steps = [
  { number: "01", title: "Choose your direction", copy: "Pick a service, share references, and tell us what the final piece needs to do." },
  { number: "02", title: "Watch it take shape", copy: "We build, animate, and refine your piece with clear updates along the way." },
  { number: "03", title: "Launch it everywhere", copy: "Receive polished, ready-to-use files for your server, channel, or campaign." },
];

const ProcessSection = () => (
  <section className="border-y border-border bg-secondary/35">
    <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 lg:px-16">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">How it works</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-7xl">From idea to<br />final render.</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">A focused process built for creators who want strong work without the usual confusion.</p>
      </div>
      <div className="grid border-l border-t border-border md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.article
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group min-h-72 border-b border-r border-border p-7 md:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-muted-foreground">[{step.number}]</span>
              <ArrowDownRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
            </div>
            <h3 className="mt-20 font-display text-2xl font-bold uppercase">{step.title}</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;