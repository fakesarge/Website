import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-24"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-gradient">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-300">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <p>74HRS provides professional VFX, graphics, and design services. All work is custom-made to client specifications.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Payment Terms</h2>
              <p>Payment is required before work begins unless otherwise agreed upon. All prices are in USD and subject to applicable taxes.</p>
              <p>No refunds will be offerd whatsoever. If the work is not completed on time a compensation may be offered by the designer.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <p>Upon full payment, all rights to the final delivered work transfer to the client. We retain the right to showcase work in our portfolio.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p>Our liability is limited to the amount paid for services. We are not responsible for indirect, special, or consequential damages.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>For questions about these terms, please contact us through our Discord server or support channels.</p>
            </section>
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Terms;