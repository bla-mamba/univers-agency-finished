/*
  # Reassign packages to new categories

  Moves all existing packages from old legacy categories (sort_order 99) to the
  new structured categories (sort_order 1-8) based on package content.

  Mapping:
  - Adventure (old) → Adventure & Outdoor
  - Luxury (old) → Honeymoon & Romantic
  - Cultural (old) → 3+ Day Cultural Trips
  - Wildlife & Nature (old) → Adventure & Outdoor
  - Beach & Relaxation (old) → Beach Packages
  - Family (old) → Family Getaways

  After reassignment, the old legacy categories are deleted.
*/

UPDATE packages
SET category_id = 'ade2171a-3d52-4694-8627-e42cccf48b6b'
WHERE category_id = '64615432-1148-46f4-ba2e-52ee933f74a9';

UPDATE packages
SET category_id = 'f5abd576-55c4-4dfc-9e8a-3aea5d83970c'
WHERE category_id = 'd1c15e5c-d46b-4752-8691-5aa2726d104f';

UPDATE packages
SET category_id = 'ddc40fab-995f-420d-a297-d23e28c7045d'
WHERE category_id = 'f656b71b-f3be-4801-8a04-da87fce88a48';

UPDATE packages
SET category_id = 'ade2171a-3d52-4694-8627-e42cccf48b6b'
WHERE category_id = 'c78b8a9f-f360-41f0-bd92-255629116ad8';

UPDATE packages
SET category_id = 'dd15903d-1a34-4b30-a6f0-bab5ee97353a'
WHERE category_id = '36e4f723-6807-4048-b90b-6a7b8fe1a75a';

UPDATE packages
SET category_id = 'e486b899-9232-4d3d-b8d1-b8f3128e5503'
WHERE category_id = 'c833586f-001f-455e-8116-8f2090c9d36d';

DELETE FROM categories WHERE id IN (
  '64615432-1148-46f4-ba2e-52ee933f74a9',
  'd1c15e5c-d46b-4752-8691-5aa2726d104f',
  'f656b71b-f3be-4801-8a04-da87fce88a48',
  'c78b8a9f-f360-41f0-bd92-255629116ad8',
  '36e4f723-6807-4048-b90b-6a7b8fe1a75a',
  'c833586f-001f-455e-8116-8f2090c9d36d'
);
