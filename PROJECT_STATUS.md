# Studio Leish - Project Status

**Last Updated:** May 9, 2026
**Status:** ✅ Storage Fixed - Production Ready
**Live URL:** https://studio.leish.my

---

## ✅ What's Deployed & Working

**Live Site (studio.leish.my):**
- ✅ Homepage with hero, features, gallery, reviews
- ✅ Sign-in/Sign-up (Google OAuth + Email OTP)
- ✅ Booking system with calendar and time slots
- ✅ Admin dashboard with edit capabilities
- ✅ Storage bucket `studio-images` configured and active

**Storage System:**
- ✅ Bucket `studio-images` created (public, 5MB limit, image formats)
- ✅ 4 storage policies active (Public Access, Admin Upload/Update/Delete)
- ✅ Storage URL: `https://kcmoibrqyrzueslaqtgc.supabase.co/storage/v1/object/public/studio-images`

**Server Status:**
- ✅ Disk space fixed (79% used, 6.6GB free)
- Cleaned up 17MB+ of unnecessary files
- Removed unused Flatpak runtimes (~6GB freed)

---

## 🔗 Quick Links

| Resource | URL | Status |
|----------|-----|--------|
| Homepage | https://studio.leish.my | ✅ Live |
| Booking | https://studio.leish.my/book.html | ✅ Live |
| Admin | https://studio.leish.my/admin.html | ✅ Live |
| Gallery | https://studio.leish.my/gallery.html | ✅ Live |
| Sign In | https://studio.leish.my/signin.html | ✅ Live |

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
| `e897d53` | Fix Supabase storage and free disk space |
| `9a51beb` | docs: Add copy-paste SQL for Supabase |
| `21ae6b6` | docs: Comprehensive project status update |

---

## ⚙️ Supabase Configuration

**Project ID:** `kcmoibrqyrzueslaqtgc`
**Region:** Southeast Asia (Singapore)

**Storage Buckets:**
- `studio-images` - Public bucket for site images (5MB limit)

**Database Tables:**
- `bookings` - Session bookings
- `images` - Gallery images
- `site_settings` - Configuration
- `push_subscriptions` - Push notifications

---

## 🔧 Optional Enhancements

1. **Billplz Payment:** Configure at https://studio.leish.my/admin.html (Settings tab)
2. **Google OAuth:** Already configured, works at sign-in
3. **Email Provider:** Brevo/Resend configured for transactional emails

---

## 🚀 Next Steps

1. **Test full booking flow:** Book a session and verify email notification
2. **Upload gallery images:** Use admin panel to add images to `studio-images` bucket
3. **Monitor storage:** 5MB per file limit - consider upgrading plan for larger files

---

**Questions?** Check the site is accessible at https://studio.leish.my