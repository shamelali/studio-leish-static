// API: Analytics Dashboard Data
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get date range from query (default: last 30 days)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 1. Total bookings
    const { count: totalBookings } = await supabase
      .from('Booking')
      .select('*', { count: 'exact', head: true });

    // 2. Bookings by status
    const { data: statusData } = await supabase
      .from('Booking')
      .select('status');

    const statusCounts = {};
    statusData?.forEach(b => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });

    // 3. Revenue by status (confirmed/completed)
    const { data: revenueData } = await supabase
      .from('Booking')
      .select('total_amount, status')
      .in('status', ['confirmed', 'completed']);

    const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

    // 4. Bookings by room
    const { data: roomData } = await supabase
      .from('Booking')
      .select('room');

    const roomCounts = {};
    roomData?.forEach(b => {
      roomCounts[b.room] = (roomCounts[b.room] || 0) + 1;
    });

    // 5. Bookings by day of week
    const { data: dateData } = await supabase
      .from('Booking')
      .select('booking_date');

    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dateData?.forEach(b => {
      if (b.booking_date) {
        const day = daysOfWeek[new Date(b.booking_date).getDay()];
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    });

    // 6. Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: trendData } = await supabase
      .from('Booking')
      .select('booking_date, total_amount')
      .gte('booking_date', sixMonthsAgo.toISOString().split('T')[0]);

    const monthlyTrend = {};
    trendData?.forEach(b => {
      if (b.booking_date) {
        const month = b.booking_date.substring(0, 7); // YYYY-MM
        if (!monthlyTrend[month]) {
          monthlyTrend[month] = { count: 0, revenue: 0 };
        }
        monthlyTrend[month].count++;
        monthlyTrend[month].revenue += b.total_amount || 0;
      }
    });

    // 7. Average rating
    const { data: reviewData } = await supabase
      .from('Review')
      .select('rating');

    const avgRating = reviewData?.length 
      ? (reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length).toFixed(1)
      : null;

    return res.status(200).json({
      summary: {
        total_bookings: totalBookings,
        total_revenue: totalRevenue,
        average_rating: avgRating
      },
      by_status: statusCounts,
      by_room: roomCounts,
      by_day: dayCounts,
      monthly_trend: monthlyTrend,
      period_days: days
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: error.message });
  }
};