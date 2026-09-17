import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WhatWeDoSection from "./WhatWeDoSection";
import StatsSection from "./StatsSection";
import FeaturedWorkSection from "./FeaturedWorkSection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import VipMembershipSection from "./VipMembershipSection";
import ProcessSection from "./ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "./FAQSection";
import BigCTASection from "./BigCTASection";
import Footer from "@/components/Footer";
import PriceEstimator from "@/components/PriceEstimator";

interface ContentSectionProps { contentRef: React.RefObject<HTMLDivElement>; }

const ContentSection = ({ contentRef }: ContentSectionProps) => {
  const [showPriceEstimator, setShowPriceEstimator] = useState(false);

  useEffect(() => {
    const open = () => setShowPriceEstimator(true);
    window.addEventListener("openPriceEstimator", open);
    return () => window.removeEventListener("openPriceEstimator", open);
  }, []);

  return (
    <motion.main ref={contentRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full">
      <StatsSection />
      <FeaturedWorkSection />
      <ProcessSection />
      <WhatWeDoSection />
      <FeaturedProductsSection />
      <VipMembershipSection />
      <TestimonialsSection />
      <FAQSection />
      <BigCTASection />
      <Footer />
      <PriceEstimator isOpen={showPriceEstimator} onClose={() => setShowPriceEstimator(false)} />
    </motion.main>
  );
};

export default ContentSection;