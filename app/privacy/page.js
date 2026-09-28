import Nav from '../components/Nav';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Privacy policy | Goldman Automation',
  description:
    "How Goldman Automation collects, uses, stores and protects your personal data through goldmanautomation.co.uk.",
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TOC = [
  ['who-we-are', 'Who we are'],
  ['what-we-collect', 'What we collect'],
  ['why-we-use-it', 'Why we use it, and the legal basis'],
  ['chat-and-ai', 'The chat assistant and AI'],
  ['who-we-share-it-with', 'Who we share it with'],
  ['how-long-we-keep-it', 'How long we keep it'],
  ['your-rights', 'Your rights'],
  ['cookies', 'Cookies'],
  ['children', 'Children'],
  ['changes', 'Changes'],
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <div className="article-wrap">
        <div className="article-header">
          <h1>Privacy policy</h1>
          <div className="article-meta">
            <span>Last updated: 28 September 2026</span>
          </div>
        </div>

        <div className="article-body">
          <p>
            This policy explains what personal information Goldman Automation collects through
            goldmanautomation.co.uk, why, how long it&#39;s kept and what your rights are. It&#39;s
            written to be read, not to hide things.
          </p>

          <nav className="toc" aria-label="Table of contents">
            <strong>Contents</strong>
            <ul>
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <h2 id="who-we-are">Who we are</h2>
          <p>
            Goldman Automation is run by Adrian Goldman, trading as Goldman Automation, London,
            United Kingdom. For anything about your data, email{' '}
            <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a>.
          </p>
          {/* TODO: once registered with the ICO, restore this sentence with the real number:
              "We are registered with the Information Commissioner's Office under registration number [ICO NUMBER]." */}

          <h2 id="what-we-collect">What we collect</h2>
          <p>
            When you request a callback through the contact form: your name, phone number, email
            address, type of business, the problem you chose, the times you&#39;d like a call and
            anything you write in the free-text box.
          </p>
          <p>
            When you use the chat assistant: the messages you send and receive, the page you were
            on and the time. If you book an audit through the chat, the same details as the
            contact form. We keep a one-way scrambled (hashed) version of your IP address to stop
            abuse of the chat. We can&#39;t turn it back into your IP address.
          </p>
          <p>When you email us: your email address and whatever you write.</p>
          <p>
            We don&#39;t ask for payment details, passwords or health information through this
            website. Please don&#39;t share them in the chat.
          </p>

          <h2 id="why-we-use-it">Why we use it, and the legal basis</h2>
          <ul>
            <li>
              To call you back and run the free audit you asked for. Legal basis: taking steps at
              your request before a possible contract.
            </li>
            <li>
              To send you a confirmation email and, if we haven&#39;t managed to reach you, one
              follow-up email about 48 hours later. Legal basis: legitimate interests (following
              up a request you made). Every email has an unsubscribe link.
            </li>
            <li>
              To answer your questions in the chat and improve how the chat assistant works. Legal
              basis: legitimate interests.
            </li>
            <li>To protect the website from spam and abuse. Legal basis: legitimate interests.</li>
          </ul>
          <p>
            We don&#39;t send newsletters or marketing emails from this website, and we never sell
            your data.
          </p>

          <h2 id="chat-and-ai">The chat assistant and AI</h2>
          <p>
            The chat on this website is an AI assistant, not a person. Your chat messages, and the
            details you enter in the contact form, are processed by an AI model to reply to you,
            write the first line of your confirmation email and summarise your enquiry for Adrian.
            The AI doesn&#39;t make any decisions about you. Adrian reads every enquiry and decides
            what happens next.
          </p>

          <h2 id="who-we-share-it-with">Who we share it with</h2>
          <p>Only the service providers we need to run the website and reply to you:</p>
          <ul>
            <li>Vercel: website hosting</li>
            <li>Supabase: database, hosted in London</li>
            <li>
              Resend: sending emails. Resend also keeps its own delivery records (for example,
              whether an email was delivered) under its own privacy policy.
            </li>
            <li>Anthropic: the AI model behind the chat and email personalisation</li>
          </ul>
          <p>
            Some of these companies are based in the United States. Where your data is transferred
            outside the UK, it&#39;s protected by appropriate safeguards, such as the UK
            International Data Transfer Addendum or the UK Extension to the EU-US Data Privacy
            Framework.
          </p>
          <p>We&#39;ll only share your data with anyone else if the law requires it.</p>

          <h2 id="how-long-we-keep-it">How long we keep it</h2>
          <ul>
            <li>Enquiries that don&#39;t lead to working together: 12 months after our last contact, then deleted.</li>
            <li>Chat conversations that don&#39;t lead to an enquiry: 90 days, then deleted.</li>
            <li>
              If you become a client: for as long as we work together, and then as long as we&#39;re
              legally required to keep business records (usually 6 years).
            </li>
          </ul>
          <p>You can ask us to delete your data sooner at any time.</p>

          <h2 id="your-rights">Your rights</h2>
          <p>
            You have the right to ask for a copy of your data, to have it corrected or deleted, to
            restrict or object to how we use it, and to receive it in a format you can take
            elsewhere. Email{' '}
            <a href="mailto:hello@goldmanautomation.co.uk">hello@goldmanautomation.co.uk</a> and
            we&#39;ll reply within one month.
          </p>
          <p>
            If you&#39;re not happy with how we&#39;ve handled your data, you can complain to the
            Information Commissioner&#39;s Office at{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>
            . We&#39;d appreciate the chance to sort it out first.
          </p>

          <h2 id="cookies">Cookies</h2>
          <p>
            This website doesn&#39;t use advertising or tracking cookies. The chat assistant uses
            your browser&#39;s session storage to keep your conversation open while you move
            between pages. It&#39;s cleared when you close the browser tab.
          </p>

          <h2 id="children">Children</h2>
          <p>This website is for business owners and isn&#39;t aimed at anyone under 18.</p>

          <h2 id="changes">Changes</h2>
          <p>If we change this policy, we&#39;ll update the date at the top of this page.</p>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
