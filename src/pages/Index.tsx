import { motion } from "framer-motion";
import { ArrowRight, Command, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navigation />
      
      {/* Full-screen YouTube Video Hero Section */}
      <div 
        ref={videoSectionRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/HcgnQw_LBKA?autoplay=1&mute=1&loop=1&playlist=HcgnQw_LBKA&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
            title="Cryptocurrency Trading Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        {/* Only keeping a slight overlay and the scroll arrow */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToContent}
        >
          <ChevronDown className="w-10 h-10 text-white/80" />
        </motion.div>
      </div>

      {/* Main Content Section with Reveal Animation */}
      <motion.div 
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        {/* Hero Section with Content */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative container px-4 py-20"
        >
          {/* Background */}
          <div 
            className="absolute inset-0 -z-10 bg-[#0A0A0A]"
          />
          
          <div className="max-w-4xl relative z-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl text-left"
            >
              Our platform provides you with all the tools you need to trade cryptocurrencies efficiently and securely. From real-time market data to advanced trading features, we've got you covered.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <Button size="lg" className="button-gradient">
                Start Trading Now
              </Button>
              <Button size="lg" variant="link" className="text-white">
                View Markets <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative mx-auto max-w-5xl mt-20"
          >
            <div className="glass rounded-xl overflow-hidden">
              <img
                src="/lovable-uploads/c32c6788-5e4a-4fee-afee-604b03113c7f.png"
                alt="CryptoTrade Dashboard"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Logo Carousel */}
        <LogoCarousel />

        {/* Features Section */}
        <div id="features" className="bg-black">
          <FeaturesSection />
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-black">
          <PricingSection />
        </div>

        {/* Testimonials Section */}
        <div className="bg-black">
          <TestimonialsSection />
        </div>

        {/* CTA Section */}
        <section className="container px-4 py-20 relative bg-black">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'url("/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0A0A0A]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start trading?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders who have already discovered the power of our platform.
            </p>
            <Button size="lg" className="button-gradient">
              Create Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </section>

        {/* Footer */}
        <div className="bg-black">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
