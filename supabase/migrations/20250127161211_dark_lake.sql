-- Drop existing policies to start fresh
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for profiles" ON profiles;
  DROP POLICY IF EXISTS "Enable profile creation" ON profiles;
  DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
  DROP POLICY IF EXISTS "Trigger can create profile" ON profiles;
END $$;

-- Create new public insert policy
CREATE POLICY "Public profiles insert"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update the user creation trigger function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  -- Create user settings
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error details
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Add error handling to the updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_updated_at: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;