/*
  # Fix Profile Creation Process
  
  1. Changes
    - Drop existing insert policies
    - Create a new insert policy
    - Ensure user_settings table and triggers exist
  
  2. Security
    - Allows profile creation during signup
    - Maintains RLS security
*/

-- Drop existing insert policies
DROP POLICY IF EXISTS "Enable insert for profiles" ON profiles;
DROP POLICY IF EXISTS "Trigger can create profile" ON profiles;

-- Create new insert policy
CREATE POLICY "Enable profile creation"
  ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  notifications jsonb NOT NULL DEFAULT '{
    "email": true,
    "appointments": true,
    "marketing": false
  }',
  preferences jsonb NOT NULL DEFAULT '{
    "theme": "dark",
    "language": "en",
    "timezone": "UTC"
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create user_settings policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can read own settings'
  ) THEN
    CREATE POLICY "Users can read own settings"
      ON user_settings
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can update own settings'
  ) THEN
    CREATE POLICY "Users can update own settings"
      ON user_settings
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Enable settings creation'
  ) THEN
    CREATE POLICY "Enable settings creation"
      ON user_settings
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Create or replace the user settings handler function
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the profile creation trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_profile_created'
  ) THEN
    CREATE TRIGGER on_profile_created
      AFTER INSERT ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user_settings();
  END IF;
END $$;