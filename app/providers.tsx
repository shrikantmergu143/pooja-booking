'use client';

import React from 'react';
import { LanguageProvider } from '../src/hooks/useLanguage.tsx';
import type { AppSettings } from '../src/types/index.ts';
import { SiteSettingsProvider } from '../src/hooks/useSiteSettings.tsx';

export function AppProviders({
  children,
  initialSettings,
}: React.PropsWithChildren<{ initialSettings: AppSettings }>) {
  return (
    <LanguageProvider>
      <SiteSettingsProvider initialSettings={initialSettings}>
        {children}
      </SiteSettingsProvider>
    </LanguageProvider>
  );
}
