import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/lib/auth';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    children: [
      { 
        name: 'AI Appointment Voice Agent',
        href: '/services/appointment-agent'
      },
      { 
        name: 'Intelligent Customer Service',
        href: '/services/customer-service'
      },
      { 
        name: 'AI Customer Acquisition',
        href: '/services/customer-acquisition'
      },
    ],
  },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
      navigate('/');
    } else {
      setAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return navigate(() => {
      setMobileMenuOpen(false);
      setMobileActiveDropdown(null);
    });
  }, [navigate]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setMobileActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <img 
                src="/aipaflow-logo.png" 
                alt="AipaFlow"
                className="h-8 w-auto"
                style={{ 
                  objectFit: 'contain',
                  //filter: 'brightness(0) invert(1)'
                }}
              />
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-12">
            {navigation.map((item) => (
              item.children ? (
                <div
                  key={item.name}
                  ref={dropdownRef}
                  className="relative"
                >
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    className={`flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors ${
                      activeDropdown === item.name ? 'text-white' : ''
                    }`}
                    aria-expanded={activeDropdown === item.name}
                  >
                    {item.name}
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true" 
                    />
                  </button>
                  
                  {activeDropdown === item.name && (
                    <div 
                      className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2"
                    >
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-gray-900 px-5 py-6 sm:gap-8 sm:p-8">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`group relative flex items-center rounded-lg p-3 text-sm hover:bg-gray-800 transition-colors ${
                                location.pathname === child.href ? 'bg-gray-800 text-white' : 'text-gray-300'
                              }`}
                            >
                              <div className="font-semibold group-hover:text-white transition-colors">
                                {child.name}
                                <span className="absolute inset-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    location.pathname === '/profile'
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 inline-block mr-1" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    location.pathname === '/settings'
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 inline-block mr-1" />
                  Settings
                </Link>
              </>
            )}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button size="sm" className="text-sm" onClick={handleAuthClick}>
              {user ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[100] ${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div className="fixed inset-y-0 right-0 z-[101] w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img 
                src="/aipaflow-logo.png" 
                alt="AipaFlow"
                className="h-8 w-auto"
                style={{ 
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <React.Fragment key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          className={`flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-800 ${
                            mobileActiveDropdown === item.name ? 'text-white' : 'text-gray-300'
                          }`}
                          onClick={() => setMobileActiveDropdown(
                            mobileActiveDropdown === item.name ? null : item.name
                          )}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-5 w-5 flex-none transition-transform duration-200 ${
                              mobileActiveDropdown === item.name ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        {mobileActiveDropdown === item.name && (
                          <div className="mt-2 space-y-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-gray-800 ${
                                  location.pathname === child.href ? 'text-white bg-gray-800' : 'text-gray-300'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`block rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-800 ${
                          location.pathname === item.href ? 'text-white bg-gray-800' : 'text-gray-300'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`block rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-800 ${
                        location.pathname === '/dashboard' ? 'text-primary-400' : 'text-gray-300'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className={`block rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-800 ${
                        location.pathname === '/profile' ? 'text-primary-400' : 'text-gray-300'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 inline-block mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className={`block rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-800 ${
                        location.pathname === '/settings' ? 'text-primary-400' : 'text-gray-300'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 inline-block mr-2" />
                      Settings
                    </Link>
                  </>
                )}
              </div>
              <div className="py-6">
                <Button
                  className="w-full text-base"
                  onClick={() => {
                    handleAuthClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  {user ? (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}