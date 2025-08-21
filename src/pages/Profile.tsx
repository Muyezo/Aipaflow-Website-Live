import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useDatabase';
import type { Profile } from '@/types/database';
import { Helmet } from 'react-helmet-async';

export function ProfilePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { getProfile, updateProfile } = useProfile();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateProfile({ full_name: fullName });
      if (updated) {
        setProfile(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 text-center text-gray-400">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - AipaFlow</title>
        <meta
          name="description"
          content="Manage your AipaFlow profile settings and preferences."
        />
      </Helmet>

      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">
                  Profile Settings
                </h1>
                <p className="text-gray-400">
                  Manage your account information
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  disabled
                />
                <p className="mt-1 text-sm text-gray-400">
                  Your email address cannot be changed
                </p>
              </div>

              <div className="relative">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 relative z-20"
                  placeholder="Enter your full name"
                  style={{ isolation: 'isolate' }}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full sm:w-auto relative z-20">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}