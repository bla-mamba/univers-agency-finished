-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT ''::text,
  slug text NOT NULL DEFAULT ''::text UNIQUE,
  excerpt text NOT NULL DEFAULT ''::text,
  content text NOT NULL DEFAULT ''::text,
  cover_image text NOT NULL DEFAULT ''::text,
  author_name text NOT NULL DEFAULT 'Wanderlust Team'::text,
  category text NOT NULL DEFAULT 'Travel Tips'::text,
  tags ARRAY NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text])),
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  package_id uuid,
  booking_date timestamp with time zone DEFAULT now(),
  travel_date date NOT NULL,
  num_travelers integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])),
  payment_status text NOT NULL DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'refunded'::text])),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT ''::text,
  special_requests text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  sort_order integer DEFAULT 99,
  icon text DEFAULT ''::text,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text NOT NULL,
  description text DEFAULT ''::text,
  image_url text DEFAULT ''::text,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  video_url text,
  CONSTRAINT destinations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hero_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  media_type text NOT NULL DEFAULT 'image'::text CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text])),
  url text NOT NULL,
  overlay_opacity numeric NOT NULL DEFAULT 0.6 CHECK (overlay_opacity >= 0::numeric AND overlay_opacity <= 1::numeric),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hero_media_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  package_id uuid,
  title text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  discount_percent integer DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  badge_text text NOT NULL DEFAULT 'Special Offer'::text,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id),
  CONSTRAINT offers_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);
CREATE TABLE public.package_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL,
  available_date date NOT NULL,
  total_seats integer NOT NULL DEFAULT 10 CHECK (total_seats >= 0),
  booked_seats integer NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
  is_blocked boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT package_availability_pkey PRIMARY KEY (id),
  CONSTRAINT package_availability_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);
CREATE TABLE public.package_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL,
  user_id uuid,
  reviewer_name text NOT NULL DEFAULT ''::text,
  reviewer_email text NOT NULL DEFAULT ''::text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT package_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT package_reviews_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id),
  CONSTRAINT package_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  destination_id uuid NOT NULL,
  category_id uuid,
  description text DEFAULT ''::text,
  itinerary jsonb DEFAULT '[]'::jsonb,
  price numeric NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 1,
  max_group_size integer DEFAULT 10,
  inclusions ARRAY DEFAULT ARRAY[]::text[],
  exclusions ARRAY DEFAULT ARRAY[]::text[],
  images ARRAY DEFAULT ARRAY[]::text[],
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  video_url text,
  original_price numeric DEFAULT NULL::numeric,
  CONSTRAINT packages_pkey PRIMARY KEY (id),
  CONSTRAINT packages_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT packages_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid,
  amount numeric NOT NULL,
  payment_method text DEFAULT ''::text,
  transaction_id text DEFAULT ''::text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.personalized_trip_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  phone text NOT NULL DEFAULT ''::text,
  travel_dates text NOT NULL DEFAULT ''::text,
  duration_days text,
  group_size integer NOT NULL DEFAULT 1,
  group_type text NOT NULL DEFAULT 'individual'::text,
  destinations text NOT NULL DEFAULT ''::text,
  interests ARRAY NOT NULL DEFAULT '{}'::text[],
  budget_per_person text NOT NULL DEFAULT ''::text,
  accommodation_type text NOT NULL DEFAULT ''::text,
  transport_type text NOT NULL DEFAULT ''::text,
  special_requests text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'new'::text,
  admin_notes text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT personalized_trip_requests_pkey PRIMARY KEY (id),
  CONSTRAINT personalized_trip_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL DEFAULT ''::text,
  phone text DEFAULT ''::text,
  avatar_url text DEFAULT ''::text,
  role text NOT NULL DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'admin'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_admin boolean NOT NULL DEFAULT false,
  email text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  package_id uuid,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT ''::text,
  avatar_url text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  package_name text,
  travel_date text,
  is_featured boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  package_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wishlists_pkey PRIMARY KEY (id),
  CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT wishlists_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);