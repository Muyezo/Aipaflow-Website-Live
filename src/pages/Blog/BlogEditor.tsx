import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X, Image as ImageIcon, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBlog } from '@/hooks/useBlog';
import type { BlogPost } from '@/types/database';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/lib/supabase';

// Suppress findDOMNode warning for ReactQuill
const consoleError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes('findDOMNode')) return;
  consoleError(...args);
};

// Predefined categories
const predefinedCategories = [
  'AI & Technology',
  'Customer Service',
  'Business',
  'Marketing',
  'Industry Insights',
  'Case Studies',
  'Automation',
  'Innovation',
  'Best Practices',
  'Tutorials',
];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video', 'blockquote', 'code-block'],
    ['clean']
  ],
};

const STORAGE_BUCKET = 'blog-images';

export function BlogEditor() {
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBlogPost, createBlogPost, updateBlogPost } = useBlog();

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    tags: [],
    status: 'draft',
  });
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setcategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  async function loadPost() {
    try {
      const data = await getBlogPost(slug);
      if (data) {
        setPost(data);
        setOriginalPost(data); // Store the original post data
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Storage is not configured');
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Update the post state with the new image URL
      setPost(prev => ({
        ...prev,
        featured_image: publicUrl,
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published') => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!post.title || !post.content) {
        throw new Error('Title and content are required');
      }

      const postData = {
        ...post,
        status: status || post.status,
        slug: post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published_at: status === 'published' ? new Date().toISOString() : null,
      };

      if (originalPost?.id) {
        // Update existing post
        const updatedPost = await updateBlogPost(originalPost.id, postData);
        if (!updatedPost) {
          throw new Error('Failed to update post');
        }
      } else {
        // Create new post
        const newPost = await createBlogPost(postData as any);
        if (!newPost) {
          throw new Error('Failed to create post');
        }
      }

      navigate('/blog');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !post.tags?.includes(tag)) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  const handleCategorySelect = (category: string) => {
    setcategoryInput(category);
    setShowCategoryDropdown(false);
    if (!post.tags?.includes(category)) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), category],
      }));
    }
  };

  return (
    <>
      <Helmet>
        <title>{slug ? 'Edit Post' : 'New Post'} - AipaFlow</title>
      </Helmet>

      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-white">
              {slug ? 'Edit Post' : 'New Post'}
            </h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/blog')}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={loading}
              >
                Publish
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 min-h-[800px]"
            style={{ zIndex: 1 }}
          >
            <form className="space-y-6 pb-24">
              <div className="relative z-20">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter post title"
                />
              </div>

              <div className="relative z-20">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the post"
                />
              </div>

              <div className="relative z-20">
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <div className="prose-editor-wrapper">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={post.content}
                    onChange={(content) => setPost(prev => ({ ...prev, content }))}
                    modules={modules}
                    className="bg-white/10 rounded-lg text-white"
                    style={{ 
                      minHeight: '300px',
                      marginBottom: '50px'
                    }}
                  />
                </div>
              </div>

              <div className="relative z-20">
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image
                </label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    id="featured_image"
                    value={post.featured_image || ''}
                    onChange={(e) => setPost(prev => ({ ...prev, featured_image: e.target.value }))}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter image URL or use Browse"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={handleBrowseClick}
                    disabled={uploadingImage}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Browse'}
                  </Button>
                </div>
                {post.featured_image && (
                  <div className="mt-4">
                    <img
                      src={post.featured_image}
                      alt="Featured"
                      className="max-w-xs rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>

              <div className="relative z-20">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categories & Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-500/20 text-primary-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-300 hover:text-primary-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => {
                        setcategoryInput(e.target.value);
                        setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Add a category"
                    />
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-gray-900 border border-white/20 shadow-lg z-30">
                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                          {predefinedCategories
                            .filter(cat => cat.toLowerCase().includes(categoryInput.toLowerCase()))
                            .map(category => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded"
                              >
                                {category}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a custom tag"
                  />
                  <Button variant="outline" type="button" onClick={addTag}>
                    <TagIcon className="w-4 h-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}