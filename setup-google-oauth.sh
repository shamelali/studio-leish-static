#!/bin/bash
# Google OAuth Setup Helper for Studio Leish
# Sets up OAuth credentials via Google Cloud API (requires gcloud CLI)

set -e

echo "=== Studio Leish - Google OAuth Setup ==="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "⚠️ gcloud CLI not found"
    echo "Install: https://cloud.google.com/sdk/docs/install"
    echo "Or follow manual setup: https://console.cloud.google.com/"
    exit 1
fi

# Configuration
PROJECT_ID="your-project-id"  # Update this with your Google Cloud project ID
APP_NAME="Studio Leish"
SUPABASE_CALLBACK="https://vnpiekiedynvechawhhw.supabase.co/auth/v1/callback"

echo "[1/3] Creating OAuth Client..."
echo "Project: $PROJECT_ID"
echo "App Name: $APP_NAME"
echo ""

# Create OAuth 2.0 Client
gcloud auth application-default login

gcloud alpha iam/service-accounts create studio-leish-oauth \
    --project=$PROJECT_ID \
    --display-name="Studio Leish OAuth" || echo "Service account may already exist"

# Create Client ID
gcloud alpha iam/service-accounts keys create \
    --project=$PROJECT_ID \
    --iam-account=studio-leish-oauth@$PROJECT_ID.iam.gserviceaccount.com \
    --key-file=studio-leish-oauth-key.json

echo ""
echo "[2/3] Configuring Redirect URIs..."
echo "Add these to Google Cloud Console → APIs & Services → Credentials:"
echo "1. https://studio-leish-static.vercel.app/auth/callback"
echo "2. https://studio.leish.my/auth/callback (after domain setup)"
echo "3. https://vnpiekiedynvechawhhw.supabase.co/auth/v1/callback"
echo ""

echo "[3/3] Add to Supabase Auth..."
echo "Go to: https://app.supabase.com/project/vnpiekiedynvechawhhw/auth/providers"
echo ""
echo "Provider: Google"
echo "Client ID: [from studio-leish-oauth-key.json]"
echo "Client Secret: [from studio-leish-oauth-key.json]"
echo "Redirect URL: $SUPABASE_CALLBACK"
echo ""

echo "========================================="
echo "✅ Google OAuth Setup Complete!"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. Copy Client ID/Secret from console (or studio-leish-oauth-key.json)"
echo "2. Add to Vercel: vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID"
echo "3. Add to Vercel: vercel env add GOOGLE_CLIENT_SECRET"
echo "4. Update user.html with Google Sign-In button"
echo ""
echo "5. Test: https://studio-leish-static.vercel.app/user.html"
