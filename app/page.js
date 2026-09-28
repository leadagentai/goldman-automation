import Link from 'next/link';
import Script from 'next/script';
import Nav from './components/Nav';
import ContactSection from './components/ContactSection';
import SiteFooter from './components/SiteFooter';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://goldmanautomation.co.uk/#org',
      name: 'Goldman Automation',
      url: 'https://goldmanautomation.co.uk/',
      email: 'hello@goldmanautomation.co.uk',
      description:
        'A London studio that implements AI for small businesses, done for you. Finds where a business is losing money to missed calls, no-shows, slow replies and paperwork, builds the fix, and runs it. Founder-built, proven in construction and beauty, works with any small business.',
      areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'Country', name: 'United Kingdom' },
      ],
      founder: { '@id': 'https://goldmanautomation.co.uk/#founder' },
      knowsAbout: ['AI automation', 'lead capture', 'booking automation', 'trades', 'clinics'],
    },
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': 'https://goldmanautomation.co.uk/#service',
      name: 'Goldman Automation',
      url: 'https://goldmanautomation.co.uk/',
      email: 'hello@goldmanautomation.co.uk',
      description:
        'AI implementation for UK small businesses, done for you. Free lost-revenue audit, then a fixed-scope build and an ongoing subscription to run it. Founder-built, London and remote across the UK. Trades and clinics are proven examples, not the limit of what gets built.',
      image: 'https://goldmanautomation.co.uk/og-image.png',
      priceRange: '££',
      currenciesAccepted: 'GBP',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      serviceType: ['AI Automation', 'Business Automation', 'Lead Management', 'Booking Systems'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Automation Packages',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Automation for trades',
            description:
              'Missed-call text-back, AI lead scoring, enquiry capture and automated follow-ups for builders, electricians, plumbers and roofers.',
            price: '495',
            priceCurrency: 'GBP',
          },
          {
            '@type': 'Offer',
            name: 'Automation for beauty and clinics',
            description:
              '24/7 bilingual booking, deposit capture, reminder sequences, digital consents and client records for salons and clinics.',
            price: '750',
            priceCurrency: 'GBP',
          },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://goldmanautomation.co.uk/#founder',
      name: 'Adrian Goldman',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://goldmanautomation.co.uk/#org' },
      url: 'https://goldmanautomation.co.uk/',
      email: 'hello@goldmanautomation.co.uk',
      description:
        'Ran a London construction company (Sagittarius Construction) before building software. Built LeadAgentAI to catch the enquiries he was missing on site, and the Scure system with his partner’s beauty studio as the proving ground.',
      knowsAbout: [
        'AI automation',
        'business operations',
        'construction',
        'trades',
        'clinic management',
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
  if(!reduce){
    var counted=false, trust=document.querySelector('.trust');
    function run(){document.querySelectorAll('[data-count]').forEach(function(n){
      var t=parseInt(n.getAttribute('data-count'),10),s=null,d=1100;
      function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1),e=1-Math.pow(1-p,3);n.textContent=Math.round(e*t);if(p<1)requestAnimationFrame(step);else n.textContent=t;}
      requestAnimationFrame(step);});}
    if(trust&&'IntersectionObserver'in window){
      var po=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!counted){counted=true;run();po.disconnect();}});},{threshold:0.4});
      po.observe(trust);
    }
  }
})();
`;

const flowSteps = [
  {
    label: 'Missed call',
    icon: (
      <path d="M4 5c0 8 7 15 15 15l-2-4-4-1-2-3-3-2-1-4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Instant text reply',
    icon: (
      <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Photos and plans sent',
    icon: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 15l4-4 4 4 3-3 5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: 'System scores the enquiry',
    icon: (
      <path d="M4 20V10m5 10V5m5 15v-7m5 7V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    label: 'Owner gets a ready-made summary',
    icon: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

const buildSteps = [
  {
    name: 'Understand',
    copy: 'A 20-minute call to map how enquiries reach you today and where they are being lost.',
  },
  {
    name: 'Build',
    copy: 'I build the system around the way you already work, not around a template.',
  },
  {
    name: 'Connect',
    copy: 'It plugs into the tools you already use — your number, your inbox, your calendar.',
  },
  {
    name: 'Test',
    copy: 'We run real scenarios through it before it goes anywhere near a customer.',
  },
  {
    name: 'Support',
    copy: 'Once it is live I keep monitoring it and improving it as your business grows.',
  },
];

const leaks = [
  {
    name: 'Restaurants & cafés',
    problem:
      'The phone rings during service and no one can pick up — a booking or an order is gone.',
    auto: 'Missed calls get an instant text back with a booking link; online ordering that confirms itself; reminders that cut no-shows.',
  },
  {
    name: 'Accountants & small practices',
    problem:
      'New enquiries sit in an inbox for days; chasing clients for documents eats hours every week.',
    auto: 'Every enquiry gets an instant acknowledgement and an intake form; missing documents get chased automatically until they are in.',
  },
  {
    name: 'Property & letting agents',
    problem:
      'Viewing requests come in evenings and weekends when no one is answering; maintenance requests get lost between tenant, landlord and contractor.',
    auto: 'After-hours viewing requests captured and booked without anyone at a desk; maintenance requests logged, triaged and chased on their own.',
  },
  {
    name: 'Cleaning, gardening & home services',
    problem:
      'Quote requests land on Facebook, WhatsApp and the website all at once — some get missed entirely.',
    auto: 'Every enquiry, whatever the channel, lands in one place with an instant reply; quotes and invoices chased automatically.',
  },
  {
    name: 'Fitness studios & personal trainers',
    problem:
      'Trial enquiries go cold because no one follows up fast enough; late cancellations leave empty slots no one fills.',
    auto: 'Instant reply to trial enquiries with next steps; automatic reminders and easy rebooking to cut late cancellations.',
  },
  {
    name: 'Guesthouses & small hospitality',
    problem:
      'Booking enquiries outside office hours sit unanswered until morning — by then the guest has booked elsewhere.',
    auto: '24/7 enquiry response with availability and pricing; pre-arrival and post-stay messages sent without anyone remembering to.',
  },
];

const faqs = [
  {
    q: 'Do I need to know anything about AI?',
    a: 'No. You tell me how your business runs and where it hurts. I work out what to build, build it, and look after it. You get the result, not a login to configure.',
  },
  {
    q: 'My business isn’t on your list. Can you still help?',
    a: 'Probably. Missed enquiries, no-shows, chasing and paperwork look the same in most service businesses. The audit is 20 minutes and free. If automation won’t pay for itself for you, I’ll tell you.',
  },
  {
    q: 'Do you do AI phone answering?',
    a: 'On request. I start with missed-call text-back because it’s proven, cheaper and doesn’t put a robot between you and your customer. Where a voice agent genuinely fits, I’ll build one, and I’ll tell you honestly whether it does.',
  },
  {
    q: 'Where is my data stored?',
    a: 'On established cloud infrastructure hosted in the UK and EU. The systems are designed to support UK GDPR-compliant workflows, and you can ask for your data to be exported or deleted at any time.',
  },
  {
    q: 'What are the cancellation terms?',
    a: 'A 30-day rolling contract. Cancel any time with 30 days’ notice. There is no minimum term and no lock-in.',
  },
  {
    q: 'What happens to my client data if I cancel?',
    a: 'It stays yours. I export it in a standard format, hand it over, and then remove it from the system.',
  },
  {
    q: 'How quickly do you respond to support requests?',
    a: 'Same working day for anything urgent that affects live bookings or enquiry capture. Within two working days for everything else.',
  },
  {
    q: 'Am I tied into a long contract?',
    a: 'No. One fixed setup fee, then a month-to-month subscription you can stop whenever it stops being worth it.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="hero-copy reveal">
            <h1>You know AI could help your business. <em>You just don&#39;t know where to start.</em></h1>
            <p className="lead">
              I&#39;m Adrian. I ran a building firm in London, then taught myself to build the
              systems that stopped it losing jobs. Now I find where your business is losing
              money, build the fix and run it for you. Whatever the business.
            </p>
            <div className="hero-cta">
              <Link href="#contact" className="btn btn-primary">
                Book your free lost-revenue audit
              </Link>
              <Link href="#what-it-fixes" className="btn btn-ghost">
                See what it can fix
              </Link>
            </div>
            <p className="hero-note">
              20 minutes. No pitch. Just the number you&#39;re losing, and where.
            </p>
          </div>

          <div className="flow reveal" aria-label="How an enquiry moves through the system">
            <div className="flow-title">One example — a missed call comes in</div>
            {flowSteps.map((step, i) => (
              <div key={step.label}>
                <div className="flow-step">
                  <span className="flow-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24">{step.icon}</svg>
                  </span>
                  <span>{step.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flow-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 4v16m0 0l-6-6m6 6l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="trust">
        <div className="wrap">
          <div className="trust-grid">
            <div className="trust-item reveal">
              <div className="tnum"><span data-count="119">119</span></div>
              <div className="tlabel">enquiries handled automatically</div>
              <div className="tsrc">LeadAgentAI · Alexson Group · all-time</div>
            </div>
            <div className="trust-item reveal">
              <div className="tnum"><span data-count="33">33</span></div>
              <div className="tlabel">five-star Google reviews</div>
              <div className="tsrc">Scure · North London</div>
            </div>
            <div className="trust-item reveal">
              <div className="tnum">2<span className="unit">min</span></div>
              <div className="tlabel">for the AI to draft a ready reply</div>
              <div className="tsrc">LeadAgentAI</div>
            </div>
          </div>
        </div>
      </div>

      <section id="what-it-fixes">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>Where AI actually earns its keep in a small business</h2>
            <p>
              27–47% of calls to UK small businesses go unanswered. That&#39;s the obvious leak.
              Most businesses have three or four more. Here&#39;s where they usually hide.
            </p>
          </div>
          <div className="leaks-grid reveal">
            {leaks.map((leak) => (
              <div key={leak.name} className="leak-card">
                <h3>{leak.name}</h3>
                <p className="leak-label">Problem</p>
                <p>{leak.problem}</p>
                <p className="leak-label">Could be automated</p>
                <p>{leak.auto}</p>
              </div>
            ))}
          </div>
          <div className="leaks-close reveal">
            <p>
              Don&#39;t see your business here? That&#39;s exactly what the audit is for — 20 minutes,
              and I&#39;ll tell you where your money&#39;s leaking, whatever the business.
            </p>
            <Link href="#contact" className="btn btn-primary">Book your free lost-revenue audit</Link>
          </div>
        </div>
      </section>

      <section id="approach">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>This isn&#39;t another tool for you to configure</h2>
            <p>
              I map your workflow, build the system, connect it to your existing tools, test it
              with real scenarios, and keep looking after it once it&#39;s live.
            </p>
          </div>
          <div className="build-steps reveal">
            {buildSteps.map((step, i) => (
              <div key={step.name} className="build-step">
                <div className="bnum">{i + 1}</div>
                <h3>{step.name}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel" id="results">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>Real systems, already running</h2>
            <p>
              These are the two systems I&#39;ve built and run myself — proof of what automation can
              actually do in a real business, not a limit on what I build. If your business looks
              different, the process is the same. The numbers below are real and attributed.
            </p>
          </div>

          <div className="case case-dark reveal">
            <div className="case-head">
              <h3>LeadAgentAI</h3>
              <span className="case-tag">Alexson Group · construction</span>
            </div>
            <div className="case-media">[ Image placeholder — LeadAgentAI dashboard or admin screen ]</div>

            <div className="case-block">
              <h4>Before</h4>
              <p>
                Missed calls during working hours, no follow-up system, and enquiries lost with no
                record that they ever came in.
              </p>
            </div>
            <div className="case-block">
              <h4>What changed</h4>
              <p>
                Now the system captures leads from email, the contact form and missed calls, with an
                instant SMS text-back via Twilio. An AI scores every enquiry from 1 to 10, flags red
                flags, and reads uploaded plans and photos to understand the job. It drafts a branded
                reply ready to send, and follows up automatically at 48 hours and 7 days. Alexson
                reviews each draft and sends it in about two hours on average — nothing goes out
                without his sign-off.
              </p>
            </div>

            <div className="case-results">
              <span className="result-chip">119 enquiries handled</span>
              <span className="result-chip">2 min to draft a reply</span>
              <span className="result-chip">6.7/10 average lead score</span>
              <span className="result-chip">15 hot leads (8+) surfaced automatically</span>
            </div>

            <div className="case-quote">[ Quote placeholder — real words from Emil at Alexson Group ]</div>

            <Link href="/trades" className="btn btn-ghost">See the full case study</Link>
          </div>

          <div className="case case-light reveal">
            <div className="case-head">
              <h3>Scure</h3>
              <span className="case-tag">Beauty studio · North London</span>
            </div>
            <div className="case-media">[ Image placeholder — Scure studio photo or booking calendar ]</div>

            <div className="case-block">
              <h4>Before</h4>
              <p>
                Missed enquiries overnight, booking handled by hand, and no deposit system to protect
                against no-shows.
              </p>
            </div>
            <div className="case-block">
              <h4>What changed</h4>
              <p>
                A bilingual English and Polish AI receptionist now handles booking against real-time
                availability, with a Stripe deposit taken at every booking. Confirmation, a 24-hour
                reminder, a post-visit review request and a 28-day rebooking nudge all send
                themselves, and clients can cancel or reschedule on their own. It replaces Treatwell,
                Calendly, Mailchimp and MindBody entirely.
              </p>
            </div>

            <div className="case-results">
              <span className="result-chip">£2,205 booked through the system since launch</span>
              <span className="result-chip">60 bookings</span>
              <span className="result-chip">~£200/month saved in Treatwell commission</span>
              <span className="result-chip">33 five-star Google reviews</span>
            </div>

            <div className="case-quote">[ Quote placeholder — real words from Aleksandra at Scure ]</div>

            <Link href="/clinics" className="btn btn-ghost">See the full case study</Link>
          </div>
        </div>
      </section>

      <section id="how-it-works">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>How working together goes</h2>
          </div>
          <div className="how-steps reveal">
            <div className="how-step">
              <div className="bnum">1</div>
              <h3>Free lost-revenue audit</h3>
              <p>
                20 minutes. A real number on what admin is costing your business — whatever that
                looks like for you. No pitch.
              </p>
            </div>
            <div className="how-step">
              <div className="bnum">2</div>
              <h3>Fixed-scope go-live</h3>
              <p>One setup fee, one clear scope, live in days.</p>
            </div>
            <div className="how-step">
              <div className="bnum">3</div>
              <h3>Monthly subscription</h3>
              <p>I monitor, maintain and improve the system as your business grows.</p>
            </div>
          </div>
          <div className="straight-talk reveal">
            <h3>Straight talk guarantee</h3>
            <p>
              If the free audit shows automation won&#39;t pay for itself in your business, I&#39;ll
              say so — and I won&#39;t take the job.
            </p>
            <p className="fine">30-day rolling contract. Cancel any time. No lock-in.</p>
          </div>
        </div>
      </section>

      <section className="panel" id="pricing">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>Pricing</h2>
            <p>A teaser — full detail and what&#39;s included lives on the trades and clinics pages.</p>
          </div>
          <div className="pricing-grid pricing-grid-3 reveal">
            <div className="price-card">
              <h3>For trades</h3>
              <div className="figure">
                from <b>£495</b> setup + <b>£299</b>/mo
              </div>
              <div className="timing">Live in 7–10 working days</div>
            </div>
            <div className="price-card">
              <h3>For beauty &amp; clinics</h3>
              <div className="figure">
                from <b>£750</b> setup + <b>£297</b>/mo
              </div>
              <div className="timing">Live in ~14 days</div>
            </div>
            <div className="price-card">
              <h3>Something else</h3>
              <div className="figure">
                bespoke automation from <b>£1,500</b>
              </div>
              <div className="timing">Scoped in the audit</div>
            </div>
          </div>
          <p className="pricing-link reveal">
            See full pricing and what&#39;s included on{' '}
            <Link href="/trades">trades</Link> or <Link href="/clinics">clinics</Link>.
          </p>
        </div>
      </section>

      <section id="about">
        <div className="wrap about-grid">
          <div className="about-photo reveal">[ Image placeholder — photo of Adrian ]</div>
          <div className="about-body reveal">
            <h2>Hi, I&#39;m Adrian. I built these systems because I had the same problems in my own business.</h2>
            <p>
              I ran a construction company in London — Sagittarius Construction — and the missed
              calls landed on me while I was on site. I built LeadAgentAI to solve my own problem
              first, before it was anything anyone else could buy.
            </p>
            <p>
              The Scure system started the same way: I built it with my partner&#39;s beauty studio
              as the proving ground, where every feature had to earn its place against a real day&#39;s
              work.
            </p>
            <p>
              LeadAgentAI and Scure were the proving ground. Now I do the same for any small
              business that knows AI could help but hasn&#39;t got the time to work out how.
            </p>
            <p>
              You don&#39;t need to understand the technology. You need someone who understands your
              business, builds the thing that fixes it, and picks up the phone when you need him.
              That&#39;s the job.
            </p>
            <p>
              When you work with me, you work directly with the person who designs and runs your
              system — not an account manager.
            </p>
            <p className="sig">Let&#39;s get the lost revenue back.</p>
          </div>
        </div>
      </section>

      <section className="panel" id="faq">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>Questions and data security</h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Script
        id="reveal-animations"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: animationScript }}
      />
    </>
  );
}
