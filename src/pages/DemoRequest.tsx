import { motion } from 'framer-motion';
import { Target, Users, Rocket } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const benefits = [
  'See AipaFlow in action with a personalized demo',
  'Get expert insights on AI automation for your business',
  'Learn about our flexible pricing options',
  'Receive a custom implementation roadmap',
];

export function DemoRequestPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Request a Demo - AipaFlow</title>
        <meta
          name="description"
          content="Schedule a personalized demo of AipaFlow's AI automation solutions for your business."
        />
      </Helmet>

      <div className="min-h-screen py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Section - Now spans 8 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-0 w-full relative lg:col-span-8"
              style={{ isolation: 'isolate' }}
            >
              <iframe 
                aria-label='Request Your Demo' 
                frameBorder="0" 
                style={{
                  height: '1000px', // Doubled from 500px to 1000px
                  width: '100%',
                  border: 'none',
                  position: 'relative',
                  zIndex: 10
                }}
                src='https://forms.zohopublic.com/israeladeaip1/form/EventRegistration/formperma/aykezh7lLL6cWczXW1leP3QwwQU6FKuPU-Y7Jx1I5FQ'
              />
            </motion.div>

            {/* Benefits Section - Now spans 4 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-8 space-y-8 lg:col-span-4"
            >
              <div className="glass-card p-8">
                <h2 className="text-xl font-display font-bold text-white mb-6">
                  What You'll Get
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8">
                <h2 className="text-xl font-display font-bold text-white mb-4">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-gray-300">
                  Join thousands of businesses that trust AipaFlow for their AI automation needs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}