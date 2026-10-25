import type { Metadata } from 'next';
import { publicEnvironment } from '../src/config/public-env.ts';
import { AppProviders } from './providers.tsx';
import { getPublicSiteSettings, getSiteOrigin } from './site-settings.ts';
import '../src/index.css';
import 'react-toastify/dist/ReactToastify.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteName = settings.websiteName || settings.businessName;
  const siteUrl = getSiteOrigin(settings);
  return {
    metadataBase: siteUrl,
    title: {
      default: `${siteName} | Vedic Pooja & Guidance`,
      template: `%s | ${siteName}`,
    },
    description: `Plan Vedic poojas, consultations, and family ceremonies with guidance from ${settings.businessName}.`,
    applicationName: siteName,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName,
      title: `${siteName} | Vedic Pooja & Guidance`,
      description: `Explore traditional Vedic services and receive personal guidance from ${settings.businessName}.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: `Thoughtful guidance for Vedic poojas and family ceremonies from ${settings.businessName}.`,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await getPublicSiteSettings();
  return (
    <html lang="en">
      <body className="bg-[#fbf8f1] text-stone-900 antialiased">
        <AppProviders initialSettings={initialSettings}>{children}</AppProviders>
      </body>
    </html>
  );
}
