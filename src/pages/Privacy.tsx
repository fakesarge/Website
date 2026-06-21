import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
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
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            Privacy Policy
          </h1>

          <p className="text-gray-400 mb-12">
            Last Updated: June 20, 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Introduction
              </h2>
              <p>
                74hrs ("we", "our", or "us") respects your privacy and is
                committed to protecting your personal information. This Privacy
                Policy explains how we collect, use, store, and protect
                information when you use our website, purchase products or
                services, create an account, or access VIP content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Information We Collect
              </h2>

              <div className="space-y-4">
                <p>We may collect information you voluntarily provide, including:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Discord username and Discord ID</li>
                  <li>Account information</li>
                  <li>Purchase history</li>
                  <li>Support requests and communications</li>
                </ul>

                <p>
                  We may also automatically collect certain information such as:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Website usage data</li>
                  <li>Authentication session information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                How We Use Your Information
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage user accounts</li>
                <li>Process purchases and payments</li>
                <li>Provide digital products and services</li>
                <li>Verify VIP membership access</li>
                <li>Provide customer support</li>
                <li>Improve website functionality and performance</li>
                <li>Prevent fraud, abuse, and unauthorized access</li>
                <li>Communicate important service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Payments
              </h2>

              <p>
                Payments are processed securely through Stripe. We do not store
                full payment card details on our servers. Payment information is
                handled according to Stripe's security and privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Authentication & Accounts
              </h2>

              <p>
                We use Supabase Authentication to manage user accounts and login
                sessions. Authentication sessions may be stored locally within
                your browser to keep you signed in and provide a better user
                experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Discord Integration
              </h2>

              <p>
                Some services, VIP content, or support features may require a
                Discord account. Information provided through Discord may be
                used to verify membership status, grant VIP access, and deliver
                community-related services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Cookies
              </h2>

              <p>
                We use cookies and similar technologies to maintain login
                sessions, improve website functionality, enhance security, and
                provide a smoother browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Information Sharing
              </h2>

              <p>
                We do not sell your personal information. Information may be
                shared only with trusted service providers necessary to operate
                our services, including:
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Stripe (payment processing)</li>
                <li>Supabase (authentication and database services)</li>
                <li>Discord (community integration)</li>
                <li>Website hosting and infrastructure providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Data Security
              </h2>

              <p>
                We implement reasonable security measures designed to protect
                your information from unauthorized access, disclosure,
                alteration, or destruction. However, no method of internet
                transmission or electronic storage can be guaranteed to be
                completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Data Retention
              </h2>

              <p>
                We retain information only for as long as necessary to provide
                services, maintain accounts, comply with legal obligations,
                resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Rights
              </h2>

              <p>
                Depending on your location, you may have the right to request
                access to, correction of, or deletion of your personal data.
                Contact us if you wish to make such a request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Changes To This Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact
              </h2>

              <p>
                If you have questions regarding this Privacy Policy, please
                contact us through our support channels or Discord community.

                Email: support@74hrs.store
                Discord: discord.gg/74hrs
              </p>
            </section>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Privacy;