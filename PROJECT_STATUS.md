# Studio Leish - Project Status #

**Last Updated:** May 7, 2026
**Status:** ✅ Code Complete - DB Migration Pending
**Live URL:** https://studio.leish.my

---

## ✅ What's Deployed & Working

**Booking Page (https://studio.leish.my/book.html):**
- ✅ Room order: **Makeup Station → Classroom → Creative Studio**
- ✅ **New Step 2: Room Details** with conditional forms
- ✅ **Makeup Station A/B** with real-time availability (green=available, red=booked)
- ✅ **Classroom form:** Class type, pax, refreshments (120 words), special request (1200 words)
- ✅ **Creative Studio form:** Usage type → redirects to Add-ons (Content Creation/Photoshoot) or shows event details (Small Event)
- ✅ Word count validation for all textareas
- ✅ Updated progress bar (6 steps)

**Admin Dashboard (https://studio.leish.my/admin.html):**
- ✅ Updated edit modal with new fields: `room_number`, `class_type`, `pax_count`, `refreshments`, `special_request_class`, `usage_type`, `event_type`, `event_pax`, `special_request_creative`

---

## ⚠️ Action Required (5 minutes)

### **Run this SQL in Supabase Dashboard:**

**URL:** https://supabase.com/dashboard/project/kcmoibrqyrzueslaqtgc/sql/

**Copy-paste this entire block:**

```sql
-- Add new columns to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS class_type TEXT CHECK (class_type IN ('private', 'group'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pax_count INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refreshments TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_class TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS usage_type TEXT CHECK (usage_type IN ('Content Creation', 'Photoshoot', 'Small Event'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS event_pax INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_request_creative TEXT;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
```

**Click "Run"** - This should complete without errors.

---

## 🔗 Quick Links

| Resource | URL | Status |
|----------|-----|--------|
| Homepage | https://studio.leish.my | ✅ Live |
| Booking | https://studio.leish.my/book.html | ✅ Live (needs DB migration) |
| Admin | https://studio.leish.my/admin.html | ✅ Live |
| Gallery | https://studio.leish.my/gallery.html | ✅ Live |
| User Login | https://studio.leish.my/user.html | ✅ Live |

---

## 👤 Admin Credentials

| Email | Password | Role |
|-------|----------|------|
| `leiynda@leish.my` | `leish788` | Admin |
| `shamel@leish.my` | `leish788` | Admin |

---

## 📝 Recent Commits

| Commit | Description |
|--------|-------------|
| `9a51beb` | docs: Add copy-paste SQL for Supabase |
| `21ae6b6` | docs: Comprehensive project status update |
| `667185a` | feat: Add complete bookings table migration SQL |
| `fa753e2` | docs: Update project status with recent booking page changes |
| `13ceb88` | feat: Add room details fields to admin edit modal |
| `c7b6c2f` | fix: Correct SQL migration syntax |
| `355f743` | feat: Add Makeup Station A/B, Classroom & Creative Studio forms |

---

## 🚀 Next Steps (After SQL Migration)

1. **Test booking flow:** https://studio.leish.my/book.html
   - Select Makeup Station → Choose Station A or B (see availability)
   - Select Classroom → Fill class details
   - Select Creative Studio → Choose usage type

2. **Configure Billplz** (optional): Get API key from billplz.com

3. **Configure Google OAuth** (optional): Set up in Google Cloud Console

---

**Need help?** Run the SQL above and let me know if you get any errors!
