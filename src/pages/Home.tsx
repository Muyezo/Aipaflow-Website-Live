/*import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';*/
import React, { useEffect, useRef, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Users, Play, ExternalLink, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
// Import your icon components as needed:
//import { ChevronLeft, ChevronRight, Pause, Play } from './Icons'; // adjust as necessary

import { Button } from '@/components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';



const services = [
  {
    title: 'AI Appointment Voice Agent',
    description: 'Streamline your scheduling with our intelligent voice agent that handles appointments naturally and efficiently.',
    icon: Bot,
    image: '/AppointmentVoiceAgent.png',
    href: '/services/appointment-agent',
  },
  {
    title: 'Intelligent Customer Service',
    description: 'Provide 24/7 customer support with our AI agent that understands and resolves customer inquiries instantly.',
    icon: MessageSquare,
    image: '/IntelligentCustomerService.png',
    href: '/services/customer-service',
  },
  {
    title: 'AI Customer Acquisition',
    description: 'Automate lead generation and customer outreach with our intelligent acquisition agent.',
    icon: Users,
    image: '/AICustomerAcquisition.png',
    href: '/services/customer-acquisition',
  },
];

const industries = [
  {
    name: 'Healthcare',
    description: 'Streamline patient scheduling and care coordination',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Real Estate',
    description: 'Automate property viewings and client communications',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Financial Services',
    description: 'Enhance customer service and compliance',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Retail',
    description: 'Improve customer engagement and sales',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Beauty & Wellness',
    description: 'Optimize appointment scheduling and client management',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Automotive Services',
    description: 'Streamline service appointments and customer communication',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Hotel & Hospitality',
    description: 'Enhance guest experience and booking management',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [currentIndustryIndex, setCurrentIndustryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /*const navigate = useNavigate();
  const [currentIndustryIndex, setCurrentIndustryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);*/

  // Create a duplicate array for seamless scrolling
  const duplicatedIndustries = [...industries, ...industries];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for "prefers-reduced-motion"
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      setIsPlaying(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Manual navigation handlers.
  const handlePrevious = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / duplicatedIndustries.length;
    const targetScrollPosition = container.scrollLeft - itemWidth;
    container.scrollTo({ left: targetScrollPosition, behavior: 'smooth' });
    setCurrentIndustryIndex((prev) =>
      prev === 0 ? industries.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / duplicatedIndustries.length;
    const targetScrollPosition = container.scrollLeft + itemWidth;
    container.scrollTo({ left: targetScrollPosition, behavior: 'smooth' });
    setCurrentIndustryIndex((prev) => (prev + 1) % industries.length);
  };

  // Scroll event handler to reset scroll position for an infinite loop.
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // With two copies, one set's width is half of the total scrollable width.
    const oneSetWidth = container.scrollWidth / 2;

    // When scrollLeft reaches or exceeds oneSetWidth, subtract oneSetWidth.
    if (container.scrollLeft >= oneSetWidth) {
      container.scrollLeft = container.scrollLeft - oneSetWidth;
    }
    // (If supporting backward scrolling, you could add a check for negative scrollLeft.)
  };

  // On mount, set the initial scroll position to 0 and add the scroll event listener.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = 0;
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto scroll using requestAnimationFrame.
  useEffect(() => {
    let animationFrame;
    const autoScroll = () => {
      if (
        isPlaying &&
        !isHovered &&
        !prefersReducedMotion &&
        scrollContainerRef.current
      ) {
        // Increase this value to scroll faster.
        scrollContainerRef.current.scrollLeft += 1;
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };
    animationFrame = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, isHovered, prefersReducedMotion]);

  return (
    <>
      <Helmet>
        <title>AipaFlow - AI Automation Agency</title>
        <meta
          name="description"
          content="Empowering businesses with AI-powered automation for streamlined operations, cost reduction and exponential growth."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white">
              Hyper Automation
            </h1>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white">
              Let AI Work for You!
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 mt-8"
          >
            Empowering businesses with AI-powered automation for streamlined operations,
            cost reduction and exponential growth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="group" 
              onClick={() => navigate('/request-demo')}
            >
              Request A Demo
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-300">
              Transforming businesses with cutting-edge AI solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="glass-card h-full transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <service.icon className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-base sm:text-lg text-gray-300">{service.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

     {/* Industries Section */}
      <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-300">
              Tailored AI solutions for diverse business sectors
            </p>
          </div>

          <div className="relative">
            {/* Navigation Controls */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-gray-900/80 text-white hover:bg-gray-900 transition-colors"
              aria-label="Previous industry"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-gray-900/80 text-white hover:bg-gray-900 transition-colors"
              aria-label="Next industry"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-0 right-0 z-10 p-2 rounded-full bg-gray-900/80 text-white hover:bg-gray-900 transition-colors"
              aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {/* Marquee Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="industries-scroll">
                {duplicatedIndustries.map((industry, index) => (
                  <motion.div
                    key={`${industry.name}-${index}`}
                    className="flex-none w-[280px] sm:w-[320px] md:w-[360px] mx-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="glass-card h-full">
                      <div className="relative h-40 sm:h-48 rounded-t-lg overflow-hidden">
                        <img
                          src={industry.image}
                          alt={industry.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-3 left-4 text-lg font-display font-bold text-white">
                          {industry.name}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-300">{industry.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {industries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndustryIndex(index);
                    if (scrollContainerRef.current) {
                      const itemWidth =
                        scrollContainerRef.current.scrollWidth /
                        duplicatedIndustries.length;
                      scrollContainerRef.current.scrollTo({
                        left: itemWidth * index,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndustryIndex === index
                      ? 'bg-primary-400'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to industry ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              See AipaFlow in Action
            </h2>
            <p className="text-xl text-gray-300">Watch how our AI agents transform business operations</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card relative overflow-hidden rounded-xl sm:rounded-2xl group">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="https://i3.ytimg.com/vi/_UoG03KG6-g/maxresdefault.jpg"
                  alt="AipaFlow Demo Video"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href="https://www.youtube.com/watch?v=_UoG03KG6-g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span className="font-medium">Watch on YouTube</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}