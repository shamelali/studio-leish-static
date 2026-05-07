# Studio Leish - Remaining Setup Instructions

## Quick Status

The codebase is **100% ready**. All code has been written and deployed. Only manual configuration steps remain.

---

## 1. Database Schema Setup (5 minutes)

### Action Required
Run the SQL scripts in your Supabase dashboard.

### Steps
1. Go to: https://app.supabase.com/project/kcmoibrqyrzueslaqtgc/sql
2. Copy and paste the contents of `reviews-schema.sql`
3. Click "Run"
4. Copy and paste the contents of `push-subscription-schema.sql`
5. Click "Run"

### What This Creates
- `Review` table for the review/rating system
- `push_subscriptions` table for PWA push notifications
- Adds `rating` and `review_comment` columns to the `Booking` table

---

## 2. Billplz API Key Configuration (5 minutes)

### Current Status
- Billplz API key found in setup-env.sh: `0d8aa179-da8b-439d-937e-a29567e13852`
- Collection ID: `ogf1esbw`
- Code is ready in `api/billplz-create-bill.js` and `api/billplz-callback.js`

### Option A: Via Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/shamelalis-projects/studio-leish-static/settings/environment-variables
2. Add these variables:
   - `BILLPLZ_API_KEY` = `0d8aa179-da8b-439d-937e-a29567e13852`
   - `BILLPLZ_COLLECTION_ID` = `ogf1esbw`
3. Redeploy: `npx vercel --prod`

### Option B: Via CLI
```bash
npx vercel env add BILLPLZ_API_KEY production
# Paste: 0d8aa179-da8b-439d-937e-a29567e13852

npx vercel env add BILLPLZ_COLLECTION_ID production
# Paste: ogf1esbw

npx vercel --prod
```

---

## 3. Google OAuth Setup (15 minutes)

### Current Status
- Google OAuth Client ID: `64802105655-ob0f5608g1fomq63ss9hk7vo756j36bt.apps.googleusercontent.com`
- Google OAuth Client Secret: `GOCSPX-maeUeXBykC6k8dmGPOFGK19nBRW`
- Code is ready in `api/google-oauth.js` and `signup.html`/`user.html`

### Step 1: Configure Supabase Auth
1. Go to: https://app.supabase.com/project/kcmoibrqyrzueslaqtgc/auth/providers
2. Click on "Google" provider
3. Enable it
4. Add these from Google Cloud Console:
   - **Client ID**: `64802105655-ob0f5608g1fomq63ss9hk7vo756j36bt.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-maeUeXBykC6k8dmGPOFGK19nBRW`
5. Add authorized redirect URL:
   - `https://kcmoibrqyrzueslaqtgc.supabase.co/auth/v1/callback`

### Step 2: Configure Google Cloud Console (if not done)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find the OAuth 2.0 Client ID above
3. Add these authorized redirect URIs:
   - `https://kcmoibrqyrzueslaqtgc.supabase.co/auth/v1/callback`
   - `https://studio-leish-static.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for testing)

### Step 3: Add to Vercel Environment Variables
1. Go to Vercel dashboard → Environment Variables
2. Add:
   - `GOOGLE_CLIENT_ID` = `64802105655-ob0f5608g1fomq63ss9hk7vo756j36bt.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET` = `GOCSPX-maeUeXBykC6k8dmGPOFGK19nBRW`
3. Redeploy: `npx vercel --prod`

---

## 4. Custom Domain Setup (30 minutes + 48hr DNS propagation)

### Current Status
- Domain: `studio.leish.my`
- Cloudflare setup script: `setup-cloudflare.sh`
- Domain setup guide: `domain-setup.html`

### Option A: Via Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/shamelalis-projects/studio-leish-static/settings/domains
2. Add domain: `studio.leish.my`
3. Vercel will show you DNS records to add
4. Go to your DNS provider (Cloudflare, Namecheap, etc.)
5. Add the CNAME record as instructed by Vercel
6. Wait for DNS propagation (up to 48 hours)

### Option B: Via CLI
```bash
npx vercel domain add studio.leish.my
```

### Option C: Automated (if using Cloudflare)
```bash
# Edit setup-cloudflare.sh with your Cloudflare API token
bash setup-cloudflare.sh
```

---

## 5. Verify Everything Works

### Test Booking Flow
1. Visit: https://studio-leish-static.vercel.app/book.html
2. Complete the 6-step booking
3. Verify:
   - Booking is saved to Supabase
   - Confirmation email is sent (Resend API)
   - Redirects to Billplz for payment (if API key is set)

### Test Admin Dashboard
1. Visit: https://studio-leish-static.vercel.app/admin.html
2. Login with:
   - Email: `leiynda@leish.my` or `shamel@leish.my`
   - Password: `leish788`
3. Verify:
   - Can see all bookings
   - Can edit/delete bookings
   - Stats are correct

### Test User Accounts
1. Visit: https://studio-leish-static.vercel.app/user.html
2. Register a new account or login
3. Verify:
   - Can view own bookings
   - Google OAuth works (if configured)

### Test Reviews
1. Visit: https://studio-leish-static.vercel.app/reviews.html
2. Submit a review
3. Verify it appears in the list

### Test Gallery
1. Visit: https://studio-leish-static.vercel.app/gallery.html
2. Verify spaces are displayed

---

## Summary of What's Already Done

✅ **Code Complete:**
- All HTML pages deployed to Vercel
- All API routes ready (Billplz, Resend, Google OAuth, Reviews, Push)
- Supabase schema ready (bookings, users, reviews, images, settings)
- Admin dashboard with full CRUD
- User accounts with dashboards
- Review/rating system
- Gallery/browse spaces
- Mobile responsive design
- PWA capabilities (sw.js, manifest.json)

✅ **API Keys Found in Codebase:**
- Supabase: `https://kcmoibrqyrzueslaqtgc.supabase.co`
- Resend: `re_eFzxgsbB_5g7anqy9RNQd4wC41kuV9phg`
- Billplz: `0d8aa179-da8b-439d-937e-a29567e13852`
- Google OAuth: `64802105655-ob0f5608g1fomq63ss9hk7vo756j36bt.apps.googleusercontent.com`

⏳ **What Needs Manual Action:**
1. Run SQL in Supabase dashboard (5 min)
2. Add Billplz env vars to Vercel (5 min)
3. Configure Google OAuth in Supabase (15 min)
4. Add custom domain in Vercel (30 min + 48hr wait)

---

## Live URLs

| Page | URL |
|------|-----|
| Homepage | https://studio-leish-static.vercel.app |
| Booking | https://studio-leish-static.vercel.app/book.html |
| Gallery | https://studio-leish-static.vercel.app/gallery.html |
| Admin | https://studio-leish-static.vercel.app/admin.html |
| User Login | https://studio-leish-static.vercel.app/user.html |
| User Dashboard | https://studio-leish-static.vercel.app/user-dashboard.html |
| Reviews | https://studio-leish-static.vercel.app/reviews.html |
| Submit Review | https://studio-leish-static.vercel.app/submit-review.html |

---

## Commands

```bash
# Deploy to production
npx vercel --prod

# Check environment variables
npx vercel env ls

# Add environment variable
npx vercel env add VARIABLE_NAME production
```
