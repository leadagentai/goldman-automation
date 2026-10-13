import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import MobileCta from './components/MobileCta';
import ChatWidgetLoader from './components/ChatWidgetLoader';

// Self-hosted at build time by next/font: no requests to Google from visitors' browsers.
// Fraunces is loaded as a variable font so the optical-size axis (opsz) still applies.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Goldman Automation — AI for small businesses, done for you | London',
  description:
    "You know AI could help your business but don't know where to start. I find where you're losing money, build the fix and run it for you. Free 20-minute audit.",
  openGraph: {
    title: 'Goldman Automation — AI for small businesses, done for you',
    description:
      "You know AI could help your business but don't know where to start. I find where you're losing money, build the fix and run it for you. Free 20-minute audit.",
    type: 'website',
    locale: 'en_GB',
    url: 'https://goldmanautomation.co.uk/',
    images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goldman Automation — AI for small businesses, done for you',
    description:
      "You know AI could help your business but don't know where to start. I find where you're losing money, build the fix and run it for you. Free 20-minute audit.",
  },
  alternates: {
    canonical: 'https://goldmanautomation.co.uk/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {children}
        <MobileCta />
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
