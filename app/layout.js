import './globals.css';
import MobileCta from './components/MobileCta';

export const metadata = {
  title: 'Goldman Automation — stop losing money to admin | London',
  description:
    "I design, build and run automation systems that stop businesses losing money to admin. Proven in construction and beauty, built to fit whatever your business needs. From £495 setup + £299/mo, bespoke from £1,500.",
  openGraph: {
    title: 'Goldman Automation — built by a founder, not an agency',
    description:
      'Automation systems that stop businesses losing money to admin. Proven in construction and beauty, built to fit any business.',
    type: 'website',
    locale: 'en_GB',
    url: 'https://goldmanautomation.co.uk/',
    images: [{ url: 'https://goldmanautomation.co.uk/og-image.png' }],
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
      </body>
    </html>
  );
}
