import { motion } from 'framer-motion';
import { Bot, Brain, Clock, Globe, MessageSquare, Shield, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Understanding',
    description: 'Advanced natural language processing for accurate query comprehension and contextual responses.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: '24/7 instant support across all time zones, ensuring your customers are never left waiting.',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Seamlessly communicate with customers in over 100 languages with native-level fluency.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Experience',
    description: 'Adaptive responses based on customer history, preferences, and behavior patterns.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance with global data protection regulations.',
  },
  {
    icon: Zap,
    title: 'Instant Resolution',
    description: 'Resolve up to 80% of customer queries instantly without human intervention.',
  },
];

const metrics = [
  {
    value: '85%',
    label: 'First Contact Resolution',
    description: 'Of customer inquiries resolved in the first interaction',
  },
  {
    value: '24/7',
    label: 'Availability',
    description: 'Round-the-clock customer support coverage',
  },
  {
    value: '< 10s',
    label: 'Response Time',
    description: 'Average time to first response',
  },
  {
    value: '95%',
    label: 'Satisfaction Rate',
    description: 'Customer satisfaction with AI interactions',
  },
];

const useCases = [
  {
    title: 'E-commerce Support',
    description: 'Handle order tracking, returns, and product inquiries automatically.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Technical Support',
    description: 'Provide instant troubleshooting and technical guidance.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Financial Services',
    description: 'Handle account inquiries and transaction support securely.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
  },
];

export function CustomerServicePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Intelligent Customer Service - AipaFlow</title>
        <meta
          name="description"
          content="Transform your customer support with AipaFlow's intelligent service agent. Provide instant, 24/7 support while reducing costs and improving satisfaction."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <MessageSquare className="w-8 h-8 text-primary-600" />
              <Bot className="w-8 h-8 text-secondary-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            >
              Intelligent Customer Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Deliver exceptional customer support 24/7 with our AI-powered service agent that understands, learns, and resolves issues instantly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="group" onClick={() => navigate('/request-demo')}>
                Schedule Demo
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-200 mb-1">
                  {metric.label}
                </div>
                <div className="text-gray-400">
                  {metric.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Powerful Capabilities
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need for world-class customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <feature.icon className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Industry Solutions
            </h2>
            <p className="text-xl text-gray-300">
              Tailored customer service for every business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-display font-bold text-white mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-white/90">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 md:p-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
                Ready to Transform Your Customer Service?
              </h2>
              <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                Join leading businesses that trust AipaFlow to deliver exceptional customer experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/request-demo')}>
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}