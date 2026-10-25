'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Flower2,
  HandHeart,
  MapPin,
  Phone,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import ganeshImage from '../src/assets/images/pooja_ganesh_puja_1792745404956.jpg';
import grihaImage from '../src/assets/images/pooja_griha_pravesh_1792745408082.jpg';
import rudrabhishekImage from '../src/assets/images/pooja_rudrabhishek_1792745407484.jpg';
import satyanarayanImage from '../src/assets/images/pooja_satyanarayan_1792745405904.jpg';
import { LanguageSelector } from '../src/components/common/LanguageSelector.tsx';
import { SiteLogo } from '../src/components/common/SiteLogo.tsx';
import { useLanguage } from '../src/hooks/useLanguage.tsx';
import { useSiteSettings } from '../src/hooks/useSiteSettings.tsx';
import { publicEnvironment } from '../src/config/public-env.ts';

const serviceCards = [
  {
    key: 'ganesh',
    image: ganeshImage,
    href: '/poojas/ganesh-puja-havan',
  },
  {
    key: 'grihaPravesh',
    image: grihaImage,
    href: '/poojas/griha-pravesh-vastu-shanti',
  },
  {
    key: 'rudrabhishek',
    image: rudrabhishekImage,
    href: '/poojas/maha-rudrabhishek-puja',
  },
  {
    key: 'satyanarayan',
    image: satyanarayanImage,
    href: '/poojas/satyanarayan-puja-katha',
  },
];

const steps = [
  {
    number: '01',
    key: 'request',
    icon: Flower2,
  },
  {
    number: '02',
    key: 'details',
    icon: CalendarCheck,
  },
  {
    number: '03',
    key: 'confirm',
    icon: HandHeart,
  },
  {
    number: '04',
    key: 'prepare',
    icon: Check,
  },
];

const faqs = [
  {
    key: 'request',
  },
  {
    key: 'choose',
  },
  {
    key: 'availability',
  },
  {
    key: 'followUp',
  },
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const hideCeremonies = publicEnvironment.hidePublicCeremonies;
  const faqItems = faqs.map(({ key }) => ({
    question: t(`landing.faq.${key}.question`),
    answer: t(`landing.faq.${key}.answer`, {
      city: settings.serviceCity,
      business: settings.businessName,
    }),
  }));
  const siteName = settings.websiteName || settings.businessName;
  const siteOrigin = (() => {
    try {
      const domain = settings.websiteDomain || 'https://www.vishnusudarshana.com';
      return new URL(domain.match(/^[a-z][a-z\d+.-]*:\/\//i) ? domain : `https://${domain}`);
    } catch (error) {
      console.error('Invalid website domain in structured metadata.', error);
      return new URL('https://www.vishnusudarshana.com');
    }
  })();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': new URL('/#organization', siteOrigin).toString(),
        name: settings.businessName,
        url: siteOrigin.toString(),
        telephone: settings.helplinePhone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.serviceAddress,
          addressLocality: settings.serviceCity,
          addressCountry: 'IN',
        },
        areaServed: settings.serviceCity,
      },
      {
        '@type': 'WebSite',
        name: siteName,
        url: siteOrigin.toString(),
        inLanguage: language === 'mr' ? 'mr-IN' : 'en-IN',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="bg-[#651c24] text-[#fff2d1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs sm:px-8">
          <p className="hidden items-center gap-2 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {t('landing.topline')}
          </p>
          <div className=" flex items-center gap-3">
            <LanguageSelector className="ml-auto text-white md:ml-0" />

            <a className="ml-auto flex items-center gap-2 hover:text-white" href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`}>
              <Phone className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('header.poojaHelpline')}: {settings.helplinePhone}</span>
            </a>
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span>{t('header.contactUs')}</span>
          </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbf8f1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-[#651c24]" aria-label={`${siteName} ${t('landing.home')}`}>
            <SiteLogo
              className="max-w-[17rem]"
              markClassName="h-11 w-11 rounded-2xl bg-[#651c24] text-amber-300 shadow-sm"
            />
          </Link>
          <nav aria-label={t('landing.mainNavigation')} className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
            {!hideCeremonies && <Link className="transition hover:text-[#651c24]" href="/poojas">{t('landing.poojas')}</Link>}
            <Link className="transition hover:text-[#651c24]" href="/about-us">{t('landing.about')}</Link>
            <Link className="transition hover:text-[#651c24]" href="/contact">{t('landing.contact')}</Link>
          </nav>
          <Link
            href="/appointment"
            className="rounded-full bg-[#651c24] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#48131a] sm:px-5 sm:text-sm"
          >
            {t('landing.bookAppointment')}
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#fbf8f1]">
        <div className="absolute -right-40 -top-44 -z-10 h-[38rem] w-[38rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#7a4b11]">
              <Sparkles className="h-4 w-4" />
              {t('landing.heroEyebrow')}
            </span>
            <h1 className="mt-6 max-w-2xl font-serif-title text-4xl font-bold leading-[1.13] tracking-tight text-[#4f171d] sm:text-5xl lg:text-6xl">
              {t('landing.heroTitle')}
              <span className="mt-2 block text-[#9b641b]">{t('landing.heroAccent')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              {t('landing.heroDescription', { city: settings.serviceCity })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!hideCeremonies && (
                <Link
                  href="/poojas"
                  className="inline-flex items-center gap-2 rounded-full bg-[#651c24] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-[#48131a]"
                >
                  {t('landing.explorePoojas')} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/appointment"
                className="rounded-full border border-stone-300 bg-white/70 px-6 py-3.5 text-sm font-bold text-stone-800 transition hover:border-[#651c24] hover:text-[#651c24]"
              >
                {t('landing.talkToTeam')}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-stone-600">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-700" /> {t('landing.benefits.clear')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-700" /> {t('landing.benefits.coordination')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-700" /> {t('landing.benefits.guidance')}</li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-amber-300/70" />
            <div className="relative overflow-hidden rounded-[1.7rem] bg-[#391014] shadow-2xl shadow-rose-950/20">
              <Image
                src={satyanarayanImage}
                alt={t('landing.heroImageAlt')}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-[25rem] w-full object-cover sm:h-[34rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#210c10]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">{t('landing.heroImageEyebrow')}</p>
                <p className="mt-2 max-w-sm font-serif-title text-2xl font-semibold leading-snug sm:text-3xl">
                  {t('landing.heroImageTitle')}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
                  <MapPin className="h-4 w-4 text-amber-300" /> {settings.serviceCity}, {t('landing.state')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          {[
            ['tradition', Flower2],
            ['simple', CalendarCheck],
            ['guidance', HandHeart],
          ].map(([key, Icon]) => (
            <article key={key as string} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#8d5c1e]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif-title text-base font-bold text-stone-900">{t(`landing.trust.${key}.title`)}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{t(`landing.trust.${key}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {!hideCeremonies && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b641b]">{t('landing.servicesEyebrow')}</p>
              <h2 className="mt-3 font-serif-title text-3xl font-bold text-[#4f171d] sm:text-4xl">
                {t('landing.servicesTitle')}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                {t('landing.servicesDescription')}
              </p>
            </div>
            <Link href="/poojas" className="inline-flex items-center gap-2 text-sm font-bold text-[#651c24] hover:underline">
              {t('landing.viewAllServices')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((service) => (
              <article key={service.key} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl">
                <Link href={service.href} className="block">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={t(`landing.services.${service.key}.imageAlt`)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#651c24]">
                      {t('landing.ceremonyLabel')}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif-title text-lg font-bold text-stone-900">{t(`landing.services.${service.key}.title`)}</h3>
                    <p className="mt-2 min-h-16 text-sm leading-6 text-stone-600">{t(`landing.services.${service.key}.description`)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#651c24]">
                      {t('landing.learnMore')} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#291114] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{t('landing.processEyebrow')}</p>
              <h2 className="mt-3 font-serif-title text-3xl font-bold leading-tight sm:text-4xl">
                {t('landing.processTitle')}
              </h2>
              <p className="mt-5 text-sm leading-7 text-stone-300">
                {t('landing.processDescription')}
              </p>
              <Link href="/appointment" className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-[#321216] transition hover:bg-amber-200">
                {t('landing.bookAppointment')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {steps.map(({ number, key, icon: Icon }) => (
                <li key={number} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-amber-300">{number}</span>
                    <Icon className="h-5 w-5 text-amber-300" />
                  </div>
                  <h3 className="mt-5 font-serif-title text-lg font-bold">{t(`landing.steps.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{t(`landing.steps.${key}.description`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative min-h-[20rem] overflow-hidden rounded-[1.6rem]">
            <Image
              src={grihaImage}
              alt={t('landing.aboutImageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 font-serif-title text-xl font-bold text-white sm:text-2xl">
              {t('landing.aboutImageCaption')}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b641b]">{t('landing.aboutEyebrow')}</p>
            <h2 className="mt-3 font-serif-title text-3xl font-bold leading-tight text-[#4f171d] sm:text-4xl">
              {t('landing.aboutTitle')}
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-600">
              {t('landing.aboutDescription', { business: settings.businessName })}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              {t('landing.aboutLocation', { city: settings.serviceCity })}
            </p>
            <Link href="/about-us" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#651c24] hover:underline">
              {t('landing.readAbout')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[#f4eee3]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9b641b]">
              <CircleHelp className="h-4 w-4" /> {t('landing.faqEyebrow')}
            </p>
            <h2 className="mt-3 font-serif-title text-3xl font-bold text-[#4f171d] sm:text-4xl">
              {t('landing.faqTitle')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {t('landing.faqDescription')}
            </p>
          </div>
          <div className="divide-y divide-stone-300">
            {faqItems.map(({ question, answer }) => (
              <details key={question} className="group py-5 first:pt-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif-title text-base font-bold text-stone-900 marker:hidden">
                  {question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#651c24] transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-[1.6rem] bg-gradient-to-br from-[#711f28] to-[#421319] p-7 text-white shadow-xl sm:p-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{t('landing.ctaEyebrow')}</p>
            <h2 className="mt-3 font-serif-title text-2xl font-bold sm:text-3xl">
              {t('landing.ctaTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {t('landing.ctaDescription', { city: settings.serviceCity })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/appointment" className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-[#321216] hover:bg-amber-200">
              {t('landing.bookAppointment')} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              <Phone className="h-4 w-4" /> {settings.helplinePhone}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#1e0d10] text-stone-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="font-serif-title text-lg font-bold text-amber-100">{siteName}</Link>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">{settings.websiteSubtitle}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
              {t('landing.footerDescription')}
            </p>
          </div>
          <div>
            <h2 className="font-serif-title text-sm font-bold text-amber-100">{t('landing.footerExplore')}</h2>
            <ul className="mt-4 space-y-3 text-sm text-stone-400">
              {!hideCeremonies && <li><Link href="/poojas" className="hover:text-amber-200">{t('landing.poojasAndCeremonies')}</Link></li>}
              <li><Link href="/appointment" className="hover:text-amber-200">{t('landing.bookAppointment')}</Link></li>
              <li><Link href="/about-us" className="hover:text-amber-200">{t('landing.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-amber-200">{t('landing.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif-title text-sm font-bold text-amber-100">{t('landing.visitOrCall')}</h2>
            <p className="mt-4 flex gap-3 text-sm leading-6 text-stone-400">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
              {[settings.serviceAddress, settings.serviceCity].filter(Boolean).join(', ')}
            </p>
            <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="mt-3 inline-flex items-center gap-3 text-sm text-stone-400 hover:text-amber-200">
              <Phone className="h-4 w-4 text-amber-300" /> {settings.helplinePhone}
            </a>
            <a href={siteOrigin.toString()} className="mt-2 block text-sm text-stone-400 hover:text-amber-200">{siteOrigin.host}</a>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-stone-500">
          {t('landing.copyright', { year: new Date().getFullYear(), name: settings.businessName })}
        </div>
      </footer>
    </main>
  );
}
