/*
  # Create hero-media storage bucket

  ## Summary
  Creates a public storage bucket for hero media files (images and videos).
  Admins can upload and delete files. Anyone can read/view them.

  ## Security
  - Bucket is public (files are readable without auth)
  - Only admins can upload (INSERT) or delete files
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-media',
  'hero-media',
  true,
  104857600,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/ogg','video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view hero media files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'hero-media');

CREATE POLICY "Admins can upload hero media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-media' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update hero media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-media' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete hero media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-media' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
