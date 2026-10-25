import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.tsx';

interface SiteLogoProps {
  className?: string;
  markClassName?: string;
  imageClassName?: string;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  className = '',
  markClassName = '',
  imageClassName = '',
}) => {
  const { settings } = useSiteSettings();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [settings.logoUrl]);

  return (
    <span className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <span className={`flex shrink-0 items-center justify-center overflow-hidden ${markClassName}`}>
        {settings.logoUrl && !imageFailed ? (
          <img
            src={settings.logoUrl}
            alt=""
            className={`h-full w-full object-contain ${imageClassName}`}
            onError={() => {
              console.error('The configured website logo could not be loaded.');
              setImageFailed(true);
            }}
          />
        ) : (
          <Flame className="h-6 w-6 fill-amber-400 text-amber-200" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-serif-title font-bold leading-tight">
          {settings.websiteName || settings.businessName}
        </span>
        {settings.websiteSubtitle && (
          <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-wider">
            {settings.websiteSubtitle}
          </span>
        )}
      </span>
    </span>
  );
};
