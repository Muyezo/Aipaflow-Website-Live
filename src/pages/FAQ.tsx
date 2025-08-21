import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const faqs = [
  {
    question: 'What is AipaFlow?',
    answer: 'AipaFlow is an AI automation platform that helps businesses streamline their operations through intelligent voice agents, customer service automation, and AI-powered customer acquisition tools.',
  },
  {
    question: 'How quickly can I get started with AipaFlow?',
    answer: 'You can start using AipaFlow immediately after signing up. Our onboarding process typically takes less than an hour, and our team will guide you through the entire setup process.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer 24/7 AI-powered support, along with dedicated human support during business hours. Our team is always ready to help you get the most out of our platform.',
  },
  {
    question: 'Is my data secure with AipaFlow?',
    answer: 'Yes, we take security seriously. We use enterprise-grade encryption, comply with GDPR and other major security standards, and implement robust measures to ensure your data is always protected.',
  },
  {
    question: 'Can I customize the AI voice agent?',
    answer: 'Yes, our AI voice agents are fully customizable. You can adjust the voice, language, script, and behavior to match your brand and specific needs.',
  },
  {
    question: 'What languages do you support?',
    answer: 'Our platform supports multiple languages including English, Spanish, French, German, and more. We can add support for additional languages based on customer needs.',
  },
  {
    question: 'How do you handle data privacy?',
    answer: 'We comply with GDPR and other international data protection regulations. All data is encrypted, and we never share your information with third parties without consent.',
  },
  {
    question: 'What integrations do you offer?',
    answer: 'We integrate with popular business tools including CRM systems, calendar applications, and communication platforms. Custom integrations are also available.',
  },
  {
    question: 'How do you price your services?',
    answer: 'We offer flexible pricing plans based on your needs and usage. Contact our sales team for a customized quote.',
  },
  {
    question: 'Can I try AipaFlow before committing?',
    answer: 'Yes, we offer a free demo of our platform. You can schedule a demo through our website to see how AipaFlow can benefit your business.',
  },
];

export function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>FAQ - AipaFlow</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about AipaFlow's AI automation services."
        />
      </Helmet>

      <div className="min-h-screen py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300">
              Find answers to common questions about AipaFlow
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-display font-bold text-white mb-3">
                  {faq.question}
                </h2>
                <p className="text-gray-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}