import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types/database';
import { useAuth } from '@/lib/auth';

export function useBlog() {
  const { user } = useAuth();

  const getBlogPosts = useCallback(async (options?: {
    status?: 'draft' | 'published';
    authorId?: string;
    limit?: number;
    offset?: number;
  }) => {
    if (!supabase) return { data: [], count: 0 };

    try {
      let query = supabase
        .from('blog_posts')
        .select('*, author:profiles(id, email, full_name, role)', { count: 'exact' });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.authorId) {
        query = query.eq('author_id', options.authorId);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data as BlogPost[], count: count || 0 };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }, []);

  const getBlogPost = useCallback(async (slug: string) => {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:profiles(id, email, full_name, role)')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return data as BlogPost;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }, []);

  const createBlogPost = useCallback(async (post: Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at'>) => {
    if (!supabase || !user) {
      throw new Error('Not authenticated');
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Only admin users can create blog posts');
      }

      // Ensure slug is unique
      const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...post,
          slug: finalSlug,
          author_id: user.id,
          status: post.status || 'draft',
          published_at: post.status === 'published' ? new Date().toISOString() : null
        })
        .select('*, author:profiles(id, email, full_name, role)')
        .single();

      if (error) throw error;

      return data as BlogPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }, [user]);

  const updateBlogPost = useCallback(async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at'>>) => {
    if (!supabase || !user) {
      throw new Error('Not authenticated');
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Only admin users can update blog posts');
      }

      // If status is being updated to published, set published_at
      const updateData = {
        ...updates,
        published_at: updates.status === 'published' ? new Date().toISOString() : undefined
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select('*, author:profiles(id, email, full_name, role)')
        .single();

      if (error) throw error;

      return data as BlogPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }, [user]);

  const deleteBlogPost = useCallback(async (id: string) => {
    if (!supabase || !user) {
      throw new Error('Not authenticated');
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        throw new Error('Only admin users can delete blog posts');
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }, [user]);

  return {
    getBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
  };
}