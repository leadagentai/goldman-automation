import Script from 'next/script';
import Nav from '../components/Nav';

export const metadata = {
  title: 'Automation for Trades — Never Miss a Job | Goldman Automation London',
  description:
    'AI lead capture for London builders, electricians, plumbers and roofers. Missed-call text-back, 1–10 lead scoring, automatic follow-ups. From £495 setup + £299/mo.',
  openGraph: {
    title: 'Automation for Trades — Never Miss a Job | Goldman Automation',
    description:
      'London trades lose jobs every day to missed calls. LeadAgentAI catches every enquiry, scores it and does the chasing automatically.',
    type: 'website',
    locale: 'en_GB',
    url: 'https://goldmanautomation.co.uk/trades/',
    images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
  },
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/trades/',
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
      '@id': 'https://goldmanautomation.co.uk/trades/#service',
      name: 'Never Miss a Job — Trades Automation',
      provider: { '@id': 'https://goldmanautomation.co.uk/#org' },
      description:
        'Done-for-you AI lead capture and automation for London builders, electricians, plumbers and roofers. Missed-call text-back, 1–10 lead scoring and automatic follow-ups.',
      areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'Country', name: 'United Kingdom' },
      ],
      serviceType: 'AI Lead Capture Automation',
      offers: {
        '@type': 'Offer',
        price: '495',
        priceCurrency: 'GBP',
        description: 'Setup fee for the trades automation package',
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
          name: 'For Trades',
          item: 'https://goldmanautomation.co.uk/trades/',
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

export default function TradesPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap">
          <span className="eyebrow reveal">// automation for trades · London</span>
          <h1 className="reveal">You&#39;re on site. The phone rings. <em>Nobody answers.</em></h1>
          <p className="lead reveal">London trades lose good jobs every day — not because the work isn&#39;t there, but because the enquiry came in while they were up a ladder or in a ditch. <b>LeadAgentAI catches every call, scores every lead and does the chasing automatically.</b></p>
          <div className="hero-cta reveal">
            <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-primary">Book a free audit <span aria-hidden="true">→</span></a>
            <a href="#how-it-works" className="btn btn-ghost">How it works <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-note reveal">For builders, electricians, plumbers and roofers across London.</p>
        </div>
      </header>

      <section id="pains">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// where the jobs leak</span>
            <h2>You&#39;re not short of work. You&#39;re losing it while you&#39;re working.</h2>
            <p>The leaks in a trades business are almost always the same. None of them are hard to fix once they&#39;re visible.</p>
          </div>
          <div className="prob-grid">
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">◇</div>
              <h3>Missed calls go cold</h3>
              <p>A job rings while you&#39;re on site. You mean to call back at lunch. By then, they&#39;ve booked whoever picked up. It happens every week.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">○</div>
              <h3>Slow quotes lose jobs</h3>
              <p>Good leads go cold in 24 hours. The quote that arrives tomorrow sits next to the one that arrived this morning. Yours loses on speed, not on price.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">▢</div>
              <h3>Leads pile up unchaseed</h3>
              <p>You got the enquiry. You meant to follow up. It&#39;s been five days and the lead is cold — an automatic job if you&#39;d sent a message on day two.</p>
            </div>
            <div className="prob reveal">
              <div className="ic" aria-hidden="true">⋈</div>
              <h3>Filtering takes time you don&#39;t have</h3>
              <p>Mixed in with real enquiries: job offers, wrong numbers, people kicking tyres. Sorting them at the end of a full day rarely happens.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{background:'var(--bone-alt)'}}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// the leadagentai system</span>
            <h2>Every enquiry caught, scored and chased.</h2>
            <p>Built by someone who ran a London construction firm — not built in a meeting room.</p>
          </div>
          <div className="case case-dark reveal">
            <div className="case-top">
              <h3>LeadAgentAI</h3>
              <span className="ctag ctag-d">Construction &amp; trades</span>
            </div>
            <div className="feat-grid">
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Instant missed-call text-back</div>
                <div className="fd">The moment a call is missed, the caller gets an SMS with a project submission link. The job comes to you before it goes anywhere else.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> AI lead capture &amp; 1–10 scoring</div>
                <div className="fd">Every enquiry is scored on budget, scope and timeline. You see the best leads first — not the noisiest.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Reads plans and photos</div>
                <div className="fd">Attach drawings or site photos to an enquiry and the AI understands the job. It can draft a costed reply without you lifting a pen.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Filters out noise automatically</div>
                <div className="fd">Spam, sub-contract requests and tyre-kickers are archived before they reach you. Your pipeline stays clean.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Automatic 48h and 7-day follow-ups</div>
                <div className="fd">If a lead goes quiet, it gets chased at 48 hours and again at 7 days. Consistently, without you remembering to do it.</div>
              </div>
              <div className="feat">
                <div className="ft"><span aria-hidden="true">◆</span> Lead pipeline with instant alerts</div>
                <div className="fd">Every enquiry, score, status and message history in one place. Get a notification the moment a real job lands.</div>
              </div>
            </div>
            <div className="case-stats">
              <div className="cstat"><div className="cn">73%</div><div className="cl">enquiry response rate</div></div>
              <div className="cstat"><div className="cn">6.7</div><div className="cl">avg lead score / 10</div></div>
              <div className="cstat"><div className="cn">5 hr</div><div className="cl">avg reply time</div></div>
            </div>
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
              <p>A 20-minute call where we put a real number on what missed calls and slow follow-ups are costing you. No pitch, just the figure.</p>
            </div>
            <div className="proc-step reveal">
              <div className="pn">step 02</div>
              <h3>Fixed-scope go-live</h3>
              <p>One setup fee, one clear scope, live in 7–10 working days. I build and tune the system around your business and hand it over working.</p>
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

      <section className="pack-wrap" id="pricing">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">// pricing</span>
            <h2>Fixed scope. Fixed price. Live in days.</h2>
            <p>One setup fee, one clear scope, live in 7–10 working days. No surprises, no lock-in.</p>
          </div>
          <div style={{maxWidth:'520px',margin:'0 auto'}}>
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
              <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-primary">Book a trades audit</a>
            </div>
          </div>
          <p className="pack-custom reveal" style={{marginTop:'32px'}}>
            Run a salon or clinic? <b><a href="/clinics" style={{color:'var(--teal)'}}>See the clinics package →</a></b>
          </p>
        </div>
      </section>

      <div className="cta" id="contact">
        <div className="wrap">
          <span className="eyebrow">// let&#39;s get your jobs back</span>
          <h2>Book a free lost-revenue audit.</h2>
          <p>Twenty minutes. We&#39;ll put a number on what missed calls are costing you, and I&#39;ll tell you honestly what&#39;s worth fixing — no pitch, no obligation.</p>
          <div className="cta-row">
            <a href="mailto:hello@goldmanautomation.co.uk?subject=Free%20automation%20audit" className="btn btn-light">Book your free audit <span aria-hidden="true">→</span></a>
            <a href="mailto:hello@goldmanautomation.co.uk" className="btn btn-ghost">hello@goldmanautomation.co.uk</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <a href="/" className="logo">Goldman<span>.</span></a>
            <p>Automation studio · London, UK<br />Trades · clinics · custom workflows</p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h4>Pages</h4>
              <a href="/">Home</a>
              <a href="/trades">For trades</a>
              <a href="/clinics">For clinics</a>
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
        id="reveal-animations-trades"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: animationScript }}
      />
    </>
  );
}
