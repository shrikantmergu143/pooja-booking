import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

loadEnvConfig(process.cwd());

const parseBoolean = (name: string, value: string | undefined) => {
  if (value === undefined) return false;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  throw new Error(`${name} must be either "true" or "false".`);
};

const parsePublicUrl = (name: string, value: string | undefined) => {
  if (value === undefined) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTP(S) URL.`);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`${name} must be an absolute HTTP(S) URL without credentials.`);
  }
  return url;
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.VITE_API_BASE_URL ??
  'http://localhost:4000';
const apiUrl = parsePublicUrl('NEXT_PUBLIC_API_BASE_URL', apiBaseUrl);
if (apiUrl?.search || apiUrl?.hash) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL must not include a query or fragment.');
}
const normalizedApiBaseUrl = apiUrl
  ? `${apiUrl.origin}${apiUrl.pathname.replace(/\/+$/, '')}`
  : undefined;

const hidePublicCeremonies = parseBoolean(
  'NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES',
  process.env.NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES ??
    process.env.VITE_HIDE_PANDIT_APPOINTMENT,
);
const siteUrl = parsePublicUrl(
  'NEXT_PUBLIC_SITE_URL',
  process.env.NEXT_PUBLIC_SITE_URL,
);
if (siteUrl && (siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash)) {
  throw new Error('NEXT_PUBLIC_SITE_URL must contain only the website origin.');
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: normalizedApiBaseUrl,
    NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES: String(hidePublicCeremonies),
    NEXT_PUBLIC_SITE_URL: siteUrl?.origin ?? '',
  },
};

export default nextConfig;
