-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_blog_post_with_author;

-- Create function to get blog post with author
CREATE OR REPLACE FUNCTION get_blog_post_with_author(post_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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

-- Create function to get blog posts with authors
CREATE OR REPLACE FUNCTION get_blog_posts_with_authors()
RETURNS SETOF jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
  LEFT JOIN profiles pr ON p.author_id = pr.id;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_blog_post_with_author TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_post_with_author TO anon;
GRANT EXECUTE ON FUNCTION get_blog_posts_with_authors TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_posts_with_authors TO anon;

-- Update blog posts policies
DROP POLICY IF EXISTS "anyone_can_read_published_posts" ON blog_posts;
CREATE POLICY "anyone_can_read_published_posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "authenticated_can_read_own_posts" ON blog_posts;
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