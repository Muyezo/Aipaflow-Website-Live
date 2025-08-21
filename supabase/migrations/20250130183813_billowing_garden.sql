-- Drop existing view if it exists
DROP VIEW IF EXISTS blog_posts_with_author;

-- Ensure blog_posts table has correct structure
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can read own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can create posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON blog_posts;

-- Create new policies
CREATE POLICY "anyone_can_read_published_posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "authenticated_can_read_own_posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admins_can_create_posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admins_can_update_posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admins_can_delete_posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);

-- Update the blog posts hook to handle author relationship correctly
CREATE OR REPLACE FUNCTION get_blog_post_with_author(post_id uuid)
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT 
    jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'slug', p.slug,
      'content', p.content,
      'excerpt', p.excerpt,
      'featured_image', p.featured_image,
      'status', p.status,
      'published_at', p.published_at,
      'tags', p.tags,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'author', jsonb_build_object(
        'id', pr.id,
        'email', pr.email,
        'full_name', pr.full_name,
        'role', pr.role
      )
    )
  FROM blog_posts p
  LEFT JOIN profiles pr ON p.author_id = pr.id
  WHERE p.id = post_id;
$$;