const { Pool } = require('pg');

const pool = new Pool({
  host: 'helium',
  port: 5432,
  database: 'heliumdb',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: false
});

module.exports = async function handler(req, res) {
  const path = (req.url || '').split('?')[0];

  try {
    const client = await pool.connect();

    if (path === '/api/health') {
      client.release();
      return res.status(200).json({ status: 'ok' });
    }

    if (path === '/api/tables') {
      const result = await client.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `);
      client.release();
      return res.status(200).json({ tables: result.rows.map(r => r.tablename) });
    }

    if (path === '/api/bookings') {
      const result = await client.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100');
      client.release();
      return res.status(200).json({ bookings: result.rows });
    }

    if (path === '/api/rooms') {
      const result = await client.query('SELECT * FROM rooms ORDER BY name');
      client.release();
      return res.status(200).json({ rooms: result.rows });
    }

    if (path === '/api/users') {
      const result = await client.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
      client.release();
      return res.status(200).json({ users: result.rows });
    }

    if (path === '/api/reviews') {
      const result = await client.query('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100');
      client.release();
      return res.status(200).json({ reviews: result.rows });
    }

    if (path === '/api/images') {
      const result = await client.query('SELECT * FROM images WHERE is_active = true ORDER BY display_order');
      client.release();
      return res.status(200).json({ images: result.rows });
    }

    if (path === '/api/settings') {
      const result = await client.query('SELECT * FROM site_settings');
      client.release();
      return res.status(200).json({ settings: result.rows });
    }

    if (path === '/api/analytics') {
      const [tb, tr, ar, rs] = await Promise.all([
        client.query('SELECT COUNT(*) as count FROM bookings'),
        client.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'paid'"),
        client.query('SELECT AVG(rating) as avg FROM reviews WHERE is_active = true'),
        client.query("SELECT room, COUNT(*) as count FROM bookings GROUP BY room ORDER BY count DESC LIMIT 5")
      ]);
      client.release();
      return res.status(200).json({
        totalBookings: tb.rows[0]?.count || 0,
        totalRevenue: tr.rows[0]?.total || 0,
        avgRating: ar.rows[0]?.avg || 0,
        topRooms: rs.rows
      });
    }

    client.release();
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};