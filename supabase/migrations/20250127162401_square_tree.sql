/*
  # Fix Profile Access and Creation

  1. Changes
    - Add public select policy for profiles
    - Make handle_new_user function more robust
    - Add better error handling and logging
    - Ensure proper cascading for user settings

  2. Security
    - Maintain RLS while allowing necessary access
    - Add proper error handling
*/

-- Drop existing policies to start fresh
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
END $$;

-- Create new policies
CREATE POLICY "Public profiles select"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Public profiles insert"
  ON profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Update the user creation trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  _profile_id uuid;
BEGIN
  -- Create profile with retry logic
  FOR i IN 1..3 LOOP
    BEGIN
      INSERT INTO profiles (id, email)
      VALUES (NEW.id, NEW.email)
      ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email
      RETURNING id INTO _profile_id;

      -- If profile was created successfully, create settings
      IF _profile_id IS NOT NULL THEN
        INSERT INTO user_settings (user_id)
        VALUES (_profile_id)
        ON CONFLICT (user_id) DO NOTHING;
        
        RETURN NEW;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      IF i = 3 THEN
        RAISE WARNING 'Failed to create profile after 3 attempts: % %', SQLERRM, SQLSTATE;
      END IF;
    END;
    -- Wait a short time before retrying
    PERFORM pg_sleep(0.1);
  END LOOP;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Add cascade delete trigger for cleanup
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM user_settings WHERE user_id = OLD.id;
  DELETE FROM profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_deletion();