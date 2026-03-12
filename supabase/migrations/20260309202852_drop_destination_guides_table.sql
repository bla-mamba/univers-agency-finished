/*
  # Drop destination_guides table

  ## Summary
  Removes the destination_guides table and all associated data, policies, and indexes.

  ## Changes
  - Drops the `destination_guides` table entirely including all its data and policies
*/

DROP TABLE IF EXISTS destination_guides CASCADE;
