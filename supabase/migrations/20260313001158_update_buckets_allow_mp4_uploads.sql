/*
  # Update storage buckets to allow MP4 video uploads

  1. Changes
    - Update `destination-images` bucket to accept video/mp4 in addition to images
    - Update `package-images` bucket to accept video/mp4 in addition to images

  2. Notes
    - Existing image uploads remain unaffected
    - Videos are stored in the same buckets as images
*/

UPDATE storage.buckets
SET allowed_mime_types = array_append(
  COALESCE(allowed_mime_types, ARRAY[]::text[]),
  'video/mp4'
)
WHERE id = 'destination-images'
  AND NOT ('video/mp4' = ANY(COALESCE(allowed_mime_types, ARRAY[]::text[])));

UPDATE storage.buckets
SET allowed_mime_types = array_append(
  COALESCE(allowed_mime_types, ARRAY[]::text[]),
  'video/mp4'
)
WHERE id = 'package-images'
  AND NOT ('video/mp4' = ANY(COALESCE(allowed_mime_types, ARRAY[]::text[])));
