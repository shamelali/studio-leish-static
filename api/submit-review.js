// API: Submit Review
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { booking_id, rating, comment, client_email } = req.body;

    if (!booking_id || !rating || !client_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insert review
    const { data, error } = await supabase
      .from('Review')
      .insert([{
        booking_id,
        client_email,
        rating,
        comment: comment || null
      }])
      .select();

    if (error) throw error;

    // Also update the booking with rating
    await supabase
      .from('Booking')
      .update({ 
        rating: rating,
        review_comment: comment 
      })
      .eq('booking_id', booking_id);

    return res.status(200).json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: data[0]
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({ error: error.message });
  }
};