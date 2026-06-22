'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const active = { color: 'var(--teal)' };

  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/" className="logo">Goldman<span>.</span></Link>
        <div className="nav-links">
          <Link href="/trades" className="lk" style={pathname === '/trades' ? active : undefined}>
            For trades
          </Link>
          <Link href="/clinics" className="lk" style={pathname === '/clinics' ? active : undefined}>
            For clinics
          </Link>
          <a
            href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit"
            className="btn btn-primary"
          >
            Free audit
          </a>
        </div>
      </div>
    </nav>
  );
}
