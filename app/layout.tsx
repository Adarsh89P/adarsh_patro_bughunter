import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';
const description =
  'Adarsh Patro — Automation QA Engineer building reliable, scalable and efficient testing solutions with Playwright, Selenium, Java and CI/CD.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    'Adarsh Patro',
    'Automation QA Engineer',
    'QA Automation',
    'Playwright',
    'Selenium',
    'TestNG',
    'API Testing',
    'Test Automation Framework',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description,
    siteName: `${profile.name} — A Bug Hunter's Journey`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfe' },
    { media: '(prefers-color-scheme: dark)', color: '#080912' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: ['Test Automation', 'Playwright', 'Selenium', 'API Testing', 'CI/CD', 'Performance Testing'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
              focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
