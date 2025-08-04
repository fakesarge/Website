
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "@/components/Footer";

interface ContentSectionProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const ContentSection = ({ contentRef }: ContentSectionProps) => {
  const handleBrowseGraphicsClick = () => {
    window.open('https://discord.gg/VFX', '_blank');
  };

  const handleViewPortfolioClick = () => {
    // This will be handled by the router
    window.location.href = '/portfolio';
  };

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
    </motion.div>
  );
};

export default ContentSection;
