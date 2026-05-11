-- ============================================
-- Studio Leish - Complete Supabase Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- SECTION 1: BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    clientName TEXT,
    clientEmail TEXT NOT NULL,
    clientPhone TEXT,
    room TEXT NOT NULL,
    room_price INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    sessionType TEXT,
    sessionPrice INTEGER DEFAULT 0,
    addons JSONB DEFAULT '[]'::jsonb,
    addonsPrice INTEGER DEFAULT 0,
    totalAmount INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out', 'completed')),
    paymentStatus TEXT DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_comment TEXT,
    adminNotes TEXT,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS bookings_client_email_idx ON public.bookings(clientEmail);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_date_idx ON public.bookings(date);

-- ============================================
-- SECTION 2: USERS TABLE (for role-based access)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true);

-- ============================================
-- SECTION 3: REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id TEXT NOT NULL,
    client_email TEXT NOT NULL,
    room TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS reviews_booking_id_idx ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- ============================================
-- SECTION 4: IMAGES TABLE (Gallery)
-- ============================================
CREATE TABLE IF NOT EXISTS public.images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    room_name TEXT,
    image_type TEXT DEFAULT 'gallery' CHECK (image_type IN ('gallery', 'hero', 'thumbnail')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active images" ON public.images FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage images" ON public.images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- SECTION 5: SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
    ('booking_enabled', '{"value": true}', 'Enable/disable booking functionality'),
    ('reviews_enabled', '{"value": true}', 'Enable/disable review system'),
    ('maintenance_mode', '{"value": false}', 'Put site in maintenance mode'),
    ('featured_rooms', '{"value": ["creative-studio", "makeup-suite"]}', 'List of featured room IDs'),
    ('contact_email', '{"value": "hello@leish.my"}', 'Public contact email'),
    ('social_links', '{"value": {"instagram": "", "facebook": "", "tiktok": ""}}', 'Social media links'),
    ('hero_title', '{"value": "Unleash Your Creative Vision"}', 'Homepage hero title'),
    ('hero_subtitle', '{"value": "Professional studio spaces designed for creators, artists, and dreamers."}', 'Homepage hero subtitle')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- SECTION 6: STORAGE BUCKET
-- ============================================
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'studio-images',
    'studio-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'studio-images');

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'studio-images');

DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'studio-images') WITH CHECK (bucket_id = 'studio-images');

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'studio-images');

-- ============================================
-- SECTION 7: ADMIN USERS
-- ============================================
-- Create admin user 1: leiynda@leish.my (password: leish788)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'leiynda@leish.my',
    crypt('leish788', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"name": "Leiynda Admin", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Create admin user 2: shamel@leish.my (password: leish788)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'shamel@leish.my',
    crypt('leish788', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"name": "Shamel Admin", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Add admins to public users table
INSERT INTO public.users (id, name, email, role, status)
SELECT id, raw_user_meta_data->>'name', email, 'admin', 'approved'
FROM auth.users
WHERE email IN ('leiynda@leish.my', 'shamel@leish.my')
ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'approved';

-- ============================================
-- VERIFY SETUP
-- ============================================
SELECT '✅ Setup Complete!' as status;

-- Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show admin users
SELECT email, role, status FROM public.users WHERE role = 'admin';

-- Show storage buckets
SELECT id, name, public FROM storage.buckets;