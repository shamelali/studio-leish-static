import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Bookings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings');
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  const bookings = data?.bookings || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Bookings</h1>
        <button className="btn">+ New Booking</button>
      </div>

      <div className="card">
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No bookings yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Client</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Room</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem' }}>{b.id}</td>
                  <td style={{ padding: '0.75rem' }}>{b.clientName}</td>
                  <td style={{ padding: '0.75rem' }}>{b.clientEmail}</td>
                  <td style={{ padding: '0.75rem' }}>{b.room}</td>
                  <td style={{ padding: '0.75rem' }}>{b.date} {b.time}</td>
                  <td style={{ padding: '0.75rem' }}>MYR {b.totalAmount}</td>
                  <td style={{ padding: '0.75rem' }}>
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
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => deleteMutation.mutate(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}