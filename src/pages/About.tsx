import { motion } from 'framer-motion';
import { Target, Users, Rocket } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'We push the boundaries of AI technology to create solutions that transform businesses'
  },
  {
    icon: Users,
    title: 'Customer Success',
    description: 'Your success is our success. We\'re committed to delivering results that matter'
  },
  {
    icon: Rocket,
    title: 'Continuous Growth',
    description: 'We constantly evolve our solutions to stay ahead of industry needs'
  }
];

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us - AipaFlow</title>
        <meta
          name="description"
          content="Learn about AipaFlow's mission to transform businesses through AI automation and meet the team behind the innovation."
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
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              We're on a mission to transform how businesses operate through the power of AI automation
            </motion.p>
          </div>
        </div>
      </section>

      {/* Meet AipaFlow Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Meet AipaFlow
            </h2>
            <p className="text-xl text-gray-300">
              Your partner in business transformation
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-12"
          >
            <div className="prose prose-lg prose-invert">
              <p className="text-gray-300 leading-relaxed mb-6">
                At AipaFlow, we understand the challenges businesses face in juggling daily operations and maintaining strong customer relationships. That's why we've created AI-powered automation solutions that simplify workflows, reduce costs, and drive exponential growth. We're not just a service provider—we're your partner in transforming the way you work.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                By integrating advanced technology with a deep understanding of your unique needs, AipaFlow delivers seamless solutions that don't just automate—they elevate. Our mission is to make cutting-edge AI accessible to businesses of all sizes, enabling sustainable growth and unlocking potential you never thought possible.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Join us in shaping the future of work. With AipaFlow by your side, you can overcome today's challenges and embrace tomorrow's opportunities. Let's innovate, grow, and create extraordinary success together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center"
              >
                <value.icon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}