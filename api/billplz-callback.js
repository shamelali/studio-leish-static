const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// ── Supabase (service role — server-side only, never expose in frontend) ──────
const supabase = createClient(
  'https://kcmoibrqyrzueslaqtgc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Billplz X-Signature verification ─────────────────────────────────────────
function verifySignature(payload, receivedSig) {
  const secret = process.env.BILLPLZ_X_SIGNATURE_KEY;
  if (!secret) return true;

  const sorted = Object.keys(payload)
    .filter(k => k !== 'x_signature')
    .sort()
    .map(k => `${k}${payload[k]}`)
    .join('|');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(sorted)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(receivedSig, 'hex')
  );
}

// ── Extract booking ID from description safely ────────────────────────────────
function extractBookingId(description) {
  const match = (description || '').match(/LEISH-\d+/);
  return match ? match[0] : null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  const SITE_URL = process.env.SITE_URL || 'https://studio.leish.my';

  const payload = req.method === 'POST' ? req.body : req.query;

  if (!payload || !payload.billplz) {
    return res.status(400).send('Invalid callback — missing billplz param');
  }

  const billId     = payload.billplz;
  const xSig      = payload.x_signature;
  const isPaid     = payload.billplz_paid === 'true';

  if (xSig && !verifySignature(payload, xSig)) {
    console.error('X-Signature mismatch — possible spoofed callback');
    return res.status(400).send('Invalid signature');
  }

  const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY;
  if (!BILLPLZ_API_KEY) {
    return res.status(500).send('BILLPLZ_API_KEY not configured');
  }

  const BILLPLZ_ENDPOINT = process.env.BILLPLZ_ENDPOINT || 'https://www.billplz.com/api/v3/';

  try {
    const billRes = await fetch(`${BILLPLZ_ENDPOINT}bills/${billId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(BILLPLZ_API_KEY + ':').toString('base64')}`
      }
    });

    if (!billRes.ok) {
      console.error('Billplz API error:', await billRes.text());
      return res.redirect(302, `${SITE_URL}/book.html?payment=failed`);
    }

    const bill = await billRes.json();
    const bookingId = extractBookingId(bill.description);

    if (!bookingId) {
      console.error('Could not extract booking ID from description:', bill.description);
      return res.redirect(302, `${SITE_URL}/book.html?payment=failed`);
    }

    if (bill.state === 'paid') {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          bill_id: billId,
          paid_at: new Date().toISOString()
        })
        .eq('booking_id', bookingId);

      if (error) {
        console.error('Supabase update error:', error.message);
      } else {
        console.log(`Booking ${bookingId} confirmed — bill ${billId}`);
      }

      return res.redirect(302, `${SITE_URL}/book.html?payment=success&booking=${bookingId}`);
    }

    return res.redirect(302, `${SITE_URL}/book.html?payment=cancelled&booking=${bookingId}`);

  } catch (err) {
    console.error('Callback error:', err.message);
    return res.redirect(302, `${SITE_URL}/book.html?payment=failed`);
  }
};