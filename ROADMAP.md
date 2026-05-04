# Studio Leish - Completion Roadmap

## ✅ Completed (Phase 1 - MVP Launch)
- [x] Static HTML deployment (Vercel)
- [x] Homepage with design from NEW/index.html
- [x] 6-step booking flow (Room → Date/Time → Session → Add-ons → Details → Confirm)
- [x] Flatpickr date picker integration
- [x] Supabase client integration (saves bookings to database)
- [x] Mobile responsive design
- [x] QR code for iOS access

**Live URL:** https://studio-leish-static.vercel.app

---

## ✅ Completed (Phase 2 - Email & Notifications)
- [x] Resend API integration for booking confirmations
- [x] Client confirmation emails with booking details
- [x] Styled HTML email templates

---

## ✅ Completed (Phase 3 - Payment Integration)
- [x] Billplz API integration (serverless functions)
- [x] Bill creation endpoint (`/api/billplz-create-bill`)
- [x] Payment callback/webhook handler (`/api/billplz-callback`)
- [x] Booking flow redirects to Billplz for payment

**Status:** Code ready, need to set BILLPLZ_API_KEY in Vercel env

---

## ✅ Completed (Phase 4 - Admin Dashboard)
- [x] Admin login page (Supabase Auth)
- [x] Dashboard with stats (total bookings, pending, confirmed, revenue)
- [x] Booking management table (view, update status)
- [x] Live URL: https://studio-leish-static.vercel.app/admin.html

---

## ✅ Completed (Phase 5 - User Accounts)
- [x] User registration page (email, password, name, phone)
- [x] User login page
- [x] User dashboard (view own bookings)
- [x] Supabase Auth integration
- [x] Live URLs:
  - https://studio-leish-static.vercel.app/user.html
  - https://studio-leish-static.vercel.app/user-dashboard.html

---

## ✅ Completed (Phase 6 - Advanced Features)
- [x] Review/rating system (reviews.html, submit-review.html)
- [x] Analytics dashboard (admin-enhanced.html)
- [x] Custom domain setup (setup-domain.sh ready)
- [x] PWA capabilities (sw.js, manifest.json)
- [x] Push notifications (api/push-subscribe.js)
- [x] Google OAuth integration (signup.html, user.html)
- [x] Billplz API integration (api/billplz-*.js)

**Pending Configuration:**
- [ ] Run SQL to create Review & push_subscriptions tables
- [x] Enable Google OAuth in Supabase Dashboard ✅
- [ ] Set BILLPLZ_API_KEY in Vercel environment variables

---

## 🎯 Priority Order

| Priority | Feature | Effort | Value |
|----------|---------|--------|-------|
| 1 | Email confirmations (Resend) | Medium | High |
| 2 | Payment (Billplz) | High | High |
| 3 | Admin dashboard | High | High |
| 4 | User accounts | Medium | Medium |
| 5 | Reviews/ratings | Low | Medium |
| 6 | Analytics | Medium | Low |
| 7 | Custom domain | Low | Low |

---

## 🔧 Technical Stack

**Current:**
- Frontend: Static HTML/CSS/JS
- Database: Supabase (PostgreSQL)
- Hosting: Vercel (static)

**To Add:**
- Email: Resend API
- Payments: Billplz API
- Auth: Supabase Auth + Google OAuth

---

## 📊 Database Schema (Supabase)

Already exists: `bookings` table with fields:
- booking_id, room, room_price
- booking_date, booking_time
- session_type, session_duration
- addons (JSON), client info
- total_amount, status, payment_status

**To Add:**
- users table
- studios table
- reviews table
- payments table

---

## 💰 Estimated Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | Static hosting ✅ | From $20/mo |
| Supabase | 500MB DB ✅ | From $25/mo |
| Resend | 3,000 emails/mo ✅ | From $49/mo |
| Billplz | Transaction fees only | 1.5% + RM0.50 |