-- Drop existing view if it exists
DROP VIEW IF EXISTS blog_posts_with_author;

-- Create view for blog posts with author information
CREATE VIEW blog_posts_with_author AS
SELECT 
  p.id,
  p.title,
  p.slug,
  p.content,
  p.excerpt,
  p.featured_image,
  p.status,
  p.published_at,
  p.tags,
  p.created_at,
  p.updated_at,
  p.author_id,
  jsonb_build_object(
    'id', pr.id,
    'email', pr.email,
    'full_name', pr.full_name,
    'role', pr.role
  ) as author
FROM blog_posts p
LEFT JOIN profiles pr ON p.author_id = pr.id;

-- Grant access to the view
GRANT SELECT ON blog_posts_with_author TO authenticated;
GRANT SELECT ON blog_posts_with_author TO anon;

-- Create policies for the base table
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