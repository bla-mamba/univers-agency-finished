/*
  # Create Personalized Trip Requests Table (v2)

  ## Summary
  Creates a table to store personalized trip/tour requests submitted by users via the
  dedicated Personalized Travel page. Each request captures all the details needed for
  the agency to prepare a custom itinerary.

  ## New Tables
  - `personalized_trip_requests`
    - `id` (uuid, primary key)
    - `user_id` (uuid, nullable FK to auth.users)
    - `full_name` (text)
    - `email` (text)
    - `phone` (text)
    - `destinations` (text)
    - `travel_dates` (text)
    - `duration` (text)
    - `group_size` (integer)
    - `group_type` (text)
    - `interests` (text[])
    - `accommodation_preference` (text)
    - `transport_preference` (text)
    - `budget_range` (text)
    - `special_requests` (text)
    - `status` (text) — pending | contacted | completed
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled with policies for authenticated users and admins
*/

CREATE TABLE IF NOT EXISTS personalized_trip_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  destinations text NOT NULL DEFAULT '',
  travel_dates text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  group_size integer NOT NULL DEFAULT 1,
  group_type text NOT NULL DEFAULT 'couple',
  interests text[] NOT NULL DEFAULT '{}',
  accommodation_preference text NOT NULL DEFAULT 'flexible',
  transport_preference text NOT NULL DEFAULT 'flexible',
  budget_range text NOT NULL DEFAULT '',
  special_requests text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE personalized_trip_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'personalized_trip_requests' AND policyname = 'Users can insert their own requests'
  ) THEN
    CREATE POLICY "Users can insert their own requests"
      ON personalized_trip_requests
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'personalized_trip_requests' AND policyname = 'Allow anonymous insert'
  ) THEN
    CREATE POLICY "Allow anonymous insert"
      ON personalized_trip_requests
      FOR INSERT
      TO anon
      WITH CHECK (user_id IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'personalized_trip_requests' AND policyname = 'Users can view their own requests'
  ) THEN
    CREATE POLICY "Users can view their own requests"
      ON personalized_trip_requests
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'personalized_trip_requests' AND policyname = 'Admins can view all requests'
  ) THEN
    CREATE POLICY "Admins can view all requests"
      ON personalized_trip_requests
      FOR SELECT
      TO authenticated
      USING (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'personalized_trip_requests' AND policyname = 'Admins can update all requests'
  ) THEN
    CREATE POLICY "Admins can update all requests"
      ON personalized_trip_requests
      FOR UPDATE
      TO authenticated
      USING (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      )
      WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
      );
  END IF;
END $$;
