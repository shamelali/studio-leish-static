#!/bin/bash
# Resend Domain Verification Setup
# Adds DNS records for leish.my domain in Resend

echo "========================================="
echo "  Resend Domain Setup - leish.my"
echo "========================================="
echo ""

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ CLOUDFLARE_API_TOKEN not set"
    echo ""
    echo "Get your API token from:"
    echo "https://dash.cloudflare.com/profile/api-tokens"
    echo ""
    exit 1
fi

ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=leish.my" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ZONE_ID" ]; then
    echo "❌ Could not find Zone ID for leish.my"
    exit 1
fi

echo "✅ Zone ID: $ZONE_ID"
echo ""

echo "Adding DNS records for Resend verification..."
echo ""

# Add SPF record (for email sending)
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "type": "TXT",
        "name": "leish.my",
        "content": "v=spf1 include:_spf.resend.com ~all",
        "priority": 0,
        "ttl": 3600
    }' | jq -r '.success'

echo "✅ SPF record added"

# Add DKIM record (for email signing) - Resend uses subdomain
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "type": "TXT",
        "name": "resend._domainkey.leish.my",
        "content": "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy6Zq3v3qJJOMf3SVCpW8oM3Xc7P6W9vR2qKbLqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQqJcNmK8rP5XW1tP2mTqQIDAQAB",
        "priority": 0,
        "ttl": 3600
    }' | jq -r '.success'

echo "✅ DKIM record added (placeholder - update with real key from Resend)"

# Add MX record for inbound (optional - if using Resend for receiving)
# curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" ...

echo ""
echo "========================================="
echo "  ✅ DNS Records Added"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Go to: https://resend.com/domains"
echo "2. Add leish.my domain"
echo "3. Copy the DKIM key from Resend and update the DNS record"
echo "4. Wait for verification (may take up to 24h)"
echo ""