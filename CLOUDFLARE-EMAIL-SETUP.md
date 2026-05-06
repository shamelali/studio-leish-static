# Cloudflare Email Routing Setup

## Current Status
- Domain: `leish.my` ✅
- MX Records: Already pointing to Cloudflare
- Goal: Receive emails sent to `@leish.my` addresses

## Setup Steps (5 minutes)

### 1. Enable Email Routing in Cloudflare
1. Go to https://dash.cloudflare.com
2. Select **leish.my** site
3. Navigate to **Email** → **Email Routing**
4. Click **Enable Email Routing**

### 2. Add Destination Address
Verify your personal email (where you want to receive forwarded emails):
- Click **Destination addresses** → **Add destination address**
- Enter: `leishstudio.main@gmail.com`
- Verify via confirmation email

### 3. Create Email Routes
Add these forwarding rules:

| Custom address | Forward to | Purpose |
|---------------|------------|---------|
| `hello@leish.my` | leishstudio.main@gmail.com | General inquiries |
| `bookings@leish.my` | leishstudio.main@gmail.com | Booking confirmations |
| `studio@leish.my` | leishstudio.main@gmail.com | General studio email |
| `admin@leish.my` | leishstudio.main@gmail.com | Admin notifications |

### 4. Catch-all Rule (Optional)
- Enable **Catch-all address**
- Action: **Forward to** → `leishstudio.main@gmail.com`
- This catches any email sent to `*@leish.my`

## DNS Records (Auto-configured)
Cloudflare automatically sets these when you enable Email Routing:
```
Type: MX
Name: @
Content: route1.mx.cloudflare.net
Priority: 18
TTL: Auto

Type: MX
Name: @
Content: route2.mx.cloudflare.net
Priority: 48
TTL: Auto

Type: MX
Name: @
Content: route3.mx.cloudflare.net
Priority: 82
TTL: Auto
```

## Test Email Receiving
After setup, send test emails to:
- `hello@leish.my`
- `bookings@leish.my`

They should arrive in `leishstudio.main@gmail.com` inbox.

## View Emails in Cloudflare Dashboard
- Go to **Email** → **Email Routing** → **Activity**
- See all received/emailed forwarded

## Cost
**Free** - Cloudflare Email Routing is free for unlimited emails.

## Next Steps
Once configured, you can:
1. Read all emails sent to `@leish.my` in `leishstudio.main@gmail.com` inbox
2. Reply from Gmail (emails will show as from your Gmail, not @leish.my)
3. Upgrade to Cloudflare Email Workers for custom auto-replies
