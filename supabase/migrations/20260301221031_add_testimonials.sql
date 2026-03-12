/*
  # Add Testimonials Table

  ## Summary
  Creates a testimonials table for homepage social proof section, 
  fully controllable from the admin panel.

  ## New Tables
  - `testimonials`
    - `id` (uuid, primary key)
    - `name` (text) - Customer name
    - `location` (text) - City/Country of customer
    - `avatar_url` (text, nullable) - Optional profile photo URL
    - `rating` (int, 1-5) - Star rating
    - `message` (text) - Testimonial content
    - `package_name` (text, nullable) - Which package they traveled on
    - `travel_date` (text, nullable) - e.g. "March 2024"
    - `is_featured` (boolean) - Show on homepage
    - `display_order` (int) - Controls sort order on homepage
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public can read featured testimonials
  - Admins (via profiles.role = 'admin') can insert, update, delete
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  avatar_url text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  package_name text,
  travel_date text,
  is_featured boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read featured testimonials"
  ON testimonials FOR SELECT
  USING (is_featured = true);

CREATE POLICY "Admins can read all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials (is_featured, display_order);

INSERT INTO testimonials (name, location, rating, message, package_name, travel_date, is_featured, display_order) VALUES
  ('Sarah Johnson', 'New York, USA', 5, 'Absolutely breathtaking experience! The Bali package was perfectly organized. Every detail was taken care of and our guide was incredibly knowledgeable. I came back feeling refreshed and already planning my next trip.', 'Bali Paradise Escape', 'January 2025', true, 1),
  ('Marco Rossi', 'Milan, Italy', 5, 'The Maldives honeymoon package exceeded all our expectations. The overwater villa was stunning, the snorkeling tours were unforgettable, and the Wanderlust team handled everything seamlessly. Truly magical.', 'Maldives Honeymoon', 'February 2025', true, 2),
  ('Aisha Patel', 'London, UK', 5, 'I was nervous about solo travel but Wanderlust made me feel safe and supported the entire time. The Japan cultural tour was eye-opening — temples, street food, and cherry blossoms. Life-changing!', 'Japan Cultural Journey', 'March 2025', true, 3),
  ('David Kim', 'Toronto, Canada', 4, 'Fantastic value for money. The Safari package in Kenya was well-organized with excellent game drives. Saw the Big Five on day two! Minor hiccup with one hotel check-in but the team sorted it quickly.', 'Kenya Safari Adventure', 'December 2024', true, 4),
  ('Elena Vasquez', 'Buenos Aires, Argentina', 5, 'Third time booking with Wanderlust and they never disappoint. The Santorini package was pure magic — white-washed buildings, incredible sunsets, and the most delicious food. Already booked my fourth trip!', 'Santorini Sunset Escape', 'October 2024', true, 5),
  ('James Osei', 'Accra, Ghana', 5, 'The Morocco desert adventure was unlike anything I have ever experienced. Sleeping under the stars in the Sahara, riding camels, exploring the medinas — every moment was perfect. Wanderlust truly delivers.', 'Morocco Desert Adventure', 'November 2024', true, 6);
