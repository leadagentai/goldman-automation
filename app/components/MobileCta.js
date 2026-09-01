import Link from 'next/link';

// Global sticky bottom CTA, shown on small screens on every page.
// Links to the shared <ContactSection id="contact"> that every page renders.
export default function MobileCta() {
  return (
    <Link href="#contact" className="mobile-cta">
      <span className="btn btn-primary">Book a free audit</span>
    </Link>
  );
}
