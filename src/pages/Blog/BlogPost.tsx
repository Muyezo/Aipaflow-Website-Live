import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon, Edit2, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBlog } from '@/hooks/useBlog';
import type { BlogPost } from '@/types/database';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { getBlogPost, deleteBlogPost } = useBlog();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      loadPost();
    }
    checkAdminStatus();
  }, [slug]);

  async function checkAdminStatus() {
    if (!supabase || !user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  }

  async function loadPost() {
    if (!slug) return;

    try {
      const data = await getBlogPost(slug);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!post?.id) return;

    try {
      await deleteBlogPost(post.id);
      navigate('/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 text-center text-gray-300">
            Loading post...
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 text-center text-red-400">
            {error || 'Post not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - AipaFlow Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="min-h-screen">
        {/* Hero Section */}
        <header className="relative h-[70vh] min-h-[600px] flex items-center">
          <div className="absolute inset-0">
            <img
              src={post.featured_image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </button>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                {post.title}
              </h1>

              <div className="flex items-center justify-center gap-6 text-gray-100 mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {post.author?.full_name && (
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {post.author.full_name}
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/blog/edit/${post.slug}`)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-400 hover:text-red-300 border-red-400/20 hover:border-red-300/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </header>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert mx-auto [&>p]:text-gray-100 [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>h5]:text-white [&>h6]:text-white [&>ul]:text-gray-100 [&>ol]:text-gray-100 [&>blockquote]:text-gray-100 [&>pre]:bg-gray-900 [&>pre]:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <TagIcon className="w-5 h-5 text-gray-300" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative glass-card p-8 max-w-md w-full rounded-lg shadow-xl"
            >
              <h3 className="text-xl font-display font-bold text-white mb-4">
                Delete Post
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}