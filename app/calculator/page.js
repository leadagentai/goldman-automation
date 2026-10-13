import Nav from '../components/Nav';
import ContactSection from '../components/ContactSection';
import SiteFooter from '../components/SiteFooter';
import RevealAnimations from '../components/RevealAnimations';
import Calculator from './Calculator';

const TITLE = 'Lost Revenue Calculator for UK Small Businesses | Goldman Automation';
const DESCRIPTION =
  'Work out what missed calls, no-shows and admin cost your business each month, in pounds and evenings. Free, 60 seconds, nothing stored.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_GB',
    url: 'https://goldmanautomation.co.uk/calculator/',
    images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/calculator/',
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
      '@type': 'WebApplication',
      '@id': 'https://goldmanautomation.co.uk/calculator/#app',
      name: 'Lost Revenue Calculator',
      url: 'https://goldmanautomation.co.uk/calculator/',
      description: DESCRIPTION,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      inLanguage: 'en-GB',
      isAccessibleForFree: true,
      provider: { '@id': 'https://goldmanautomation.co.uk/#org' },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
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
          name: 'Lost Revenue Calculator',
          item: 'https://goldmanautomation.co.uk/calculator/',
        },
      ],
    },
  ],
};

export default function CalculatorPage() {
  return (
    <>
      <Nav />

      <main className="calc-page">
        <div className="wrap calc-wrap">
          <Calculator />
        </div>
      </main>

      <ContactSection />

      <SiteFooter />
      <RevealAnimations />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
