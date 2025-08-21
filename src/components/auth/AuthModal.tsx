import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Please connect your Supabase project first');
      }

      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (isSignIn) {
        await signIn(email, password);
        onClose();
        setEmail('');
        setPassword('');
      } else {
        await signUp(email, password);
        setError('');
        alert('Account created successfully! You can now sign in.');
        setIsSignIn(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error(isSignIn ? 'Sign in error:' : 'Sign up error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(isSignIn ? 'Invalid email or password' : 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-card rounded-xl shadow-xl z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="absolute right-4 top-4 z-[10001]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-6 relative z-[10001]">
                  {isSignIn ? 'Sign In' : 'Create Account'}
                </h3>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 relative z-[10001]">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 relative z-[10001]">
                  <div className="relative z-[10002]">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      style={{ isolation: 'isolate' }}
                    />
                  </div>

                  <div className="relative z-[10002]">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      autoComplete={isSignIn ? "current-password" : "new-password"}
                      style={{ isolation: 'isolate' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full relative z-[10002]"
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-4 text-center relative z-[10001]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignIn(!isSignIn);
                      setError('');
                      setEmail('');
                      setPassword('');
                    }}
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}