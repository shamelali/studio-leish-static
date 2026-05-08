import { useQuery } from '@tanstack/react-query';

export default function Rooms() {
  const { data, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await fetch('/api/rooms');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;

  const rooms = data?.rooms || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Rooms</h1>
        <button className="btn">+ New Room</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {rooms.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No rooms yet</p>
        ) : (
          rooms.map((r: any) => (
            <div key={r.id} className="card">
              {r.imageUrl && (
                <img 
                  src={r.imageUrl} 
                  alt={r.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }}
                />
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{r.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{r.type}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>MYR {r.pricePerHour}/hr</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{r.description}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  background: r.isActive ? 'rgba(0, 217, 165, 0.2)' : 'rgba(233, 69, 96, 0.2)',
                  color: r.isActive ? 'var(--color-success)' : 'var(--color-accent)'
                }}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}