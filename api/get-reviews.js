// API: Get Reviews
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { room, limit = 10 } = req.query;

    let query = supabase
      .from('Review')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (room) {
      query = query.eq('room', room);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate average rating
    const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / (data.length || 1);

    return res.status(200).json({
      reviews: data,
      average_rating: avgRating.toFixed(1),
      total_reviews: data.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: error.message });
  }
};