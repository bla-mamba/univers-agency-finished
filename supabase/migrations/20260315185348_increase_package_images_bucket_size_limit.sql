/*
  # Increase package-images bucket file size limit

  ## Summary
  Raises the maximum allowed file size for the `package-images` storage bucket
  from 10 MB to 200 MB so that MP4 video uploads do not exceed the limit.

  ## Changes
  - `package-images` bucket: file_size_limit increased from 10485760 (10 MB) to 209715200 (200 MB)
*/

UPDATE storage.buckets
SET file_size_limit = 209715200
WHERE id = 'package-images';
