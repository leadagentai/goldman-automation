import Nav from '../components/Nav';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy | Goldman Automation',
  description:
    'How Goldman Automation collects, uses and stores the information you share through the site.',
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap">
          <h1>Privacy policy</h1>
          <p className="lead">Last updated 28 September 2026.</p>
        </div>
      </header>

      <section>
        <div className="wrap" style={{ maxWidth: '720px' }}>
          <div className="sec-head reveal">
            <h2>Who this is</h2>
            <p>
              Goldman Automation is run by Adrian Goldman, based in London. This policy covers
              goldmanautomation.co.uk. Any question about it can go to{' '}
              <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a>.
            </p>
          </div>

          <div className="sec-head reveal">
            <h2>What I collect</h2>
            <p>
              When you use the callback form, I collect your name, phone number, email address,
              type of business, what&#39;s costing you the most in admin, your preferred times to
              call, and anything you add in the notes field. If the site includes a chat
              assistant, I also store the messages you send it and, where you give them, the same
              contact details, so I can follow up on what you asked for.
            </p>
            <p>
              I don&#39;t use tracking cookies or third-party advertising scripts. The site does
              not run analytics that identify you individually.
            </p>
          </div>

          <div className="sec-head reveal">
            <h2>What it&#39;s used for</h2>
            <p>
              Solely to arrange your free audit call, answer what you&#39;ve asked, and follow up if
              I haven&#39;t reached you. I don&#39;t sell or share your details with third parties for
              their own marketing.
            </p>
            <p>
              Emails and message storage may be handled by third-party processors I use to run
              the business (for example an email-sending service). They process the data on my
              instructions only.
            </p>
          </div>

          <div className="sec-head reveal">
            <h2>How long I keep it</h2>
            <p>
              For as long as it&#39;s useful to the business relationship, or until you ask me to
              delete it. Every email from me includes a way to opt out of further contact.
            </p>
          </div>

          <div className="sec-head reveal">
            <h2>Your rights</h2>
            <p>
              You can ask me at any time what I hold on you, ask for a copy of it, or ask me to
              delete it. Email{' '}
              <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a> and
              I&#39;ll sort it directly. There&#39;s no automated process to go through.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
