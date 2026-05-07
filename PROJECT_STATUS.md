# Studio Leish - Project Status #

**Last Updated:** May 7, 2026
**Status:** ✅ Code Complete - DB Migration Pending
**Live URL:** https://studio.leish.my

---

## 📊 Implementation Status

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | MVP Launch (Booking Flow) | ✅ Complete |
| 2 | Email Notifications (Resend) | ✅ Complete |
| 3 | Payment Integration (Billplz) | ✅ Complete* |
| 4 | Admin Dashboard | ✅ Complete |
| 5 | User Accounts | ✅ Complete |
| 6 | Advanced Features | ✅ Complete |

*Pending API key configuration

---

## ✅ What's Recently Implemented

### Booking Page Redesign (May 7, 2026)
- **Room order changed:** Makeup Station → Classroom → Creative Studio
- **New Step 2: Room Details** with conditional forms
- **Makeup Station A/B:** Real-time availability (🟢 green=available, 🔴 red=booked)
- **Classroom form:** Class type, pax count, refreshments (120 words), special request (1200 words)
- **Creative Studio form:** Usage type → redirects to Add-ons (Content Creation/Photoshoot) or shows event details (Small Event)
- **Database migration SQL:** `/supabase/migration-complete.sql`

### Admin Dashboard
- Updated edit modal to show: `room_number`, `class_type`, `pax_count`, `refreshments`, `special_request_class`, `usage_type`, `event_type`, `event_pax`, `special_request_creative`

---

## ⚠️ Pending Actions (Manual)

### 1. **Run Database Migration** (REQUIRED)
**File:** `supabase/migration-complete.sql`
**Steps:**
1. Go to: https://supabase.com/dashboard/project/kcmoibrqyrzueslaqtgc/sql/
2. Copy content from `supabase/migration-complete.sql`
3. Click **Run**

This adds these columns to `bookings` table:
- `room_number` (TEXT) - for Makeup Station A/B
- `class_type`, `pax_count`, `refreshments`, `special_request_class`
- `usage_type`, `event_type`, `event_pax`, `special_request_creative`

### 2. **Configure API Keys** (Optional)
- **Billplz:** Set `BILLPLZ_API_KEY` in Vercel env
- **Google OAuth:** Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel env

### 3. **Test the Flow**
1. Visit: https://studio.leish.my/book.html
2. Select **Makeup Station** → Choose Station A or B (see real-time availability)
3. Select **Classroom** → Fill in class details form
4. Select **Creative Studio** → Choose usage type → redirects to Add-ons

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| Homepage | https://studio.leish.my |
| Booking | https://studio.leish.my/book.html |
| Admin | https://studio.leish.my/admin.html |
| Gallery | https://studio.leish.my/gallery.html |
| User Login | https://studio.leish.my/user.html |

---

## 👤 Admin Credentials

| Email | Password | Role |
|-------|----------|------|
| `leiynda@leish.my` | `leish788` | Admin |
| `shamel@leish.my` | `leish788` | Admin |

---

## 📝 Recent Commits (May 7, 2026)

1. `667185a` - feat: Add complete bookings table migration SQL
2. `fa753e2` - docs: Update project status with recent booking page changes
3. `13ceb88` - feat: Add room details fields to admin edit modal
4. `c7b6c2f` - fix: Correct SQL migration syntax
5. `b2fae0b` - Add SQL migration for room details columns
6. `355f743` - feat: Add Makeup Station A/B, Classroom & Creative Studio forms
7. `c6e9c96` - Fix: Resolve supabase variable conflict in admin.html

---

## 🚀 Next Steps

1. **Run the SQL migration** in Supabase Dashboard (5 minutes)
2. **Test booking flow** with new room details (10 minutes)
3. **Configure Billplz** for payment processing (30 minutes)
4. **Set up Google OAuth** for social login (1 hour)
