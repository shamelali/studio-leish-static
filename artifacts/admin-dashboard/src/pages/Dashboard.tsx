import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      return res.json();
    }
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      return data.bookings?.slice(0, 10) || [];
    }
  });

  if (analyticsLoading) return <div>Loading...</div>;

  const stats = analytics || { totalBookings: 0, totalRevenue: 0, avgRating: 0, topRooms: [] };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {stats.totalBookings}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Total Bookings</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            MYR {stats.totalRevenue}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Total Revenue</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {stats.avgRating?.toFixed(1) || '0'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Avg Rating</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {(stats.topRooms || []).length}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Active Rooms</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Top Rooms</h2>
        <div className="card">
          {(stats.topRooms || []).length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No data yet</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {(stats.topRooms || []).map((room: any, i: number) => (
                <li key={i} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: i < (stats.topRooms || []).length - 1 ? '1px solid var(--color-border)' : 'none'
                }}>
                  <span>{room.room}</span>
                  <span style={{ color: 'var(--color-accent)' }}>{room.count} bookings</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Bookings</h2>
        <div className="card">
          {bookingsLoading ? (
            <p>Loading...</p>
          ) : bookings?.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No bookings yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 0' }}>Client</th>
                  <th style={{ padding: '0.75rem 0' }}>Room</th>
                  <th style={{ padding: '0.75rem 0' }}>Date</th>
                  <th style={{ padding: '0.75rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((b: any, i: number) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 0' }}>{b.clientName}</td>
                    <td style={{ padding: '0.75rem 0' }}>{b.room}</td>
                    <td style={{ padding: '0.75rem 0' }}>{b.date}</td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        background: b.status === 'confirmed' ? 'rgba(0, 217, 165, 0.2)' : 'rgba(244, 208, 63, 0.2)',
                        color: b.status === 'confirmed' ? 'var(--color-success)' : 'var(--color-warning)'
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}