
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "@/components/Footer";
import PriceEstimator from "@/components/PriceEstimator";
import StatsCounter from "@/components/StatsCounter";

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

      {/* Stats Counter */}
      <div className="bg-black">
        <StatsCounter />
      </div>

      {/* Price Calculator Section */}
      <div id="pricing" className="bg-black">
        <section className="container px-4 py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-normal mb-6">
              Get Your{" "}
              <span className="text-gradient font-medium">Custom Quote</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Use our price calculator to get an instant quote for your project
            </p>
            <button 
              onClick={() => {
                const event = new CustomEvent('openPriceEstimator');
                window.dispatchEvent(event);
              }}
              className="button-gradient text-lg px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Calculate Price
            </button>
          </div>
        </section>
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
