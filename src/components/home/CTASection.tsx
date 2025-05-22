
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
