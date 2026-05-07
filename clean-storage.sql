-- Clean up storage configuration for Studio Leish
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/kcmoibrqyrzueslaqtgc/sql

-- 1. Delete all objects in studio-images bucket (if exists)
DELETE FROM storage.objects WHERE bucket_id = 'studio-images';

-- 2. Delete the studio-images bucket (if exists)
DELETE FROM storage.buckets WHERE id = 'studio-images';

-- 3. Drop existing storage policies for studio-images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- 4. Recreate the bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-images',
  'studio-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 5. Recreate storage policies with proper permissions
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'studio-images');

-- Allow authenticated users to upload
CREATE POLICY "Admin Upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'studio-images');

-- Allow authenticated users to update
CREATE POLICY "Admin Update" ON storage.objects
  FOR UPDATE
  TO authenticated
  WITH CHECK (bucket_id = 'studio-images');

-- Allow authenticated users to delete
CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'studio-images');

-- 6. Verify setup
SELECT * FROM storage.buckets WHERE id = 'studio-images';
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
