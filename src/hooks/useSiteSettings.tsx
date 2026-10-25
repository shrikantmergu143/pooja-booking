'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.ts';
import type { AppSettings } from '../types/index.ts';
import { DEFAULT_SITE_SETTINGS } from '../config/site-settings.ts';

interface SiteSettingsContextValue {
  settings: AppSettings;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: React.PropsWithChildren<{ initialSettings: AppSettings }>) {
  const [settings, setSettings] = useState<AppSettings>({
    ...DEFAULT_SITE_SETTINGS,
    ...initialSettings,
  });

  const refreshSettings = async () => {
    try {
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...(await api.getPublicSettings()) });
    } catch (error) {
      console.error('Failed to refresh public site settings.', error);
      throw error;
    }
  };

  useEffect(() => {
    void refreshSettings().catch(() => {
      // Keep the server-provided settings available when the API is temporarily offline.
    });
  }, []);

  const value = useMemo(
    () => ({ settings, refreshSettings }),
    [settings],
  );
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider.');
  }
  return context;
}
