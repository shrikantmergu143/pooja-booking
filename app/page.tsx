import type { Metadata } from 'next';
import satyanarayanImage from '../src/assets/images/pooja_satyanarayan_1792745405904.jpg';
import HomePageClient from './HomePageClient.tsx';
import { getPublicSiteSettings, getSiteOrigin } from './site-settings.ts';
import React from 'react';
import { App as AntdApp, ConfigProvider } from 'antd';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteOrigin = getSiteOrigin(settings);
  const siteName = settings.websiteName || settings.businessName;
  return {
    title: 'Vedic Pooja, Made Clear and Thoughtful',
    description: `Find guidance for Vedic poojas, family ceremonies, and spiritual consultations. Share your needs with ${settings.businessName} in ${settings.serviceCity}.`,
    openGraph: {
      title: 'Vedic Pooja, Made Clear and Thoughtful',
      description: `Explore traditional Vedic services and receive personal guidance from ${settings.businessName}.`,
      images: [
        {
          url: satyanarayanImage.src,
          width: satyanarayanImage.width,
          height: satyanarayanImage.height,
          alt: 'A traditional Vedic pooja ceremony arranged for a family',
        },
      ],
    },
    twitter: { images: [satyanarayanImage.src] },
    alternates: { canonical: siteOrigin.toString() },
    applicationName: siteName,
  };
}

export default function HomePage() {
  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#7A1C24',
            colorLink: '#7A1C24',
            colorLinkHover: '#5E141B',
            borderRadius: 8,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          },
        }}
      >
        {/* <AntdApp> */}
          <HomePageClient />
        {/* </AntdApp> */}
      </ConfigProvider>
    </React.Fragment>
  );
}
