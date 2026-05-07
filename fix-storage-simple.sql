-- Fix storage for Studio Leish (simplified - no direct deletes)
-- Run via: supabase db query --file fix-storage-simple.sql --linked

-- 1. Create or update the studio-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-images',
  'studio-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Recreate storage policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

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

-- 3. Verify setup
SELECT 'Bucket:' AS check_type, * FROM storage.buckets WHERE id = 'studio-images'
UNION ALL
SELECT 'Policy:' AS check_type, row_to_json(p)::text FROM pg_policies p WHERE tablename = 'objects' AND schemaname = 'storage';
