-- Add two admin users to Studio Leish
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/vnpiekiedynvechawhhw/sql

-- ==========================================
-- 1. Create leiynda@leish.my as admin
-- ==========================================

-- Insert into auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'leiynda@leish.my',
    crypt('leish788', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"name": "Leiynda Admin", "phone": "+60123456789", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
    leiynda_id UUID;
BEGIN
    SELECT id INTO leiynda_id FROM auth.users WHERE email = 'leiynda@leish.my' LIMIT 1;
    
    -- Insert into public users table
    INSERT INTO "User" (id, name, email, phone, role, status, createdAt, updatedAt)
    VALUES (
        leiynda_id,
        'Leiynda Admin',
        'leiynda@leish.my',
        '+60123456789',
        'admin',
        'approved',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = 'approved';
END $$;

-- ==========================================
-- 2. Create shamel@leish.my as admin
-- ==========================================

-- Insert into auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'shamel@leish.my',
    crypt('leish788', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"name": "Shamel Admin", "phone": "+60123456789", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
    shamel_id UUID;
BEGIN
    SELECT id INTO shamel_id FROM auth.users WHERE email = 'shamel@leish.my' LIMIT 1;
    
    -- Insert into public users table
    INSERT INTO "User" (id, name, email, phone, role, status, createdAt, updatedAt)
    VALUES (
        shamel_id,
        'Shamel Admin',
        'shamel@leish.my',
        '+60123456789',
        'admin',
        'approved',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = 'approved';
END $$;

-- ==========================================
-- 3. Verify both admin users
-- ==========================================

SELECT 
    u.email,
    u.raw_user_meta_data->>'name' as name,
    pu.role,
    pu.status,
    pu.phone
FROM auth.users u
LEFT JOIN "User" pu ON u.id = pu.id
WHERE u.email IN ('leiynda@leish.my', 'shamel@leish.my')
ORDER BY u.email;

-- ==========================================
-- 4. (Optional) Update existing admin@leish.my if exists
-- ==========================================

UPDATE "User" 
SET role = 'admin', status = 'approved'
WHERE email IN ('leiynda@leish.my', 'shamel@leish.my');

-- Show all admin users
SELECT 
    email,
    name,
    role,
    status
FROM "User"
WHERE role = 'admin'
ORDER BY createdAt DESC;
