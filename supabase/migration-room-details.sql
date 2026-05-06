-- SQL Migration for Studio Leish Booking Updates
-- Run this in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/kcmoibrqyrzueslaqtgc/sql/

-- First, check existing columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Add new columns to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS class_type TEXT CHECK (class_type IN ('private', 'group'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pax_count INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refreshments TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_class TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS usage_type TEXT CHECK (usage_type IN ('Content Creation', 'Photoshoot', 'Small Event'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_pax INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_creative TEXT;

-- Backfill past Makeup Station bookings to Station A (default)
-- Note: column is named 'room' in your schema, not 'room_name'
UPDATE public.bookings 
SET room_number = 'A' 
WHERE room = 'Makeup Station' AND room_number IS NULL;

-- Verify the changes
SELECT booking_id, room, room_number, class_type, usage_type 
FROM public.bookings 
LIMIT 5;
