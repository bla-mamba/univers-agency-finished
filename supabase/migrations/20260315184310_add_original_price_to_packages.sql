/*
  # Add original_price to packages table

  ## Summary
  Adds an optional `original_price` column to the `packages` table to support
  displaying a "from X to Y" discounted price format on packages.

  ## Changes
  ### Modified Tables
  - `packages`
    - `original_price` (decimal, nullable): The original/crossed-out price before discount.
      When set, the UI shows the original_price with a strikethrough and `price` as the current offer price.
      When null, only `price` is displayed normally.

  ## Notes
  - Nullable so existing packages are unaffected
  - No RLS changes needed; inherits existing package policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE packages ADD COLUMN original_price decimal(10,2) DEFAULT NULL;
  END IF;
END $$;
