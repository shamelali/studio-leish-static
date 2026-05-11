-- Fix unindexed foreign keys for performance
-- Created: 2026-05-08

-- Index for images.uploaded_by FK to auth.users(id)
CREATE INDEX IF NOT EXISTS images_uploaded_by_idx ON public.images(uploaded_by);

-- Index for site_settings.updated_by FK to auth.users(id)
CREATE INDEX IF NOT EXISTS site_settings_updated_by_idx ON public.site_settings(updated_by);
