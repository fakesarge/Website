
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "./CTASection";
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
      className="w-full"
    >

      {/* Features Section */}
      <div id="features" className="bg-black">
        <FeaturesSection />
      </div>

      {/* Logo Carousel */}
      <LogoCarousel />



      {/* Pricing Section */}
      <div id="pricing" className="bg-black">
        <PricingSection />
      </div>

      {/* Testimonials Section */}
      <div className="bg-black">
        <TestimonialsSection />
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <div className="bg-black">
        <Footer />
      </div>
      
      {/* Price Estimator Modal */}
      <PriceEstimator 
        isOpen={showPriceEstimator} 
        onClose={() => setShowPriceEstimator(false)} 
      />
    </motion.div>
  );
};

export default ContentSection;
