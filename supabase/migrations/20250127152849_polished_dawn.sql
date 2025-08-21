/*
  # Fix User Creation and Settings

  1. Changes
    - Safely handle existing policies
    - Add missing policies for user creation
    - Ensure proper user_settings setup
    - Update trigger functions

  2. Security
    - Maintain RLS on all tables
    - Add proper policies for data access
*/

-- Safely drop and recreate insert policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for profiles" ON profiles;
  DROP POLICY IF EXISTS "Enable profile creation" ON profiles;
  DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
END $$;

-- Create new insert policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Public profiles insert'
  ) THEN
    CREATE POLICY "Public profiles insert"
      ON profiles
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Ensure user_settings table exists with proper structure
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

-- Enable RLS on user_settings if not already enabled
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Safely create user_settings policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public user_settings insert" ON user_settings;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Public user_settings insert'
  ) THEN
    CREATE POLICY "Public user_settings insert"
      ON user_settings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

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
END $$;

-- Update trigger functions
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update triggers
DROP TRIGGER IF EXISTS set_user_settings_updated_at ON user_settings;
CREATE TRIGGER set_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Ensure auth trigger exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;