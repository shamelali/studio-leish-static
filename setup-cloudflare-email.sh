#!/bin/bash
# Cloudflare Email Routing Setup Script
# Usage: ./setup-cloudflare-email.sh

echo "========================================="
echo "  Cloudflare Email Routing Setup"
echo "========================================="
echo ""

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ CLOUDFLARE_API_TOKEN not set"
    echo ""
    echo "To get your API token:"
    echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Edit zone DNS' template"
    echo "4. Set Zone Resources: Include | Specific zone | leish.my"
    echo "5. Copy the token and run:"
    echo "   export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

# Get Zone ID for leish.my
echo "🔍 Fetching Zone ID for leish.my..."
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=leish.my" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
    echo "❌ Could not find Zone ID for leish.my"
    exit 1
fi

echo "✅ Zone ID: $ZONE_ID"
echo ""

# Enable Email Routing
echo "📧 Enabling Email Routing..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/enable" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" > /dev/null

echo "✅ Email Routing enabled"
echo ""

# Add destination address
echo "📬 Adding destination address: leishstudio.main@gmail.com"
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/addresses" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"email":"leishstudio.main@gmail.com"}' > /dev/null

echo "✅ Destination address added (check inbox for verification)"
echo ""

# Create email routes
echo "📍 Creating email routes..."

routes=(
    "hello@leish.my"
    "bookings@leish.my"
    "studio@leish.my"
    "admin@leish.my"
)

for email in "${routes[@]}"; do
    echo "  Creating route: $email"
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"matcher\":{\"type\":\"literal\",\"value\":\"$email\"},
            \"action\":{\"type\":\"forward\",\"values\":[\"leishstudio.main@gmail.com\"]}
        }" > /dev/null
done

echo "✅ Email routes created"
echo ""

# Enable catch-all
echo "🌐 Enabling catch-all rule..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "matcher":{"type":"all"},
        "action":{"type":"forward","values":["leishstudio.main@gmail.com"]}
    }' > /dev/null

echo "✅ Catch-all enabled"
echo ""
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Check leishstudio.main@gmail.com for verification email"
echo "2. Click the verification link"
echo "3. Send test emails to hello@leish.my, bookings@leish.my"
echo "4. Verify they arrive in Gmail inbox"
echo ""
