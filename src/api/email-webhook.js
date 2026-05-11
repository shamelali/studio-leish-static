// Email webhook endpoint - receives emails via Cloudflare Email Workers
// This can be used if you want to process incoming emails programmatically

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = req.body;

    // Log received email
    console.log('📧 Incoming email:', {
      from: email.from,
      to: email.to,
      subject: email.subject,
      timestamp: new Date().toISOString()
    });

    // Parse email content
    const { from, to, subject, text, html } = email;

    // Route based on recipient
    if (to.includes('bookings@leish.my')) {
      await handleBookingEmail(email);
    } else if (to.includes('hello@leish.my')) {
      await handleGeneralInquiry(email);
    }

    // Store in Supabase (optional)
    if (process.env.SUPABASE_URL) {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

      await supabase.from('incoming_emails').insert([{
        from_email: from,
        to_email: to,
        subject,
        body_text: text,
        body_html: html,
        received_at: new Date().toISOString()
      }]);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Email webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleBookingEmail(email) {
  // Auto-reply to booking inquiries
  console.log('Booking inquiry from:', email.from);

  // You can integrate with your booking system here
  // e.g., create a lead, send auto-reply, etc.
}

async function handleGeneralInquiry(email) {
  // Handle general inquiries
  console.log('General inquiry from:', email.from);
}
