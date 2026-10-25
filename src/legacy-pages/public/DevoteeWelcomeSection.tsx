import React from 'react';
import { Link } from 'react-router-dom';
import {
  BellRing,
  BookOpen,
  CalendarCheck,
  HandHeart,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.tsx';

const serviceSteps = [
  {
    icon: BookOpen,
    key: 'explore',
  },
  {
    icon: CalendarCheck,
    key: 'request',
  },
  {
    icon: HandHeart,
    key: 'prepare',
  },
  {
    icon: BellRing,
    key: 'updates',
  },
];

export const DevoteeWelcomeSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#210D10] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              {t('welcome.eyebrow')}
            </div>
            <h2 className="font-serif-title text-3xl sm:text-5xl font-bold leading-tight mt-4">
              {t('welcome.title')}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mt-5 max-w-2xl">
              {t('welcome.description')}
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                to="/appointment"
                className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-stone-950 hover:bg-amber-300"
              >
                {t('welcome.bookAppointment')}
              </Link>
              <Link
                to="/about-us"
                className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {t('welcome.ourApproach')}
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-amber-300" />
              {t('welcome.availability')}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
            <h3 className="font-serif-title text-xl font-bold text-amber-100">
              {t('welcome.journey')}
            </h3>
            <div className="mt-6 space-y-5">
              {serviceSteps.map(({ icon: Icon, key }, index) => (
                <div key={key} className="flex gap-4">
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-amber-400/15 text-amber-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    {index < serviceSteps.length - 1 && (
                      <div className="absolute top-10 w-px h-8 bg-white/15" />
                    )}
                  </div>
                  <div className="pb-1">
                    <h4 className="text-sm font-semibold text-white">{t(`welcome.steps.${key}.title`)}</h4>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mt-1">
                      {t(`welcome.steps.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  </section>
  );
};
