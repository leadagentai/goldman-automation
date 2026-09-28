import Link from 'next/link';

// Shared footer for every page.
// "Request a callback" is the audit CTA (-> shared contact form).
// The hello@ address is a separate general-enquiries contact, not the CTA.
export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-brand">
          <Link href="/" className="logo">Goldman<span>.</span></Link>
          <p>
            Automation studio · London + remote across the UK
            <br />
            Designed, built and run by Adrian.
          </p>
        </div>
        <div className="foot-links">
          <div className="foot-col">
            <h4>Explore</h4>
            <Link href="/#results">Results</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#about">About</Link>
            <Link href="/trades">Trades</Link>
            <Link href="/clinics">Clinics</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="foot-col">
            <h4>Get in touch</h4>
            <Link href="/#contact">Book a free audit</Link>
            <a href="mailto:hello@goldmanautomation.co.uk">
              hello@goldmanautomation.co.uk
            </a>
            <span className="foot-note">General enquiries only — for an audit, use the form.</span>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="wrap">
          <span>© 2026 Goldman Automation</span>
          <span>
            <Link href="/privacy">Privacy policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
