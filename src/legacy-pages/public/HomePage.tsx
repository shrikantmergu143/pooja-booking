import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Pooja, PoojaCategory, Pandit } from '../../types/index.ts';
import {
  Flame,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Spin } from 'antd';
import { DevoteeWelcomeSection } from './DevoteeWelcomeSection.tsx';
import { useLanguage } from '../../hooks/useLanguage.tsx';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<PoojaCategory[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, pjs, pndts] = await Promise.all([
          api.getCategories(),
          api.getPoojas(),
          api.getPandits(),
        ]);
        setCategories(cats);
        setPoojas(pjs);
        setPandits(pndts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/poojas?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/poojas');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <DevoteeWelcomeSection />
      <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      {/* <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] border-b border-[#E7E2DA] pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-300/60 rounded-md text-amber-900 text-xs font-semibold tracking-wide">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Gurukul-Certified Vedic Priests · Authentic 36-Item Samagri</span>
              </div>

              <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#7A1C24] leading-[1.15] tracking-tight">
                Make Every Sacred Occasion <br />
                <span className="text-amber-800">Meaningful, Guided by Tradition.</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Find a ceremony for your family, understand what it includes, and connect with a Vedic pandit to help guide each step. Explore poojas for new beginnings, family wellbeing, festivals, and other important occasions.
              </p>

              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white rounded-xl shadow-md border border-[#E7E2DA]">
                  <div className="flex items-center gap-2 px-3 flex-1 w-full">
                    <Search className="w-5 h-5 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search pooja (e.g. Ganesh, Griha Pravesh, Rudrabhishek)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 text-sm text-stone-800 placeholder-stone-400 outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-sm font-semibold rounded-lg transition-all shadow active:scale-95 whitespace-nowrap"
                  >
                    Find Pooja
                  </button>
                </div>
              </form>

              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clear ceremony and package details</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Guidance from selection to ceremony</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Home and online options where available</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-900/10 bg-white">
                <img
                  src={poojas[0]?.imageUrl}
                  alt="Vedic Pooja Ritual"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-widest font-serif-title">
                    Featured Divine Ceremony
                  </div>
                  <h3 className="text-xl font-bold font-serif-title text-amber-100 mt-1">
                    {poojas[0]?.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                    {poojas[0]?.shortDescription}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-300 block">Starting from</span>
                      <span className="text-lg font-bold text-amber-300 font-mono">
                        ₹{poojas[0]?.packages[0]?.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link
                      to={`/poojas/${poojas[0]?.slug}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>View Packages</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 rounded-2xl border border-[#E7E2DA] bg-white p-6 sm:p-9 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">{t('home.planEyebrow')}</span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
              {t('home.planTitle')}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-4">
              {t('home.planDescription')}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">
              {t('home.occasionDescription')}
            </p>
          </div>
          <div className="rounded-xl bg-[#FAF7F2] border border-amber-100 p-5 sm:p-6">
            <h3 className="font-serif-title text-lg font-bold text-stone-900">{t('home.howWeHelp')}</h3>
            <ul className="mt-4 space-y-4 text-sm text-stone-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t('home.helpItems.0')}</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t('home.helpItems.1')}</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t('home.helpItems.2')}</span>
              </li>
            </ul>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#7A1C24] hover:text-[#5E141B]"
            >
              {t('home.learnPandits')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
              {t('home.collections')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 mt-1">
              {t('home.browsePurpose')}
            </h2>
          </div>
          <Link
            to="/poojas"
            className="text-sm font-semibold text-[#7A1C24] hover:text-[#5E141B] flex items-center gap-1 group"
          >
            <span>{t('home.allCeremonies')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/poojas?category=${cat.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-[#E7E2DA] hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-title font-bold text-base text-amber-100">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#7A1C24] group-hover:text-amber-800">
                  <span>{t('home.exploreRituals')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Poojas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
            {t('home.vedicCeremonies')}
          </div>
          <h2 className="text-3xl font-bold font-serif-title text-stone-900">
            {t('home.frequentlyBooked')}
          </h2>
          <p className="text-sm text-stone-600">
            {t('home.frequentlyBookedDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poojas.map((pooja) => {
            const minPrice = Math.min(...pooja.packages.map(p => p.price));
            return (
              <div
                key={pooja.id}
                className="bg-white rounded-xl overflow-hidden border border-[#E7E2DA] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={pooja.imageUrl}
                      alt={pooja.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500/90 text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow backdrop-blur-xs">
                      {t('home.minutes', { duration: pooja.durationMinutes })}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-[#7A1C24] font-semibold uppercase tracking-wider font-serif-title">
                      {pooja.categoryName}
                    </div>

                    <h3 className="font-serif-title text-lg font-bold text-stone-900 leading-snug">
                      <Link to={`/poojas/${pooja.slug}`} className="hover:text-[#7A1C24] transition-colors">
                        {pooja.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {pooja.shortDescription}
                    </p>

                    {/* Unboxed Metadata (Zero-Pill discipline) */}
                    <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pooja.durationMinutes} Mins</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pooja.supportedModes.join(', ')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price and Actions */}
                <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-medium">{t('home.startingAt')}</span>
                    <span className="text-lg font-bold text-[#7A1C24] font-mono">
                      ₹{minPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/poojas/${pooja.slug}`}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      {t('home.details')}
                    </Link>
                    <Link
                      to={`/book?pooja=${pooja.slug}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-xs transition-colors"
                    >
                      {t('home.bookNow')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Our Vedic Pandits Showcase */}
      <section className="bg-amber-950/5 border-y border-amber-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
              {t('home.ourPriests')}
            </div>
            <h2 className="text-3xl font-bold font-serif-title text-stone-900">
              {t('home.verifiedScholars')}
            </h2>
            <p className="text-sm text-stone-600">
              {t('home.priestVerification')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pandits.map((pandit) => (
              <div
                key={pandit.id}
                className="bg-white rounded-xl p-6 border border-[#E7E2DA] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={pandit.profileImage}
                    alt={pandit.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-stone-900">
                      {pandit.fullName}
                    </h3>
                    <div className="text-xs font-medium text-amber-700">
                      {t('home.yearsExperience', { years: pandit.experienceYears })}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {pandit.languages.join(' · ')}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{pandit.biography}"
                </p>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {pandit.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8">
        <div className="rounded-xl border border-[#E7E2DA] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="font-serif-title text-xl font-bold text-stone-900">{t('home.learnPanditWork')}</h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">
              {t('home.panditWorkDescription')}
            </p>
          </div>
          <Link
            to="/about-us"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#7A1C24] px-4 py-2.5 text-sm font-semibold text-[#7A1C24] hover:bg-rose-50"
          >
            {t('home.aboutPandits')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. 4-Step Sacred Ceremony Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
            {t('home.simpleTransparent')}
          </div>
          <h2 className="text-3xl font-bold font-serif-title text-stone-900">
            {t('home.howItWorks')}
          </h2>
          <p className="text-sm text-stone-600">
            {t('home.workflowDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              key: 'select',
              icon: BookOpen,
            },
            {
              step: '02',
              key: 'schedule',
              icon: Calendar,
            },
            {
              step: '03',
              key: 'pandit',
              icon: Sparkles,
            },
            {
              step: '04',
              key: 'blessings',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative bg-white p-6 rounded-xl border border-[#E7E2DA] shadow-xs">
                <div className="text-3xl font-bold text-amber-200/80 font-mono mb-3">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#7A1C24] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif-title font-bold text-base text-stone-900 mb-2">
                  {t(`home.workflow.${item.key}.title`)}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t(`home.workflow.${item.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Custom Ceremony Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-[#7A1C24] to-[#551016] text-amber-100 rounded-2xl p-8 sm:p-12 shadow-xl border border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-serif-title">
              {t('home.consultations')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-white">
              {t('home.specialPlanning')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {t('home.customDescription')}
            </p>
          </div>

          <Link
            to="/book?type=custom"
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-900 text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            {t('home.customQuote')}
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
};
