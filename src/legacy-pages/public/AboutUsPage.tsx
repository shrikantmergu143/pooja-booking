import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.tsx';

const panditResponsibilities = [
  { icon: BookOpen, key: 'prepare' },
  { icon: Sparkles, key: 'conduct' },
  { icon: HeartHandshake, key: 'include' },
  { icon: Award, key: 'experience' },
];

export const AboutUsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FAF7F2]">
    <section className="border-b border-[#E7E2DA] bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">{t('about.eyebrow')}</span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#7A1C24] mt-3">
          {t('about.title')}
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed mt-5 max-w-3xl">
          {t('about.intro')}
        </p>
        <Link
          to="/poojas"
          className="inline-flex mt-7 px-5 py-3 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-sm font-semibold rounded-lg"
        >
          {t('about.explore')}
        </Link>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">{t('about.roleEyebrow')}</span>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
          {t('about.roleTitle')}
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed mt-3">
          {t('about.roleDescription')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {panditResponsibilities.map(({ icon: Icon, key }) => (
          <article key={key} className="bg-white border border-[#E7E2DA] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#7A1C24] flex items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title text-lg font-bold text-stone-900">{t(`about.responsibilities.${key}.title`)}</h3>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">{t(`about.responsibilities.${key}.description`)}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[#210D10] text-stone-200 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <h2 className="font-serif-title text-2xl font-bold text-amber-100">{t('about.experienceTitle')}</h2>
        <p className="text-sm leading-relaxed text-stone-300 mt-3 max-w-3xl">
          {t('about.experienceDescription')}
        </p>
        <Link to="/contact" className="inline-block mt-5 text-sm font-semibold text-amber-300 hover:text-amber-100 underline">
          {t('about.contact')}
        </Link>
      </div>
    </section>
  </div>
  );
};
