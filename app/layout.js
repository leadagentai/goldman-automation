import './globals.css';
import MobileCta from './components/MobileCta';
import ChatWidgetLoader from './components/ChatWidgetLoader';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <MobileCta />
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
