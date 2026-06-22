import './globals.css';

export const metadata = {
  title: 'Goldman Automation — fewer missed calls, fewer no-shows, less admin | London',
  description:
    "Practical AI automation for London trades and clinics. Capture every enquiry, fill every slot, cut the admin. Built by a founder who's run the businesses he automates. Packages from £495 setup + £299/mo.",
  openGraph: {
    title: 'Goldman Automation — built by a founder, not an agency',
    description:
      'AI automation for London trades and clinics. Stop losing jobs to missed calls and bookings to no-shows.',
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
