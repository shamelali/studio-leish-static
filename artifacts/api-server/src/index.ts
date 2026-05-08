import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { neon } from '@neondatabase/serverless';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@helium/heliumdb?sslmode=disable';
const sql = neon(DATABASE_URL);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tables', async (req, res) => {
  try {
    const tables = await sql(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    res.json({ tables: tables.map(t => t.tablename) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await sql('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await sql('SELECT * FROM rooms ORDER BY name');
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await sql('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await sql('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await sql('SELECT * FROM images WHERE is_active = true ORDER BY display_order');
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await sql('SELECT * FROM site_settings');
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const [totalBookings, totalRevenue, avgRating, roomStats] = await Promise.all([
      sql('SELECT COUNT(*) as count FROM bookings'),
      sql("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = 'paid'"),
      sql('SELECT AVG(rating) as avg FROM reviews WHERE is_active = true'),
      sql(`SELECT room, COUNT(*) as count FROM bookings GROUP BY room ORDER BY count DESC LIMIT 5`)
    ]);
    res.json({
      totalBookings: totalBookings[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgRating: avgRating[0]?.avg || 0,
      topRooms: roomStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;