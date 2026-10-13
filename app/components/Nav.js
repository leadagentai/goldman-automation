'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/#results', label: 'Results' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#about', label: 'About' },
  { href: '/trades', label: 'Trades' },
  { href: '/clinics', label: 'Clinics' },
  { href: '/calculator', label: 'Calculator' },
];

export default function Nav() {
  const pathname = usePathname();
  const active = { color: 'var(--green-deep)' };
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // Unlock scroll synchronously so in-page links (/#results) can scroll straight away.
  const close = useCallback((returnFocus) => {
    document.body.style.overflow = '';
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Close on route change.
  useEffect(() => {
    close(false);
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        close(true);
        return;
      }
      // Keep Tab inside the menu button + panel while open.
      if (e.key !== 'Tab') return;
      const items = [buttonRef.current, ...panelRef.current.querySelectorAll('a')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <nav className={open ? 'site-nav menu-open' : 'site-nav'}>
      <div className="wrap nav-inner">
        <Link href="/" className="logo">Goldman<span>.</span></Link>
        <div className="nav-links">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="lk" style={pathname === href ? active : undefined}>
              {label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-primary nav-cta">Book a free audit</Link>
          <button
            type="button"
            ref={buttonRef}
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => (open ? close(true) : setOpen(true))}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="site-menu" className="nav-menu" ref={panelRef} hidden={!open}>
        <div className="wrap">
          <ul>
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  onClick={() => close(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#contact" className="btn btn-primary btn-block" onClick={() => close(false)}>
            Book a free audit
          </Link>
        </div>
      </div>
      {open && <div className="nav-backdrop" aria-hidden="true" onClick={() => close(true)} />}
    </nav>
  );
}
