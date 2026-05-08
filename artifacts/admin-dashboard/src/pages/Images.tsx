import { useQuery } from '@tanstack/react-query';

export default function Images() {
  const { data, isLoading } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const res = await fetch('/api/images');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;

  const images = data?.images || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Images</h1>
        <button className="btn">+ Upload Image</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No images yet</p>
        ) : (
          images.map((img: any) => (
            <div key={img.id} style={{ position: 'relative' }}>
              <img 
                src={img.url} 
                alt={img.altText}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{img.altText || img.imageType}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}