/*
  # Create package-images Storage Bucket

  1. New Storage Bucket
    - `package-images`: public bucket for storing package photos uploaded via the admin CRM

  2. Security
    - Public read access so images render on the public website without auth
    - Authenticated admins can upload, update, and delete images
    - Non-admin authenticated users have no write access
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'package-images',
  'package-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view package images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'package-images');

CREATE POLICY "Admins can upload package images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'package-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update package images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'package-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete package images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'package-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
