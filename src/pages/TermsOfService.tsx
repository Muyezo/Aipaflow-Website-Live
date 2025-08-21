import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

export function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service - AipaFlow</title>
        <meta
          name="description"
          content="Read AipaFlow's terms of service and user agreement."
        />
      </Helmet>

      <div className="min-h-screen py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-white"
          >
            <h2 className="text-2xl font-display font-bold mb-6">1. Agreement to Terms</h2>
            <p className="mb-8">
              By accessing or using AipaFlow's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">2. Use License</h2>
            <p className="mb-8">
              Subject to your compliance with these Terms, AipaFlow grants you a limited, non-exclusive, non-transferable, and revocable license to use our services for your business purposes.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">3. Service Description</h2>
            <p className="mb-4">
              AipaFlow provides AI-powered automation solutions for businesses, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>AI Appointment Voice Agent</li>
              <li>Intelligent Customer Service</li>
              <li>AI Customer Acquisition</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mb-6">4. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Use the services only for legitimate business purposes</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mb-6">5. Payment Terms</h2>
            <p className="mb-8">
              You agree to pay all fees associated with your use of our services. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">6. Intellectual Property</h2>
            <p className="mb-8">
              All content, features, and functionality of our services are owned by AipaFlow and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">7. Data Processing</h2>
            <p className="mb-8">
              Our processing of personal data is governed by our Privacy Policy and applicable data protection laws, including GDPR for users in the European Economic Area.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">8. Service Level Agreement</h2>
            <p className="mb-8">
              We strive to maintain a 99.9% uptime for our services. Specific service levels and compensation for service interruptions are detailed in our Service Level Agreement.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">9. Limitation of Liability</h2>
            <p className="mb-8">
              To the maximum extent permitted by law, AipaFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">10. Termination</h2>
            <p className="mb-8">
              We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">11. Changes to Terms</h2>
            <p className="mb-8">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes and obtain consent where required by law.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">12. Governing Law</h2>
            <p className="mb-8">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which AipaFlow is registered, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">13. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at legal@AipaFlow.com.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}