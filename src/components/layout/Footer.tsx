import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNewsletter } from '@/hooks/useNewsletter';

const quickLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
];

const socialLinks = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com/aipaflow',
    icon: Twitter,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@aipaflow',
    icon: (props: any) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/aipaflow/',
    icon: Instagram,
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const { subscribe, loading, error, success } = useNewsletter();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe(email);
      setEmail(''); // Clear form on success
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-xl sm:text-2xl font-display font-bold text-white">
              AipaFlow
            </Link>
            <p className="mt-4 text-gray-400">
              Empowering businesses with AI-powered automation for streamlined operations and exponential growth.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <Button type="submit" disabled={loading} className="flex-shrink-0">
                  {loading ? (
                    <span className="animate-spin">⌛</span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-400">Thanks for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AipaFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}