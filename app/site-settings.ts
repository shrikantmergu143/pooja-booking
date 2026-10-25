import { publicEnvironment } from '../src/config/public-env.ts';
import { DEFAULT_SITE_SETTINGS } from '../src/config/site-settings.ts';
import type { AppSettings } from '../src/types/index.ts';

export async function getPublicSiteSettings(): Promise<AppSettings> {
  try {
    const response = await fetch(
      `${publicEnvironment.apiBaseUrl}/api/v1/settings/public`,
      { cache: 'no-store', signal: AbortSignal.timeout(3000) },
    );
    if (!response.ok) {
      throw new Error(`Public site settings request failed with HTTP ${response.status}.`);
    }
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || !('data' in payload)) {
      throw new Error('Public site settings response has an invalid format.');
    }
    const data = payload.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Public site settings data is invalid.');
    }
    return { ...DEFAULT_SITE_SETTINGS, ...(data as Partial<AppSettings>) };
  } catch (error) {
    console.error('Failed to load public site settings; using configured defaults.', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function getSiteOrigin(settings: AppSettings): URL {
  const configuredDomain = settings.websiteDomain?.trim();
  if (!configuredDomain) {
    return new URL(publicEnvironment.siteUrl || 'https://www.vishnusudarshana.com');
  }
  const normalized = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredDomain)
    ? configuredDomain
    : `https://${configuredDomain}`;
  try {
    const url = new URL(normalized);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      (url.pathname !== '/' && url.pathname !== '') ||
      url.search ||
      url.hash
    ) {
      throw new Error('Website domain must contain only an HTTP(S) origin.');
    }
    return url;
  } catch (error) {
    console.error('Invalid configured website domain; using the canonical site URL.', error);
    return new URL(publicEnvironment.siteUrl || 'https://www.vishnusudarshana.com');
  }
}
