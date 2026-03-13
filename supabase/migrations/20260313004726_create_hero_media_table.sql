/*
  # Create hero_media table

  ## Summary
  Stores hero section media (image or video) for each page of the site.
  Admins can manage hero content per page from the CRM.

  ## New Tables
  - `hero_media`
    - `id` (uuid, primary key)
    - `page_key` (text, unique) - identifier for the page (e.g. 'home', 'about', 'blog', etc.)
    - `media_type` (text) - either 'image' or 'video'
    - `url` (text) - URL of the image or video
    - `overlay_opacity` (numeric) - 0.0 to 1.0 overlay darkness
    - `updated_at` (timestamptz)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS
  - Public SELECT allowed (heroes are public content)
  - Only authenticated admins can INSERT/UPDATE/DELETE (checked via profiles.is_admin)

  ## Seed Data
  Inserts default values matching current hardcoded URLs for all pages.
*/

CREATE TABLE IF NOT EXISTS hero_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url text NOT NULL,
  overlay_opacity numeric NOT NULL DEFAULT 0.6 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero media"
  ON hero_media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert hero media"
  ON hero_media FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update hero media"
  ON hero_media FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete hero media"
  ON hero_media FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

INSERT INTO hero_media (page_key, media_type, url, overlay_opacity) VALUES
  ('home',         'video', '/trip.mp4', 0.6),
  ('about',        'image', 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6),
  ('blog',         'image', 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.65),
  ('offers',       'image', 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6),
  ('contact',      'image', 'https://images.pexels.com/photos/1591382/pexels-photo-1591382.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6),
  ('packages',     'image', 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6),
  ('destinations', 'image', 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6),
  ('gallery',      'image', 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.7),
  ('faq',          'image', 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920', 0.6)
ON CONFLICT (page_key) DO NOTHING;
