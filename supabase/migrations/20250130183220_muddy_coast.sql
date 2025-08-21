/*
  # Fix blog post author relationship

  1. Changes
    - Add foreign key constraint for author_id
    - Update RLS policies to include author relationship
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'blog_posts_author_id_fkey'
  ) THEN
    ALTER TABLE blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Create or replace the view for blog posts with author information
CREATE OR REPLACE VIEW blog_posts_with_author AS
SELECT 
  posts.*,
  profiles.email as author_email,
  profiles.full_name as author_name,
  profiles.role as author_role
FROM blog_posts posts
LEFT JOIN profiles ON posts.author_id = profiles.id;

-- Update policies to use the view
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts
  FOR SELECT
  USING (
    status = 'published'
  );

DROP POLICY IF EXISTS "Authors can read own posts" ON blog_posts;
CREATE POLICY "Authors can read own posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid()
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_status 
ON blog_posts(author_id, status);

-- Grant necessary permissions
GRANT SELECT ON blog_posts_with_author TO authenticated;
GRANT SELECT ON blog_posts_with_author TO anon;