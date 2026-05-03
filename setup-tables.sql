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

-- ============================================
-- Verify tables created:
-- SELECT * FROM "Review";
-- SELECT * FROM "push_subscriptions";
-- ============================================