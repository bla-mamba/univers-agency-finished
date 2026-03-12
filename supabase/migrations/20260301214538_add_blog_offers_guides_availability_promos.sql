/*
  # Add Blog, Offers, Guides, Availability, Promo Banners, Package Comparison

  ## New Tables

  ### 1. `blog_posts`
  - Travel tips, destination guides, top-10 lists
  - Fields: id, title, slug, excerpt, content, cover_image, author_name, category, tags, status, published_at, created_at, updated_at

  ### 2. `offers`
  - Promotional/discounted packages
  - Fields: id, package_id, title, description, discount_percent, discount_amount, original_price, sale_price, badge_text, valid_from, valid_until, is_active, created_at

  ### 3. `destination_guides`
  - Per-destination travel guides with visa, weather, currency, culture info
  - Fields: id, destination_id, visa_info, best_time_to_visit, currency, language, weather_info, culture_tips, health_safety, transportation, created_at, updated_at

  ### 4. `package_availability`
  - Available travel dates, seat limits per package
  - Fields: id, package_id, available_date, total_seats, booked_seats, is_blocked, notes, created_at

  ### 5. `promo_banners`
  - Admin-controlled announcement banners for the homepage
  - Fields: id, message, cta_text, cta_url, bg_color, text_color, is_active, starts_at, ends_at, created_at

  ## Security
  - RLS enabled on all tables
  - Public read for published/active content
  - Admin-only write access
*/

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'Wanderlust Team',
  category text NOT NULL DEFAULT 'Travel Tips',
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Offers
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  discount_percent integer DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  badge_text text NOT NULL DEFAULT 'Special Offer',
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active offers"
  ON offers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can read all offers"
  ON offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can insert offers"
  ON offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can update offers"
  ON offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can delete offers"
  ON offers FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE INDEX IF NOT EXISTS idx_offers_package_id ON offers(package_id);
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);

-- Destination Guides
CREATE TABLE IF NOT EXISTS destination_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid UNIQUE NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  visa_info text NOT NULL DEFAULT '',
  best_time_to_visit text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT '',
  weather_info text NOT NULL DEFAULT '',
  culture_tips text NOT NULL DEFAULT '',
  health_safety text NOT NULL DEFAULT '',
  transportation text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE destination_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read destination guides"
  ON destination_guides FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert destination guides"
  ON destination_guides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can update destination guides"
  ON destination_guides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can delete destination guides"
  ON destination_guides FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE INDEX IF NOT EXISTS idx_destination_guides_destination_id ON destination_guides(destination_id);

-- Package Availability
CREATE TABLE IF NOT EXISTS package_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  total_seats integer NOT NULL DEFAULT 10 CHECK (total_seats >= 0),
  booked_seats integer NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
  is_blocked boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(package_id, available_date)
);

ALTER TABLE package_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read package availability"
  ON package_availability FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert availability"
  ON package_availability FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can update availability"
  ON package_availability FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can delete availability"
  ON package_availability FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE INDEX IF NOT EXISTS idx_package_availability_package_id ON package_availability(package_id);
CREATE INDEX IF NOT EXISTS idx_package_availability_date ON package_availability(available_date);

-- Promo Banners
CREATE TABLE IF NOT EXISTS promo_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  bg_color text NOT NULL DEFAULT '#dc2626',
  text_color text NOT NULL DEFAULT '#ffffff',
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promo banners"
  ON promo_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can read all promo banners"
  ON promo_banners FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can insert promo banners"
  ON promo_banners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can update promo banners"
  ON promo_banners FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE POLICY "Admins can delete promo banners"
  ON promo_banners FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
  );

CREATE INDEX IF NOT EXISTS idx_promo_banners_is_active ON promo_banners(is_active);
