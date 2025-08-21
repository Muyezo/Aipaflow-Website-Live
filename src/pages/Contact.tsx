import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Available Mon-Fri, 9am-4pm EST',
    value: '+1 (719) 886-8868',
  },
  {
    icon: Mail,
    title: 'Email',
    description: "We'll respond within 24 hours",
    value: 'support@AipaFlow.com',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: '24/7 AI-powered support',
    value: 'Start Chat',
  },
];

const faqs = [
  {
    question: 'How quickly can I get started with AipaFlow?',
    answer: 'You can start using AipaFlow immediately after signing up. Our onboarding process typically takes less than an hour, and our team will guide you through the entire setup.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer 24/7 AI-powered support, along with dedicated human support during business hours. Our team is always ready to help you get the most out of our platform.',
  },
  {
    question: 'Is my data secure with AipaFlow?',
    answer: 'Yes, we take security seriously. We use enterprise-grade encryption and comply with major security standards to ensure your data is always protected.',
  },
];

export function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us - AipaFlow</title>
        <meta
          name="description"
          content="Get in touch with AipaFlow. We're here to help you transform your business with AI automation."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Have questions? We're here to help you transform your business with AI automation
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center"
              >
                <method.icon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <p className="text-lg text-primary-400 font-medium">{method.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-0 overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-8 text-center pt-8">
              Send Us a Message
            </h2>
            <div className="relative" style={{ isolation: 'isolate' }}>
              <iframe 
                aria-label='Send Us a Message'
                frameBorder="0"
                style={{
                  height: '500px',
                  width: '100%',
                  border: 'none',
                  position: 'relative',
                  zIndex: 10,
                  background: 'transparent'
                }}
                src='https://forms.zohopublic.com/israeladeaip1/form/ContactUs/formperma/o0FTi134zHhTAO-1e77tNrxjl9tX9JNjZV0UVfWUfeY'
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Quick answers to common questions
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}