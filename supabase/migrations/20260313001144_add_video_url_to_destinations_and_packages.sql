/*
  # Add video_url to destinations and packages

  1. Changes
    - `destinations` table: add `video_url` (text, nullable) column for MP4 video
    - `packages` table: add `video_url` (text, nullable) column for MP4 video

  2. Notes
    - Both columns are optional (nullable)
    - Videos will be stored in the existing destination-images and package-images buckets
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'destinations' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE destinations ADD COLUMN video_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE packages ADD COLUMN video_url text;
  END IF;
END $$;
