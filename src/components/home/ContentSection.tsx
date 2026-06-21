import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import WhatWeDoSection from "./WhatWeDoSection";
import StatsSection from "./StatsSection";
import WhyUsSection from "./WhyUsSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import PriceEstimator from "@/components/PriceEstimator";
import SectionDivider from "@/components/SectionDivider";
import FAQSection from "./FAQSection";
import BigCTASection from "./BigCTASection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import VipMembershipSection from "./VipMembershipSection";

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
      {/* Section 1 – What We Do */}
      <WhatWeDoSection />

      {/* Logo Carousel */}
      <LogoCarousel />
      {/* <FeaturedProductsSection /> */}


      {/* Section 2 – Social Proof Stats */}
      {/* <StatsSection /> */}


      {/* Section 4 – Why 74hrs */}
      <WhyUsSection />

      <SectionDivider />

      {/* Featured Products from Shop */}
      <SectionDivider />

      {/* VIP Membership */}
      <VipMembershipSection />

      <SectionDivider />

      {/* Price Calculator */}
      <div id="pricing">
        <section className="container px-4 py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-6" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Get Your <span className="text-gradient">Custom Quote</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-muted-foreground text-lg mb-8"
            >
              Use our price calculator to get an instant quote for your project
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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

      <SectionDivider />

      {/* Testimonials */}
      <TestimonialsSection />

      <SectionDivider />

      {/* FAQ */}
      <FAQSection />

      <SectionDivider />

      {/* Big CTA */}
      <BigCTASection />

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
