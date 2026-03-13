/*
  # Add order field to categories and seed 8 standard package categories

  1. Changes to categories table
    - Add `sort_order` (integer) column for controlling display order in menus
    - Add `icon` (text) column for storing icon name reference

  2. Seeded categories (8 items matching navbar dropdown design)
    - Beach Packages
    - Cultural Weekends
    - 3+ Day Cultural Trips
    - Excursions – 1 Day Trips
    - Adventure & Outdoor
    - Family Getaways
    - Honeymoon & Romantic
    - Personalized Trip

  3. Notes
    - Uses ON CONFLICT (slug) DO UPDATE so re-running is safe
    - Existing categories with matching slugs will have sort_order and icon updated
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order integer DEFAULT 99;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'icon'
  ) THEN
    ALTER TABLE categories ADD COLUMN icon text DEFAULT '';
  END IF;
END $$;

INSERT INTO categories (name, slug, description, sort_order, icon)
VALUES
  ('Beach Packages', 'beach-packages', 'Sun, sea and sand — curated coastal escapes along the Mediterranean and Adriatic.', 1, 'Waves'),
  ('Cultural Weekends', 'cultural-weekends', 'Short 2-day cultural breaks exploring historic cities, local cuisine and heritage sites.', 2, 'Landmark'),
  ('3+ Day Cultural Trips', 'cultural-trips', 'Immersive multi-day journeys through culture, history and authentic local experiences.', 3, 'Map'),
  ('Excursions – 1 Day Trips', 'excursions', 'Expertly guided single-day excursions from your base — no overnight stay required.', 4, 'Compass'),
  ('Adventure & Outdoor', 'adventure-outdoor', 'Hiking, trekking, water sports and adrenaline activities for the active traveler.', 5, 'Mountain'),
  ('Family Getaways', 'family-getaways', 'Child-friendly programs designed for families with activities suited to all ages.', 6, 'Users'),
  ('Honeymoon & Romantic', 'honeymoon-romantic', 'Romantic escapes and honeymoon packages with special touches for couples.', 7, 'Heart'),
  ('Personalized Trip', 'personalized-trip', 'Fully bespoke itineraries designed around your preferences, dates and budget.', 8, 'Sparkles')
ON CONFLICT (slug) DO UPDATE
  SET sort_order = EXCLUDED.sort_order,
      icon = EXCLUDED.icon,
      description = EXCLUDED.description;
