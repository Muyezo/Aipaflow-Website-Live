import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const featuredPost = {
  title: 'The Future of AI in Business Automation',
  excerpt: 'Discover how artificial intelligence is revolutionizing business operations and creating new opportunities for growth.',
  image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000',
  date: 'March 15, 2024',
  readTime: '8 min read',
  category: 'AI & Technology',
};

const posts = [
  {
    title: 'How AI is Transforming Customer Service',
    excerpt: 'Learn how businesses are leveraging AI to provide exceptional customer experiences 24/7.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    date: 'March 10, 2024',
    readTime: '6 min read',
    category: 'Customer Service',
  },
  {
    title: 'The ROI of AI-Powered Appointment Scheduling',
    excerpt: 'Discover the measurable benefits of implementing AI scheduling solutions.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800',
    date: 'March 5, 2024',
    readTime: '5 min read',
    category: 'Business',
  },
  {
    title: 'AI Lead Generation: A Complete Guide',
    excerpt: 'Everything you need to know about using AI to generate and qualify leads effectively.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    date: 'March 1, 2024',
    readTime: '10 min read',
    category: 'Marketing',
  },
];

const categories = [
  'AI & Technology',
  'Customer Service',
  'Business',
  'Marketing',
  'Industry Insights',
  'Case Studies',
];

export function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - AipaFlow</title>
        <meta
          name="description"
          content="Explore the latest insights on AI automation, customer service, and business growth strategies."
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
              Latest Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Explore our latest thoughts on AI, automation, and the future of business
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group overflow-hidden rounded-3xl"
          >
            <div className="aspect-w-16 aspect-h-9 lg:aspect-h-7">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-end">
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-300 mb-6 max-w-3xl">
                  {featuredPost.excerpt}
                </p>
                <Button size="lg" className="w-fit group">
                  Read More
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card group overflow-hidden rounded-2xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary-400 group/link">
                    Read Article
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-white mb-8">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 rounded-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on AI, automation, and business growth
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}