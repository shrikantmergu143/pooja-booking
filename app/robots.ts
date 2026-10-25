import type { MetadataRoute } from 'next';
import { publicEnvironment } from '../src/config/public-env.ts';
import { getPublicSiteSettings, getSiteOrigin } from './site-settings.ts';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSiteSettings();
  const siteUrl = getSiteOrigin(settings);
  const disallow = ['/admin', '/admin/'];
  if (publicEnvironment.hidePublicCeremonies) {
    disallow.push('/poojas', '/book', '/track');
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
