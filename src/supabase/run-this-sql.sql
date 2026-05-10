-- Copy-paste this ENTIRE block into Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kcmoibrqyrzueslaqtgc/sql/

-- 1. Create table if not exists (with ALL columns)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    clientName TEXT,
    clientEmail TEXT NOT NULL,
    clientPhone TEXT,
    room TEXT NOT NULL,
    room_number TEXT,
    room_price INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    sessionType TEXT,
    sessionPrice INTEGER DEFAULT 0,
    class_type TEXT CHECK (class_type IN ('private', 'group')),
    pax_count INTEGER,
    refreshments TEXT,
    special_request_class TEXT,
    usage_type TEXT CHECK (usage_type IN ('Content Creation', 'Photoshoot', 'Small Event')),
    event_type TEXT,
    event_pax INTEGER,
    special_request_creative TEXT,
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

-- 2. If table already exists, just add new columns (safe to run multiple times)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS class_type TEXT CHECK (class_type IN ('private', 'group'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pax_count INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refreshments TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_class TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS usage_type TEXT CHECK (usage_type IN ('Content Creation', 'Photoshoot', 'Small Event'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_pax INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_creative TEXT;

-- 3. Enable RLS (safe to run multiple times)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (drop first to avoid errors)
DROP POLICY IF EXISTS "Anyone can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON public.bookings;

CREATE POLICY "Anyone can read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bookings" ON public.bookings FOR UPDATE USING (true);

-- 5. Verify: Show all columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
