const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@helium/heliumdb?sslmode=disable';
  const sql = neon(DATABASE_URL);

  const path = req.url?.split('?')[0] || '';

  try {
    // Health check
    if (path === '/api/health' || path === '/health') {
      return res.status(200).json({ status: 'ok' });
    }

    // Get tables
    if (path === '/api/tables') {
      const tables = await sql(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);
      return res.status(200).json({ tables: tables.map(t => t.tablename) });
    }

    // Get bookings
    if (path === '/api/bookings') {
      const bookings = await sql('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100');
      return res.status(200).json({ bookings });
    }

    // Get rooms
    if (path === '/api/rooms') {
      const rooms = await sql('SELECT * FROM rooms ORDER BY name');
      return res.status(200).json({ rooms });
    }

    // Get users
    if (path === '/api/users') {
      const users = await sql('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
      return res.status(200).json({ users });
    }

    // Get reviews
    if (path === '/api/reviews') {
      const reviews = await sql('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100');
      return res.status(200).json({ reviews });
    }

    // Get images
    if (path === '/api/images') {
      const images = await sql('SELECT * FROM images WHERE is_active = true ORDER BY display_order');
      return res.status(200).json({ images });
    }

    // Get settings
    if (path === '/api/settings') {
      const settings = await sql('SELECT * FROM site_settings');
      return res.status(200).json({ settings });
    }

    // Get analytics
    if (path === '/api/analytics') {
      const [totalBookings, totalRevenue, avgRating, roomStats] = await Promise.all([
        sql('SELECT COUNT(*) as count FROM bookings'),
        sql("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'paid'"),
        sql('SELECT AVG(rating) as avg FROM reviews WHERE is_active = true'),
        sql(`SELECT room, COUNT(*) as count FROM bookings GROUP BY room ORDER BY count DESC LIMIT 5`)
      ]);
      return res.status(200).json({
        totalBookings: totalBookings[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgRating: avgRating[0]?.avg || 0,
        topRooms: roomStats
      });
    }

    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};