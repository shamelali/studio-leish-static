-- Storage bucket for Studio Leish images
-- Run this in Supabase SQL Editor to set up storage

-- Create storage bucket for studio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-images',
  'studio-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to studio-images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'studio-images');

-- Allow authenticated admin users to upload images
CREATE POLICY "Admin Upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'studio-images');

-- Allow authenticated admin users to update images
CREATE POLICY "Admin Update" ON storage.objects
  FOR UPDATE
  TO authenticated
  WITH CHECK (bucket_id = 'studio-images');

-- Allow authenticated admin users to delete images
CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'studio-images');

-- Table to track uploaded images and their metadata
CREATE TABLE IF NOT EXISTS public.images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  room_name TEXT, -- Which room this image belongs to
  image_type TEXT DEFAULT 'gallery', -- 'gallery', 'hero', 'thumbnail'
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on images table
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Public can view active images
CREATE POLICY "Public can view active images" ON public.images
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage images
CREATE POLICY "Authenticated users can manage images" ON public.images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site settings table for functionality controls
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can read settings" ON public.site_settings
  FOR SELECT
  USING (true);

-- Only authenticated admins can update settings
CREATE POLICY "Authenticated users can manage settings" ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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
