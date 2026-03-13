/*
  # Alter duration_days column type from integer to text

  ## Changes
  - `personalized_trip_requests.duration_days`: changed from integer to text
    so it can store free-text values like "7 days", "2 weeks", "Flexible", etc.
*/

ALTER TABLE personalized_trip_requests
  ALTER COLUMN duration_days TYPE text USING duration_days::text;
