import Link from 'next/link';
import Script from 'next/script';
import Nav from '../components/Nav';

export const metadata = {
  title: 'Booking Automation for Salons & Clinics | Goldman Automation London',
  description:
    'AI booking and automation for London salons, aesthetic clinics, physios and dental practices. 24/7 AI receptionist, deposit capture, digital records. From £750 setup + £297/mo.',
  openGraph: {
    title: 'Booking Automation for Salons & Clinics | Goldman Automation',
    description:
      'Scure gives London clinics a 24/7 AI receptionist that books, reminds and keeps records — while you focus on your clients.',
    type: 'website',
    locale: 'en_GB',
    url: 'https://goldmanautomation.co.uk/clinics/',
    images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
  },
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/clinics/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://goldmanautomation.co.uk/clinics/#service',
      name: 'Fully Booked — Salon & Clinic Automation',
      provider: { '@id': 'https://goldmanautomation.co.uk/#org' },
      description:
        'Done-for-you booking and practice management automation for London salons, aesthetic clinics, physios and dental practices. 24/7 AI receptionist, deposit capture, no-show reduction and digital records.',
      areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'Country', name: 'United Kingdom' },
      ],
      serviceType: 'Booking Automation and Practice Management',
      offers: {
        '@type': 'Offer',
        price: '750',
        priceCurrency: 'GBP',
        description: 'Setup fee for the beauty and clinic automation package',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://goldmanautomation.co.uk/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'For Clinics',
          item: 'https://goldmanautomation.co.uk/clinics/',
        },
      ],
    },
  ],
};

const animationScript = `
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e)});
  }
})();
`;

export default function ClinicsPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap">
          <span className="eyebrow reveal">// automation for clinics · London</span>
          <h1 className="reveal">Stop losing bookings to missed calls, and revenue to <em>no-shows</em>.</h1>
          <p className="lead reveal">Scure gives your salon or clinic a 24/7 AI receptionist that books clients, sends reminders, captures deposits, keeps records and chases reviews — while you focus on the work. <b>Built for beauty studios, aesthetic clinics, physios and dental practices.</b></p>
          <div className="hero-cta reveal">
            <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-primary">Book a free audit <span aria-hidden="true">→</span></a>
            <a href="#how-it-works" className="btn btn-ghost">How it works <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-note reveal">For salons, aesthetic clinics, physios and dental practices across London.</p>
        </div>
      </header>

      <section id="pains">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// where clinics lose money</span>
            <h2>You can&#39;t grow a business while running the front desk from a treatment room.</h2>
            <p>The gaps in a clinic&#39;s revenue are almost always the same: missed calls, no-shows, admin that doesn&#39;t happen, and clients who don&#39;t come back.</p>
          </div>
          <div className="prob-grid">
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">◇</div>
              <h3>Missed calls mid-treatment</h3>
              <p>You can&#39;t answer the phone with your hands busy. Every unanswered call is a booking that might go to a competitor — or nowhere.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">○</div>
              <h3>No-shows drain the diary</h3>
              <p>One no-show costs you the slot, the product and the income. Without deposits and automated reminders, they keep happening every week.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">▢</div>
              <h3>Admin slows every day</h3>
              <p>Consultation forms on paper, chasing signatures, keeping records by hand. Admin that eats fifteen minutes out of every appointment.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">⋈</div>
              <h3>Clients who don&#39;t come back</h3>
              <p>They left meaning to rebook. Without a nudge at 28 days, most won&#39;t. Your retention is draining quietly in the background.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{background:'var(--bone-alt)'}}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// the scure system</span>
            <h2>A full practice management system, built for busy clinics.</h2>
            <p>Built from running a North London beauty studio — every feature came from a real operational problem.</p>
          </div>
          <div className="case case-light reveal">
            <div className="case-top">
              <h3>Scure</h3>
              <span className="ctag ctag-l">Beauty &amp; clinics</span>
            </div>
            <div className="feat-grid">
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> 24/7 AI receptionist</div>
                <div className="fd">Answers in English and Polish, recommends the right treatment, checks real availability and books the visit. Day or night, no missed calls.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Deposit capture that kills no-shows</div>
                <div className="fd">Deposits taken at booking, not on the day. Clients who have paid show up. No-shows drop immediately without any effort from you.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Automated reminder sequences</div>
                <div className="fd">Day-before and morning-of reminders go automatically. Post-visit thank-you follows. All sent on time, every time, without your input.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Rebooking nudges at 28 days</div>
                <div className="fd">Clients who haven&#39;t rebooked get a gentle nudge at 28 days. Retention that runs itself, consistently, in the background.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Review requests after every visit</div>
                <div className="fd">A review request goes automatically after every completed appointment. Five-star reviews build themselves over time.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Digital consultation forms &amp; consents</div>
                <div className="fd">Sent before the appointment and completed by the client on their phone. No clipboards, no paper, no chasing signatures on the day.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Client records with before/after photos</div>
                <div className="fd">Per-client profiles with treatment notes, photos, digital consents and signatures — searchable, GDPR-safe, never lost.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Owner dashboard</div>
                <div className="fd">Calendar, booking blocks, availability and content publishing from a single panel. No developer needed to make changes.</div>
              </div>
            </div>
            <div className="case-stats">
              <div className="cstat"><div className="cn">21</div><div className="cl">five-star Google reviews</div></div>
              <div className="cstat"><div className="cn">EN / PL</div><div className="cl">bilingual receptionist</div></div>
              <div className="cstat"><div className="cn">0</div><div className="cl">enquiries missed overnight</div></div>
            </div>
            <p className="touch">A small touch clients notice: a step-by-step parking guide arrives automatically with every booking confirmation.</p>
          </div>
        </div>
      </section>

      <section id="process">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// how it works</span>
            <h2>Simple, fixed-scope, no lock-in</h2>
            <p>You don&#39;t need a spec or a tech team. Bring the problem; I&#39;ll quantify it, build the fix, and support it.</p>
          </div>
          <div className="proc-grid">
            <div className="proc-step reveal">
              <div className="pn">step 01</div>
              <h3>Free lost-revenue audit</h3>
              <p>A 20-minute call where we put a real number on what missed bookings, no-shows and admin are costing you. No pitch, just the figure.</p>
            </div>
            <div className="proc-step reveal">
              <div className="pn">step 02</div>
              <h3>Fixed-scope go-live</h3>
              <p>One setup fee, one clear scope, live in approximately 14 days. I build and tune the system around your practice and hand it over working.</p>
            </div>
            <div className="proc-step reveal">
              <div className="pn">step 03</div>
              <h3>Monthly support</h3>
              <p>I monitor, maintain and improve it as you grow. 30-day rolling, no long contracts, cancel any time.</p>
            </div>
          </div>
          <div className="guarantee reveal">
            <span className="gi" aria-hidden="true">◆</span>
            <p><b>Straight talk guarantee.</b> If the audit shows automation won&#39;t pay for itself in your practice, I&#39;ll tell you that plainly — and we won&#39;t go ahead. I&#39;d rather have your trust than a bad fit.</p>
          </div>
        </div>
      </section>

      <section className="pack-wrap" id="pricing">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// pricing</span>
            <h2>Fixed scope. Fixed price. Live in days.</h2>
            <p>One setup fee, one clear scope, live in approximately 14 days. No surprises, no lock-in.</p>
          </div>
          <div style={{maxWidth:'520px',margin:'0 auto'}}>
            <div className="pack reveal">
              <span className="tag">For beauty &amp; clinics</span>
              <h3>Fully booked, fewer no-shows</h3>
              <p className="built">Built on the Scure stack — for salons, aesthetic &amp; dental clinics, physios</p>
              <div className="price">from <b>£750</b> setup <span style={{color:'var(--muted)',fontWeight:400}}>+</span> £297/mo</div>
              <p className="price-sub">Clinic tier £497/mo · pass-through usage at cost</p>
              <ul>
                <li>AI receptionist that books 24/7, EN &amp; PL</li>
                <li>Reminders + deposit capture to kill no-shows</li>
                <li>Rebooking nudges and review requests</li>
                <li>Digital consultation forms, consents &amp; signatures</li>
                <li>Client records, before/after photos, notes</li>
                <li>Owner dashboard — calendar, blocks, content</li>
              </ul>
              <p className="live">◆ Live in ~14 days</p>
              <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-primary">Book a clinic audit</a>
            </div>
          </div>
          <p className="pack-custom reveal" style={{marginTop:'32px'}}>
            In the trades? <b><Link href="/trades" style={{color:'var(--teal)'}}>See the trades package →</Link></b>
          </p>
        </div>
      </section>

      <div className="cta" id="contact">
        <div className="wrap">
          <span className="eyebrow">// let&#39;s fill your diary</span>
          <h2>Book a free lost-revenue audit.</h2>
          <p>Twenty minutes. We&#39;ll look at where bookings and revenue are leaking, and I&#39;ll tell you honestly what&#39;s worth automating — no obligation, no jargon.</p>
          <div className="cta-row">
            <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-light">Book your free audit <span aria-hidden="true">→</span></a>
            <a href="mailto:hello@goldmanautomation.co.uk" className="btn btn-ghost">hello@goldmanautomation.co.uk</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <Link href="/" className="logo">Goldman<span>.</span></Link>
            <p>Automation studio · London, UK<br />Trades · clinics · custom workflows</p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h4>Pages</h4>
              <Link href="/">Home</Link>
              <Link href="/trades">For trades</Link>
              <Link href="/clinics">For clinics</Link>
            </div>
            <div className="foot-col">
              <h4>Get in touch</h4>
              <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a>
              <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit">Book a free audit</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="wrap">
            <span>© 2026 Goldman Automation</span>
            <span>Built by a founder, not an agency.</span>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Script
        id="reveal-animations-clinics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: animationScript }}
      />
    </>
  );
}
