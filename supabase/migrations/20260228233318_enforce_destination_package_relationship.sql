/*
  # Enforce destination-package relationship

  ## Summary
  Packages must always belong to a destination. This migration:
  1. Makes packages.destination_id NOT NULL (a package must belong to a destination)
  2. Replaces ON DELETE SET NULL with ON DELETE RESTRICT so deleting a destination
     with packages is blocked at the database level.
*/

ALTER TABLE packages
  ALTER COLUMN destination_id SET NOT NULL;

DO $$
DECLARE
  fk_name text;
BEGIN
  SELECT kcu.constraint_name INTO fk_name
  FROM information_schema.key_column_usage kcu
  JOIN information_schema.referential_constraints rc
    ON rc.constraint_name = kcu.constraint_name
  WHERE kcu.table_name = 'packages'
    AND kcu.column_name = 'destination_id'
  LIMIT 1;

  IF fk_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE packages DROP CONSTRAINT ' || quote_ident(fk_name);
  END IF;
END $$;

ALTER TABLE packages
  ADD CONSTRAINT packages_destination_id_fkey
  FOREIGN KEY (destination_id)
  REFERENCES destinations(id)
  ON DELETE RESTRICT;
