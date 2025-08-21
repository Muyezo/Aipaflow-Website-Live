import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useNewsletter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email });

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('This email is already subscribed to our newsletter');
        }
        throw error;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to newsletter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subscribe,
    loading,
    error,
    success,
  };
}