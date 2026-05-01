-- Push Subscription Schema for PWA Notifications
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "endpoint" TEXT NOT NULL UNIQUE,
    "keys" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- Enable RLS
ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;

-- Allow public to subscribe/unsubscribe
CREATE POLICY "Allow public insert" ON "push_subscriptions"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete" ON "push_subscriptions"
    FOR DELETE USING (true);

-- Allow admin to read all subscriptions
CREATE POLICY "Allow admin read" ON "push_subscriptions"
    FOR SELECT USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS "push_subscriptions_endpoint_idx" ON "push_subscriptions"("endpoint");
CREATE INDEX IF NOT EXISTS "push_subscriptions_email_idx" ON "push_subscriptions"("email");