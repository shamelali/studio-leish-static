-- Run this in Supabase SQL Editor: https://app.supabase.com/project/kcmoibrqyrzueslaqtgc/sql

-- ============================================
-- Studio Leish - Database Setup
-- ============================================

-- Reviews table
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" TEXT,
    "client_email" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Public insert" ON "Review" FOR INSERT WITH CHECK (true);

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "endpoint" TEXT NOT NULL UNIQUE,
    "keys" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert" ON "push_subscriptions" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete" ON "push_subscriptions" FOR DELETE USING (true);
CREATE POLICY "Public read" ON "push_subscriptions" FOR SELECT USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" TEXT NOT NULL UNIQUE,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "booking_date" DATE NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "duration_hours" DECIMAL(4,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Checked In', 'Checked Out')),
    "payment_status" TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    "add_ons" TEXT,
    "special_requests" TEXT,
    "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
    "review_comment" TEXT,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON "bookings" FOR SELECT USING (true);
CREATE POLICY "Public insert" ON "bookings" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON "bookings" FOR UPDATE USING (true);

-- ============================================
-- Verify tables created:
-- SELECT * FROM "Review";
-- SELECT * FROM "push_subscriptions";
-- SELECT * FROM "bookings";
-- ============================================