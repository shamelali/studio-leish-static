#!/bin/bash

# Studio Leish - Environment Setup Script
# Run this to configure all environment variables in Vercel

echo "=========================================="
echo "Studio Leish - Environment Setup"
echo "=========================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI not found"
    echo "Install with: npm install -g vercel"
    exit 1
fi

# Billplz Configuration
echo ""
echo "Setting up Billplz..."
echo "--------------------------------------"

echo "Adding BILLPLZ_API_KEY..."
echo "0d8aa179-da8b-439d-977e-a29567e13852" | vercel env add BILLPLZ_API_KEY production 2>/dev/null || \
echo "Note: BILLPLZ_API_KEY may already exist"

echo "Adding BILLPLZ_COLLECTION_ID..."
echo "ogf1esbw" | vercel env add BILLPLZ_COLLECTION_ID production 2>/dev/null || \
echo "Note: BILLPLZ_COLLECTION_ID may already exist"

# Google OAuth Configuration
echo ""
echo "Setting up Google OAuth..."
echo "--------------------------------------"

echo "Adding GOOGLE_CLIENT_ID..."
echo "64802105655-ob0f5608g1fomq63ss9hk7vo756j36bt.apps.googleusercontent.com" | vercel env add GOOGLE_CLIENT_ID production 2>/dev/null || \
echo "Note: GOOGLE_CLIENT_ID may already exist"

echo "Adding GOOGLE_CLIENT_SECRET..."
echo "GOCSPX-maeUeXBykC6k8dmGPOFGK19nBRW" | vercel env add GOOGLE_CLIENT_SECRET production 2>/dev/null || \
echo "Note: GOOGLE_CLIENT_SECRET may already exist"

# Supabase Configuration
echo ""
echo "Setting up Supabase..."
echo "--------------------------------------"

echo "Adding SUPABASE_URL..."
echo "https://vnpiekiedynvechawhhw.supabase.co" | vercel env add SUPABASE_URL production 2>/dev/null || \
echo "Note: SUPABASE_URL may already exist"

echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucGlla2llZHludmVjaGF3aGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NDYzNSwiZXhwIjoyMDkwNjQwNjM1fQ.8m2J0PdMUG43l-jnYbQ7VoyHUqdzdfJyY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production 2>/dev/null || \
echo "Note: SUPABASE_SERVICE_ROLE_KEY may already exist"

# Resend (Email)
echo ""
echo "Setting up Resend (Email)..."
echo "--------------------------------------"

echo "Adding RESEND_API_KEY..."
echo "re_eFzxgsbB_5g7anqy9RNQd4wC41kuV9phg" | vercel env add RESEND_API_KEY production 2>/dev/null || \
echo "Note: RESEND_API_KEY may already exist"

echo ""
echo "=========================================="
echo "Environment setup complete!"
echo "=========================================="
echo ""
echo "To verify, go to:"
echo "  https://vercel.com/dashboard → studio-leish-static → Settings → Environment Variables"
echo ""
echo "Test pages:"
echo "  - Billplz: https://studio-leish-static.vercel.app/test-billplz.html"
echo "  - Google OAuth: https://studio-leish-static.vercel.app/user.html"
echo ""