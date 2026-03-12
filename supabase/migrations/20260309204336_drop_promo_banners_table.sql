/*
  # Drop promo_banners table

  ## Summary
  Removes the promo_banners table and all associated data and policies.

  ## Changes
  - Drops the `promo_banners` table entirely
*/

DROP TABLE IF EXISTS promo_banners CASCADE;
