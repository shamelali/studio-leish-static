module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId, amount, customerName, customerEmail } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY;
  if (!BILLPLZ_API_KEY) {
    return res.status(500).json({ error: 'BILLPLZ_API_KEY not configured' });
  }
  const BILLPLZ_COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID || 'ogf1esbw';
  const BILLPLZ_ENDPOINT = process.env.BILLPLZ_ENDPOINT || 'https://www.billplz.com/api/v3/';

  try {
    // Create bill
    const billData = {
      collection_id: BILLPLZ_COLLECTION_ID,
      email: customerEmail,
      mobile: '',
      name: customerName,
      amount: amount * 100, // Billplz expects amount in cents
      callback_url: `${req.headers['x-forwarded-proto']}://${req.headers['host']}/api/billplz-callback`,
      description: `Studio Leish Booking ${bookingId}`
    };

    const response = await fetch(`${BILLPLZ_ENDPOINT}bills`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(BILLPLZ_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(billData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Billplz error:', result);
      return res.status(500).json({ error: 'Failed to create bill' });
    }

    // Return bill URL for redirect
    return res.status(200).json({
      bill_url: result.url,
      bill_id: result.id
    });

  } catch (error) {
    console.error('Error creating Billplz bill:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
