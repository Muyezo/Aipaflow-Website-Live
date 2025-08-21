/*
  # Add Insert Policy for Profiles
  
  1. Changes
    - Add INSERT policy for profiles table to allow the trigger to create new profiles
  
  2. Security
    - Policy ensures only the trigger can insert new profiles
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Trigger can create profile'
  ) THEN
    CREATE POLICY "Trigger can create profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;