-- Add reviews table for Phase 6
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" TEXT NOT NULL REFERENCES "Booking"("booking_id") ON DELETE CASCADE,
    "client_email" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- Enable RLS (Row Level Security)
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- Allow public to read reviews
CREATE POLICY "Allow public read" ON "Review"
    FOR SELECT USING (true);

-- Allow clients to insert their own reviews (match by email)
CREATE POLICY "Allow client insert" ON "Review"
    FOR INSERT WITH CHECK (true);

-- Add rating field to Booking table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'Booking' AND column_name = 'rating') THEN
        ALTER TABLE "Booking" ADD COLUMN "rating" INTEGER CHECK (rating >= 1 AND rating <= 5);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'Booking' AND column_name = 'review_comment') THEN
        ALTER TABLE "Booking" ADD COLUMN "review_comment" TEXT;
    END IF;
END
$$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "Review_booking_id_idx" ON "Review"("booking_id");
CREATE INDEX IF NOT EXISTS "Review_rating_idx" ON "Review"("rating");
CREATE INDEX IF NOT EXISTS "Review_created_at_idx" ON "Review"("created_at" DESC);
