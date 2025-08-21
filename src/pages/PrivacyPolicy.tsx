import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy - AipaFlow</title>
        <meta
          name="description"
          content="Learn about how AipaFlow collects, uses, and protects your personal information."
        />
      </Helmet>

      <div className="min-h-screen py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Privacy Policy
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
            <h2 className="text-2xl font-display font-bold mb-6">Introduction</h2>
            <p className="mb-8">
              AipaFlow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI automation services, website, and mobile applications.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">Information We Collect</h2>
            <h3 className="text-xl font-display font-bold mb-4">Personal Information</h3>
            <p className="mb-4">We may collect personal information that you provide to us, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Name and contact information</li>
              <li>Business information</li>
              <li>Login credentials</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-display font-bold mb-4">Usage Information</h3>
            <p className="mb-4">We automatically collect certain information about your device and how you interact with our services, including:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and preferences</li>
              <li>Log data and analytics information</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mb-6">How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Personalizing your experience</li>
              <li>Processing payments</li>
              <li>Communicating with you</li>
              <li>Improving our services</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mb-6">Data Protection and GDPR Compliance</h2>
            <p className="mb-4">
              For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). This means you have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Right to access your data</li>
              <li>Right to rectification</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mb-6">Data Security</h2>
            <p className="mb-8">
              We implement appropriate technical and organizational measures to maintain the security of your personal information, including encryption, access controls, and regular security assessments.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">International Data Transfers</h2>
            <p className="mb-8">
              We may transfer your information to servers located outside your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">Third-Party Services</h2>
            <p className="mb-8">
              We may use third-party services that collect, monitor, and analyze data. These third parties have their own privacy policies addressing how they use such information.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">Children's Privacy</h2>
            <p className="mb-8">
              Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">Changes to This Privacy Policy</h2>
            <p className="mb-8">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-display font-bold mb-6">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: privacy@aipaflow.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
}