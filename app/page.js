import Script from 'next/script';

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
        'A London automation studio building practical AI systems for trades and clinics — capturing enquiries, reducing no-shows, and cutting admin.',
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
        'Done-for-you AI automation for London trades and clinics. Missed-call capture, AI lead scoring, 24/7 booking, no-show reduction, and digital records.',
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
            name: 'Never Miss a Job — Trades Package',
            description:
              'Missed-call text-back, AI lead qualification, enquiry capture and automated follow-ups for builders, electricians, plumbers and roofers.',
            price: '495',
            priceCurrency: 'GBP',
          },
          {
            '@type': 'Offer',
            name: 'Fully Booked — Beauty & Clinic Package',
            description:
              '24/7 AI receptionist, deposit capture, reminder sequences, digital consents and client records for salons and clinics.',
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
        'Former London construction company owner turned software builder. Adrian built and runs both LeadAgentAI (for trades) and Scure (for beauty studios and clinics) before offering them to other businesses.',
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
    var counted=false, proof=document.querySelector('.proof');
    function run(){document.querySelectorAll('[data-count]').forEach(function(n){
      var t=parseInt(n.getAttribute('data-count'),10),s=null,d=1100;
      function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1),e=1-Math.pow(1-p,3);n.textContent=Math.round(e*t);if(p<1)requestAnimationFrame(step);else n.textContent=t;}
      requestAnimationFrame(step);});}
    if(proof&&'IntersectionObserver'in window){
      var po=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!counted){counted=true;run();po.disconnect();}});},{threshold:0.4});
      po.observe(proof);
    }
  }
})();
`;

export default function Home() {
  return (
    <>
      <nav>
        <div className="wrap nav-inner">
          <a href="#top" className="logo">Goldman<span>.</span></a>
          <div className="nav-links">
            <a href="#packages" className="lk">packages</a>
            <a href="#work" className="lk">work</a>
            <a href="#process" className="lk">how it works</a>
            <a href="#contact" className="btn btn-primary">Free audit</a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <span className="eyebrow reveal">// business automation · London · trades &amp; clinics</span>
          <h1 className="reveal">Stop losing jobs to missed calls, and bookings to <em>no-shows</em>.</h1>
          <p className="lead reveal">Goldman Automation builds practical AI systems for London trades and clinics — capturing every enquiry, filling every slot, and handling the admin that slows you down. <b>Built by a founder who&#39;s run the businesses he automates.</b></p>
          <div className="hero-cta reveal">
            <a href="#contact" className="btn btn-primary">Book a free lost-revenue audit <span aria-hidden="true">→</span></a>
            <a href="#work" className="btn btn-ghost">See 2 live systems</a>
          </div>
          <p className="hero-note reveal">For builders, electricians, plumbers, salons, clinics and busy service businesses across London.</p>
        </div>
      </header>

      <div className="proof">
        <div className="wrap">
          <div className="proof-grid">
            <div className="proof-item reveal"><div className="num" data-count="2">2</div><div className="src">built in-house</div><div className="lbl">live systems built and run by me</div></div>
            <div className="proof-item reveal"><div className="num" data-count="21">21</div><div className="src">Scure</div><div className="lbl">five-star Google reviews</div></div>
            <div className="proof-item reveal"><div className="num"><b data-count="73">73</b>%</div><div className="src">LeadAgentAI</div><div className="lbl">automated enquiry response rate</div></div>
            <div className="proof-item reveal"><div className="num">24/7</div><div className="src">no extra staff</div><div className="lbl">enquiry &amp; call capture</div></div>
          </div>
        </div>
      </div>

      <section id="problems">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// where the money leaks</span>
            <h2>You&#39;re not short of work. You&#39;re losing it to admin.</h2>
            <p>Most service businesses lose more to missed calls, no-shows and manual chasing than to anything else. These are the leaks worth plugging first.</p>
          </div>
          <div className="prob-grid">
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">◇</div>
              <h3>Stop missing enquiries</h3>
              <p>Every missed call gets an instant text-back, every enquiry is captured, qualified and logged. The job that used to go to whoever picked up first now comes to you.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">○</div>
              <h3>Stop losing slots to no-shows</h3>
              <p>Automated reminders and deposit capture cut no-shows dramatically. Empty chairs and cancelled jobs stop quietly draining your week.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">▢</div>
              <h3>Stop chasing people manually</h3>
              <p>Follow-ups, rebooking nudges and review requests send themselves, on time, every time — the chase you never get round to, done consistently.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">⋈</div>
              <h3>Stop drowning in paperwork</h3>
              <p>Forms, consents, quotes, client records and notes — digital, searchable, GDPR-safe and kept against the right customer. No paper, nothing lost.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pack-wrap" id="packages">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// two done-for-you packages</span>
            <h2>Pick the system built for your business</h2>
            <p>Fixed scope, fixed price, live in days. Two proven systems I&#39;ve already built and run — deployed and tuned around the way you work.</p>
          </div>
          <div className="pack-grid">
            <div className="pack reveal">
              <span className="tag">For trades</span>
              <h3>Never miss a job</h3>
              <p className="built">Built on LeadAgentAI — for builders, electricians, plumbers, roofers</p>
              <div className="price">from <b>£495</b> setup <span style={{color:'var(--muted)',fontWeight:400}}>+</span> £299/mo</div>
              <p className="price-sub">Pro tier £449/mo · pass-through usage at cost</p>
              <ul>
                <li>Missed-call instant text-back &amp; enquiry capture</li>
                <li>AI lead qualification and 1–10 scoring</li>
                <li>Reads plans &amp; photos, drafts a costed reply</li>
                <li>Automatic 48-hour and 7-day follow-ups</li>
                <li>Filters out time-wasters and spam</li>
                <li>Lead pipeline + instant notifications</li>
              </ul>
              <p className="live">◆ Live in 7–10 working days</p>
              <a href="#contact" className="btn btn-primary">Book a trades audit</a>
            </div>
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
              <a href="#contact" className="btn btn-primary">Book a clinic audit</a>
            </div>
          </div>
          <p className="pack-custom reveal">Something else entirely? <b>Bespoke automation from £1,500</b> — if a task is repetitive, it can almost certainly be automated. Tell me what yours is.</p>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// the proof</span>
            <h2>Real systems, already running in real businesses</h2>
            <p>I don&#39;t show mock-ups. Both packages above are products I built from scratch and run every day. The numbers are real and attributed.</p>
          </div>

          <div className="case case-light reveal">
            <div className="case-top">
              <h3>Scure</h3>
              <span className="ctag ctag-l">Beauty studio · North London</span>
            </div>
            <p className="problem">The owner works hands-on all day and <b>can&#39;t answer the phone mid-treatment</b> — so enquiries went unanswered and bookings slipped away. Now the studio runs itself around her.</p>
            <div className="feat-grid">
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> A front desk that never sleeps</div><div className="fd">An AI receptionist answers in English or Polish, recommends the right treatment, checks real availability and books the visit — at any hour.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> The whole booking on autopilot</div><div className="fd">Confirmation, day-before reminder, post-visit thank-you with a review request, and a rebooking nudge at 28 days — all automatic.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> Paperless, GDPR-safe records</div><div className="fd">Per-client profiles with consultation forms, digital signatures, consents, before/after photos and private notes.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> One panel to run it all</div><div className="fd">The owner controls the calendar, blocks days and publishes content from a single dashboard — no developer needed.</div></div>
            </div>
            <div className="case-stats">
              <div className="cstat"><div className="cn">21</div><div className="cl">five-star Google reviews</div></div>
              <div className="cstat"><div className="cn">EN / PL</div><div className="cl">bilingual receptionist</div></div>
              <div className="cstat"><div className="cn">0</div><div className="cl">enquiries missed overnight</div></div>
            </div>
            <p className="touch">A small touch clients notice: a step-by-step parking guide arrives automatically with every booking confirmation.</p>
          </div>

          <div className="case case-dark reveal">
            <div className="case-top">
              <h3>LeadAgentAI</h3>
              <span className="ctag ctag-d">Construction &amp; trades</span>
            </div>
            <p className="problem">Most building firms simply <b>never reply to enquiries</b> — good jobs go cold while they&#39;re on site. This catches every one, sorts the real from the noise, and does the chasing.</p>
            <div className="feat-grid">
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> Catches every enquiry</div><div className="fd">Email, web form or missed call — a missed call fires an instant SMS with a project form link, so nothing slips through.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> Reads and scores it</div><div className="fd">Every enquiry gets a 1–10 score on budget, scope and timeline. It even reads uploaded plans and photos to understand the job.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> Filters out the noise</div><div className="fd">Spam, job offers and time-wasters are archived automatically, so only genuine projects ever reach you.</div></div>
              <div className="feat"><div className="ft"><span aria-hidden="true">◆</span> Does the chasing for you</div><div className="fd">If a lead goes quiet it follows up at 48 hours and 7 days, then hands you a costed report and a ready-to-send reply.</div></div>
            </div>
            <div className="case-stats">
              <div className="cstat"><div className="cn">73%</div><div className="cl">enquiry response rate</div></div>
              <div className="cstat"><div className="cn">6.7</div><div className="cl">avg lead score / 10</div></div>
              <div className="cstat"><div className="cn">5 hr</div><div className="cl">avg reply time</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="why" id="about">
        <div className="wrap why-grid">
          <div className="why-photo reveal">
            <div className="ph-ring" aria-hidden="true"></div>
            <div className="ph-label">// Adrian Goldman<br />founder<br />London</div>
          </div>
          <div className="why-body reveal">
            <span className="eyebrow">// built by a founder, not an agency</span>
            <h2>I&#39;ve run the businesses I automate.</h2>
            <p>I owned and ran a London construction company before I ever built software. I know what it feels like to lose a good job because you were on site and couldn&#39;t get to the phone.</p>
            <p>So I built <b>LeadAgentAI</b> to catch the enquiries builders miss, and the <b>Scure</b> system for a studio owner who couldn&#39;t book clients while her hands were busy. Both are live, both are mine, and both work.</p>
            <p>When you work with me you deal with the person who designs and builds the system — someone who&#39;s run a real business and knows what actually moves the needle, not an account manager.</p>
            <p className="sig">Let&#39;s get the lost revenue back.</p>
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
              <p>A 20-minute call where we put a real number on what missed calls, no-shows and admin are costing you. No pitch, just the figure.</p>
            </div>
            <div className="proc-step reveal">
              <div className="pn">step 02</div>
              <h3>Fixed-scope go-live</h3>
              <p>One setup fee, one clear scope, live in days. I build and tune the system around your business and hand it over working.</p>
            </div>
            <div className="proc-step reveal">
              <div className="pn">step 03</div>
              <h3>Monthly support</h3>
              <p>I monitor, maintain and improve it as you grow. 30-day rolling, no long contracts, cancel any time.</p>
            </div>
          </div>
          <div className="guarantee reveal">
            <span className="gi" aria-hidden="true">◆</span>
            <p><b>Straight talk guarantee.</b> If the audit shows automation won&#39;t pay for itself in your business, I&#39;ll tell you that plainly — and we won&#39;t go ahead. I&#39;d rather have your trust than a bad fit.</p>
          </div>
        </div>
      </section>

      <div className="cta" id="contact">
        <div className="wrap">
          <span className="eyebrow">// let&#39;s find your leaks</span>
          <h2>Book a free lost-revenue audit.</h2>
          <p>Twenty minutes. We&#39;ll look at where your time and money go, and I&#39;ll tell you honestly what&#39;s worth automating — no obligation, no jargon.</p>
          <div className="cta-row">
            <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-light">Book your free audit <span aria-hidden="true">→</span></a>
            <a href="mailto:hello@goldmanautomation.co.uk" className="btn btn-ghost">hello@goldmanautomation.co.uk</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <div className="logo">Goldman<span>.</span></div>
            <p>Automation studio · London, UK<br />Trades · clinics · custom workflows</p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h4>Packages</h4>
              <a href="#packages">For trades</a>
              <a href="#packages">For beauty &amp; clinics</a>
              <a href="#work">Live work</a>
              <a href="#process">How it works</a>
            </div>
            <div className="foot-col">
              <h4>Get in touch</h4>
              <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a>
              <a href="#contact">Book a free audit</a>
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
        id="reveal-animations"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: animationScript }}
      />
    </>
  );
}
