/*
  # Add is_admin flag and seed sample users

  1. Changes
    - Add `is_admin` boolean column to profiles as a convenient alias for role = 'admin'
    - Add trigger to keep is_admin in sync with the role column
    - Seed sample users: 2 normal customers and 1 admin

  2. Notes
    - is_admin is derived from role; updating either keeps them consistent
    - Sample users are created via auth.users and profiles inserts
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

UPDATE profiles SET is_admin = (role = 'admin');

CREATE OR REPLACE FUNCTION sync_is_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    NEW.is_admin := (NEW.role = 'admin');
  END IF;
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    NEW.role := CASE WHEN NEW.is_admin THEN 'admin' ELSE 'customer' END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_is_admin ON profiles;
CREATE TRIGGER trg_sync_is_admin
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_is_admin();

DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@travelagency.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@travelagency.com',
      crypt('Admin1234!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin User"}',
      false, '', '', '', ''
    );

    INSERT INTO profiles (id, full_name, role, is_admin)
    VALUES (admin_id, 'Admin User', 'admin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin', is_admin = true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alice@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      user1_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'alice@example.com',
      crypt('Alice1234!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Alice Johnson"}',
      false, '', '', '', ''
    );

    INSERT INTO profiles (id, full_name, role, is_admin)
    VALUES (user1_id, 'Alice Johnson', 'customer', false)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bob@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      user2_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'bob@example.com',
      crypt('Bob12345!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Bob Smith"}',
      false, '', '', '', ''
    );

    INSERT INTO profiles (id, full_name, role, is_admin)
    VALUES (user2_id, 'Bob Smith', 'customer', false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
