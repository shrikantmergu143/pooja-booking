import type { MetadataRoute } from 'next';
import { publicEnvironment } from '../src/config/public-env.ts';
import { getPublicSiteSettings, getSiteOrigin } from './site-settings.ts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getPublicSiteSettings();
  const siteUrl = getSiteOrigin(settings);
  const pages: MetadataRoute.Sitemap = [
    { url: new URL('/', siteUrl).toString(), changeFrequency: 'weekly', priority: 1 },
    { url: new URL('/about-us', siteUrl).toString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: new URL('/contact', siteUrl).toString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: new URL('/appointment', siteUrl).toString(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  if (!publicEnvironment.hidePublicCeremonies) {
    pages.push({
      url: new URL('/poojas', siteUrl).toString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return pages;
}
