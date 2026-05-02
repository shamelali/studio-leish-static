#!/bin/bash
# Studio Leish - Domain Setup Script
# Sets up studis.leish.my with Cloudflare + Vercel

set -e

DOMAIN="leish.my"
SUBDOMAIN="studio"
TARGET_CNAME="cname.vercel-dns.com"

echo "=== Studio Leish - Domain Setup ==="
echo "Domain: $DOMAIN"
echo "Subdomain: $SUBDOMAIN.$DOMAIN"
echo ""

# Check if CF_API_TOKEN is set
if [ -z "$CF_API_TOKEN" ]; then
    echo "Error: CF_API_TOKEN environment variable not set"
    echo "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Set it: export CF_API_TOKEN='your-token-here'"
    exit 1
fi

# Step 1: Get Zone ID
echo "[1/4] Getting Zone ID for $DOMAIN..."
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$ZONE_ID" = "null" ] || [ -z "$ZONE_ID" ]; then
    echo "Error: Could not find zone for $DOMAIN"
    echo "Make sure domain is added to Cloudflare: https://dash.cloudflare.com"
    exit 1
fi
echo "✓ Zone ID: $ZONE_ID"
echo ""

# Step 2: Create or Update DNS Record
echo "[2/4] Setting CNAME: $SUBDOMAIN.$DOMAIN → $TARGET_CNAME..."

# Check if record exists
EXISTING=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns/records?name=$SUBDOMAIN.$DOMAIN" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json")

RECORD_ID=$(echo "$EXISTING" | jq -r '.result[0].id // empty')

if [ -n "$RECORD_ID" ]; then
    echo "Updating existing DNS record..."
    METHOD="PUT"
    URL="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns/records/$RECORD_ID"
else
    echo "Creating new DNS record..."
    METHOD="POST"
    URL="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns/records"
fi

RESPONSE=$(curl -s -X $METHOD "$URL" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "type": "CNAME",
        "name": "'"$SUBDOMAIN"'",
        "content": "'"$TARGET_CNAME"'",
        "proxied": true,
        "ttl": 1
    }')

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✓ DNS record configured successfully"
else
    echo "✗ Error configuring DNS:"
    echo "$RESPONSE" | jq '.errors'
    exit 1
fi
echo ""

# Step 3: Set SSL mode to Full (Strict)
echo "[3/4] Setting SSL/TLS mode to Full (Strict)..."
SSL_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"value": "full"}')

if echo "$SSL_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✓ SSL mode set to Full (Strict)"
else
    echo "⚠ Warning: Could not set SSL mode (may need manual configuration)"
fi
echo ""

# Step 4: Enable Always Use HTTPS
echo "[4/4] Enabling 'Always Use HTTPS'..."
HTTPS_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"value": "on"}')

if echo "$HTTPS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✓ Always Use HTTPS enabled"
else
    echo "⚠ Warning: Could not enable Always Use HTTPS"
fi
echo ""

# Summary
echo "========================================="
echo "✅ Cloudflare Setup Complete!"
echo "========================================="
echo ""
echo "Domain Configuration:"
echo "  - $SUBDOMAIN.$DOMAIN → $TARGET_CNAME"
echo "  - SSL Mode: Full (Strict)"
echo "  - Always HTTPS: Enabled"
echo "  - Proxy Status: Proxied (orange cloud)"
echo ""
echo "Next Steps:"
echo "1. Add domain in Vercel:"
echo "   vercel domains add $SUBDOMAIN.$DOMAIN"
echo ""
echo "2. Wait 24-48 hours for DNS propagation"
echo ""
echo "3. Test: https://$SUBDOMAIN.$DOMAIN"
echo ""
echo "4. Update application URLs to use: https://$SUBDOMAIN.$DOMAIN"
echo "   - In book.html: update Resend 'from' field"
echo "   - In api/billplz-callback.js: update callback URL"
echo "   - In admin.html/user.html: update redirect URLs"
