import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import WhatWeDoSection from "./WhatWeDoSection";
import StatsSection from "./StatsSection";
import WhyUsSection from "./WhyUsSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import PriceEstimator from "@/components/PriceEstimator";

interface ContentSectionProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const ContentSection = ({ contentRef }: ContentSectionProps) => {
  const [showPriceEstimator, setShowPriceEstimator] = useState(false);

  useEffect(() => {
    const handleOpenEstimator = () => {
      setShowPriceEstimator(true);
    };

    window.addEventListener('openPriceEstimator', handleOpenEstimator);
    return () => window.removeEventListener('openPriceEstimator', handleOpenEstimator);
  }, []);

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full relative"
    >
      {/* Ambient background effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[150px]" />
        <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Section 1 – What We Do */}
      <WhatWeDoSection />

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Section 2 – Social Proof Stats */}
      <StatsSection />

      {/* Section 4 – Why 74hrs */}
      <WhyUsSection />

      {/* Price Calculator */}
      <div id="pricing">
        <section className="container px-4 py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get Your <span className="text-gradient">Custom Quote</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Use our price calculator to get an instant quote for your project
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPriceEstimator(true)}
              className="button-gradient text-sm px-8 py-3.5 rounded-full font-medium cursor-pointer"
            >
              Calculate Price
            </motion.button>
          </div>
        </section>
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />

      {/* Price Estimator Modal */}
      <PriceEstimator
        isOpen={showPriceEstimator}
        onClose={() => setShowPriceEstimator(false)}
      />
    </motion.div>
  );
};

export default ContentSection;
