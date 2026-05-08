import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Settings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      return res.json();
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (settings: any[]) => {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  const settings = data?.settings || [];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Settings</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Site Settings</h2>
        {settings.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No settings configured</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {settings.map((s: any) => (
              <div key={s.id}>
                <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {s.settingKey}
                </label>
                <input 
                  className="input"
                  defaultValue={s.settingValue}
                  onBlur={(e) => {
                    // Save on blur - simplified for now
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary">Export Data</button>
          <button className="btn-secondary">Backup Database</button>
          <button className="btn-secondary">Clear Cache</button>
        </div>
      </div>
    </div>
  );
}