import { Link, useLocation } from 'wouter';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/bookings', label: 'Bookings', icon: '📅' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/rooms', label: 'Rooms', icon: '🚪' },
  { path: '/images', label: 'Images', icon: '🖼️' },
  { path: '/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--color-secondary)',
      borderRight: '1px solid var(--color-border)',
      padding: '1.5rem 1rem',
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--color-text), var(--color-accent))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem',
      }}>
        Leish Studio
      </h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map(item => (
          <Link key={item.path} href={item.path}>
            <a className={clsx(
              'nav-item',
              location === item.path && 'active'
            )} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              color: location === item.path ? 'var(--color-accent)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}