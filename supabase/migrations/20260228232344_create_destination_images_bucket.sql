/*
  # Create destination-images storage bucket

  1. New Storage Bucket
    - `destination-images`: Public bucket for destination photos
      - Max file size: 10MB
      - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

  2. Security
    - Public read access so destination images display on the website
    - Admin-only write access (upload, update, delete) based on profiles.role or is_admin flag
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'destination-images',
  'destination-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view destination images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'destination-images');

CREATE POLICY "Admins can upload destination images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'destination-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.is_admin = true)
    )
  );

CREATE POLICY "Admins can update destination images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'destination-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.is_admin = true)
    )
  )
  WITH CHECK (
    bucket_id = 'destination-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.is_admin = true)
    )
  );

CREATE POLICY "Admins can delete destination images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'destination-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.is_admin = true)
    )
  );
