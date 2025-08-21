-- Drop existing views and tables
DROP VIEW IF EXISTS blog_posts_with_authors CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create blog_posts table with explicit foreign key naming
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id)
    REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Create RLS policies
CREATE POLICY "anyone_can_read_published"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "admins_can_read_all"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "admins_can_insert"
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

CREATE POLICY "admins_can_update"
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

CREATE POLICY "admins_can_delete"
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_blog_updated_at();

-- Create function to get blog post with author
CREATE OR REPLACE FUNCTION get_blog_post_with_author(post_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', p.id,
    'author_id', p.author_id,
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
  JOIN profiles pr ON p.author_id = pr.id
  WHERE p.id = post_id;
$$;

-- Grant permissions
GRANT SELECT ON blog_posts TO authenticated;
GRANT SELECT ON blog_posts TO anon;
GRANT INSERT, UPDATE, DELETE ON blog_posts TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_post_with_author TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_post_with_author TO anon;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';