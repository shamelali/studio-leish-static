import { useQuery } from '@tanstack/react-query';

export default function Reviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await fetch('/api/reviews');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;

  const reviews = data?.reviews || [];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Reviews</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet</p>
        ) : (
          reviews.map((r: any) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--color-warning)' }}>
                  {'★'.repeat(r.rating)}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {r.room}
                </span>
              </div>
              <p style={{ marginBottom: '0.5rem' }}>{r.comment}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}