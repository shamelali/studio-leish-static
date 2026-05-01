module.exports = async (req, res) => {
  // Billplz callback/webhook
  const { billplz } = req.query;

  if (!billplz) {
    return res.status(400).send('Invalid callback');
  }

  // Verify the bill ID and update booking status in Supabase
  const supabaseUrl = 'https://vnpiekiedynvechawhhw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucGlla2llZHludmVjaGF3aGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NDYzNSwiZXhwIjoyMDkwNjQwNjM1fQ.8m2J0PdMUG43l-jnYbQ7VoyHUqdzdfJyY';
  
  const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY || '0d8aa179-da8b-439d-977e-a29567e13852';

  try {
    // Fetch bill status from Billplz
    const billResponse = await fetch(`https://www.billplz.com/api/v3/bills/${billplz}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(BILLPLZ_API_KEY + ':').toString('base64')}`
      }
    });

    const bill = await billResponse.json();

    if (bill.state === 'paid') {
      // Update booking in Supabase
      const { error } = await require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey)
        .from('bookings')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('booking_id', bill.description.split(' ')[2]); // Assuming description contains booking ID

      if (error) console.error('Supabase update error:', error);
    }

    // Redirect user to success page
    return res.redirect(302, `https://studio-leish-static.vercel.app/book.html?payment=success&booking=${bill.description.split(' ')[2]}`);
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect(302, `https://studio-leish-static.vercel.app/book.html?payment=failed`);
  }
};
