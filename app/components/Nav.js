'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const active = { color: 'var(--green-deep)' };

  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/" className="logo">Goldman<span>.</span></Link>
        <div className="nav-links">
          <Link href="/#results" className="lk">Results</Link>
          <Link href="/#how-it-works" className="lk">How it works</Link>
          <Link href="/#about" className="lk">About</Link>
          <Link href="/trades" className="lk" style={pathname === '/trades' ? active : undefined}>
            Trades
          </Link>
          <Link href="/clinics" className="lk" style={pathname === '/clinics' ? active : undefined}>
            Clinics
          </Link>
          <Link href="/#contact" className="btn btn-primary">Book a callback</Link>
        </div>
      </div>
    </nav>
  );
}
