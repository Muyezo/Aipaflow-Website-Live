import { motion } from 'framer-motion';
import { Bot, Calendar, Clock, MessageSquare, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent scheduling that considers availability, preferences, and priorities.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock appointment booking and management.',
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description: 'Human-like interactions powered by advanced language models.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'HIPAA-compliant and secure data handling for sensitive information.',
  },
  {
    icon: Bot,
    title: 'Multi-language Support',
    description: 'Communicate with clients in their preferred language.',
  },
  {
    icon: Zap,
    title: 'Instant Confirmations',
    description: 'Automated confirmations and reminders via email or SMS.',
  },
];

const integrations = [
  {
    name: 'Google Calendar',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
  },
  {
    name: 'Microsoft Outlook',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
  },
  {
    name: 'Calendly',
    logo: '/calendly-logo.svg',
  },
];

export function AppointmentAgentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Appointment Voice Agent - AipaFlow</title>
        <meta
          name="description"
          content="Transform your appointment scheduling with AipaFlow's intelligent voice agent. Streamline bookings, reduce no-shows, and enhance customer experience."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            >
              AI Appointment Voice Agent
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Transform your scheduling experience with our intelligent voice agent that handles appointments naturally and efficiently.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" onClick={() => navigate('/request-demo')}>Schedule a Demo</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-white">
              Everything you need to streamline your appointment scheduling
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

      {/* Integration Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-300">
              Works with your favorite calendar and scheduling tools
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 mb-4 mx-auto"
                />
                <p className="text-gray-300 font-medium">{integration.name}</p>
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
                Ready to Transform Your Scheduling?
              </h2>
              <p className="text-xl mb-8 text-gray-300">
                Join leading businesses that trust AipaFlow for their scheduling needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/request-demo')}>
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}