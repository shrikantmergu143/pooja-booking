const parseBoolean = (name: string, value: string | undefined) => {
  if (value === undefined) return false;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  throw new Error(`${name} must be either "true" or "false".`);
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.VITE_API_BASE_URL ??
  'http://localhost:4000';

export const publicEnvironment = {
  apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
  hidePublicCeremonies: parseBoolean(
    'NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES',
    process.env.NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES ??
      process.env.VITE_HIDE_PANDIT_APPOINTMENT,
  ),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined,
};
