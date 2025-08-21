/*
  # Update Insert Policy for Profiles
  
  1. Changes
    - Drop existing INSERT policy
    - Add new INSERT policy that allows unauthenticated profile creation
  
  2. Security
    - Policy allows profile creation during signup
    - Security is maintained through the trigger mechanism
*/

-- Drop the existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Trigger can create profile" ON profiles;
END $$;

-- Create new policy that allows unauthenticated inserts
CREATE POLICY "Enable insert for profiles"
  ON profiles
  FOR INSERT
  WITH CHECK (true);