import { motion } from 'framer-motion';
import { Users, Target, BarChart as ChartBar, Rocket, Zap, MessageSquare, Bot, LineChart, BarChart, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const features = [
  {
    icon: Target,
    title: 'Smart Lead Targeting',
    description: 'AI-powered algorithms identify and prioritize high-value prospects with precision.',
  },
  {
    icon: MessageSquare,
    title: 'Personalized Outreach',
    description: 'Dynamic messaging that adapts to individual prospect profiles and behaviors.',
  },
  {
    icon: ChartBar,
    title: 'Performance Analytics',
    description: 'Real-time insights and conversion tracking to optimize acquisition strategies.',
  },
  {
    icon: Bot,
    title: 'Automated Engagement',
    description: 'Intelligent follow-ups and nurturing sequences that convert leads into customers.',
  },
  {
    icon: Zap,
    title: 'Instant Qualification',
    description: 'Real-time lead scoring and qualification based on multiple data points.',
  },
  {
    icon: Rocket,
    title: 'Rapid Scaling',
    description: 'Effortlessly scale your outreach efforts while maintaining personalization.',
  },
];

const metrics = [
  {
    value: '300%',
    label: 'Lead Generation',
    description: 'Average increase in qualified leads',
  },
  {
    value: '65%',
    label: 'Conversion Rate',
    description: 'Higher conversion vs. traditional methods',
  },
  {
    value: '80%',
    label: 'Time Saved',
    description: 'Reduction in manual prospecting time',
  },
  {
    value: '45%',
    label: 'Cost Reduction',
    description: 'Lower customer acquisition costs',
  },
];

const caseStudies = [
  {
    company: 'TechCorp Solutions',
    industry: 'SaaS',
    results: 'Generated 500+ qualified leads in 30 days',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200',
  },
  {
    company: 'Global Finance Inc',
    industry: 'Financial Services',
    results: 'Reduced CAC by 60% while doubling conversions',
    image: 'https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&q=80&w=1200',
  },
  {
    company: 'RetailPro',
    industry: 'E-commerce',
    results: '3x increase in sales qualified leads',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200',
  },
];

const charts = [
  {
    icon: LineChart,
    title: 'Lead Growth',
    description: 'Track your lead generation progress over time',
  },
  {
    icon: BarChart,
    title: 'Conversion Analytics',
    description: 'Monitor conversion rates across channels',
  },
  {
    icon: PieChart,
    title: 'Source Attribution',
    description: 'Identify your most effective lead sources',
  },
];

export function CustomerAcquisitionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Customer Acquisition - AipaFlow</title>
        <meta
          name="description"
          content="Transform your lead generation and customer acquisition with AipaFlow's AI-powered automation. Generate more qualified leads while reducing costs."
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
              <Users className="w-8 h-8 text-primary-600" />
              <Target className="w-8 h-8 text-secondary-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            >
              AI Customer Acquisition
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Generate and convert more qualified leads with intelligent automation that scales your outreach while maintaining a personal touch.
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
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to accelerate your customer acquisition
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

      {/* Analytics Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Powerful Analytics
            </h2>
            <p className="text-xl text-gray-300">
              Make data-driven decisions with comprehensive insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {charts.map((chart, index) => (
              <motion.div
                key={chart.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <chart.icon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  {chart.title}
                </h3>
                <p className="text-gray-300">{chart.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              See how leading companies accelerate growth with AipaFlow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {study.company}
                    </h3>
                    <p className="text-primary-400 mb-2">{study.industry}</p>
                    <p className="text-gray-200">{study.results}</p>
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
                Ready to Transform Your Customer Acquisition?
              </h2>
              <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                Join industry leaders who trust AipaFlow to accelerate their growth
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