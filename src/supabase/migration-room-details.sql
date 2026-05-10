-- SQL Migration for Studio Leish Booking Updates
-- Run this in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/kcmoibrqyrzueslaqtgc/sql/

-- First, check if the table exists and see all columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Add new columns to bookings table (safe to run multiple times)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS class_type TEXT CHECK (class_type IN ('private', 'group'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pax_count INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refreshments TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_class TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS usage_type TEXT CHECK (usage_type IN ('Content Creation', 'Photoshoot', 'Small Event'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_pax INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_creative TEXT;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Show sample data
SELECT booking_id, room, room_number, class_type, usage_type 
FROM public.bookings 
LIMIT 5;
