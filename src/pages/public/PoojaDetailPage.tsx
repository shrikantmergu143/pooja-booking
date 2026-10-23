import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Pooja, PoojaPackage } from '../../types/index.ts';
import {
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
  Quote,
  FileText,
} from 'lucide-react';
import { Spin, Tabs } from 'antd';

export const PoojaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pooja, setPooja] = useState<Pooja | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  useEffect(() => {
    async function loadPooja() {
      if (!slug) return;
      try {
        const found = await api.getPoojaBySlug(slug);
        setPooja(found);
        if (found.packages.length > 0) {
          // Default to middle / standard package if available or first
          setSelectedPackageId(found.packages[1]?.id || found.packages[0].id);
        }
      } catch {
        setPooja(null);
      } finally {
        setLoading(false);
      }
    }
    loadPooja();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!pooja) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif-title text-stone-900">
          Ceremony Not Found
        </h2>
        <p className="text-sm text-stone-600">
          The requested pooja does not exist or has been retired from the active catalog.
        </p>
        <Link
          to="/poojas"
          className="inline-block px-5 py-2.5 bg-[#7A1C24] text-white text-xs font-semibold rounded-lg"
        >
          Browse All Poojas
        </Link>
      </div>
    );
  }

  const selectedPkg = pooja.packages.find(p => p.id === selectedPackageId) || pooja.packages[0];

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Breadcrumb & Hero Split */}
      <section className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] border-b border-[#E7E2DA] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Breadcrumb */}
          <div className="text-xs text-stone-500 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-[#7A1C24]">Home</Link>
            <span>/</span>
            <Link to="/poojas" className="hover:text-[#7A1C24]">Poojas</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">{pooja.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Image Showcase */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border border-amber-900/10 bg-white">
              <img
                src={pooja.imageUrl}
                alt={pooja.name}
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-4 bg-amber-50/50 border-t border-amber-100 flex items-center justify-between text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Certified Vedic Gurukul Pandits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Pure Cow Ghee Havan</span>
                </div>
              </div>
            </div>

            {/* Right: Title, Specs & Sticky Purchase Box */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
                  {pooja.categoryName}
                </span>
                <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                  {pooja.name}
                </h1>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {pooja.shortDescription}
                </p>
              </div>

              {/* Sacred Vedic Quote / Shloka Inscription */}
              {pooja.quote && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-2xs flex items-start gap-3">
                  <div className="p-1.5 bg-[#7A1C24] text-white rounded-md shrink-0 mt-0.5 shadow-2xs">
                    <Quote className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A1C24] tracking-widest uppercase block font-serif-title">
                      Vedic Inscription & Sacred Verse
                    </span>
                    <p className="font-serif-title text-sm sm:text-base font-semibold text-stone-900 italic mt-0.5 leading-relaxed">
                      "{pooja.quote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Ceremony Meta Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-[#E7E2DA] text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Typical Duration</span>
                  <span className="font-semibold text-stone-800">{pooja.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Service Modes</span>
                  <span className="font-semibold text-stone-800">{pooja.supportedModes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Min. Advance</span>
                  <span className="font-semibold text-stone-800">{pooja.minAdvanceBookingHours} Hours</span>
                </div>
              </div>

              {/* Quick Package Selector & Direct CTA */}
              <div className="p-5 bg-white rounded-xl border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Selected Package</span>
                    <span className="text-base font-bold text-stone-900 font-serif-title">
                      {selectedPkg?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#7A1C24] font-mono">
                      ₹{selectedPkg?.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-500 block">Dakshina & Samagri Included</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to={`/book?pooja=${pooja.slug}&package=${selectedPkg?.id}`}
                    className="flex-1 py-3 px-6 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-sm font-semibold rounded-lg shadow-md transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Selected Package</span>
                  </Link>

                  <a
                    href="#packages-section"
                    className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Compare All ({pooja.packages.length})
                  </a>
                </div>

                {/* Bespoke Custom Quote Request */}
                {pooja.allowCustomQuote !== false && (
                  <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-stone-600 text-[11px]">
                        Need custom rituals or multi-day havan?
                      </span>
                    </div>
                    <Link
                      to={`/book?pooja=${pooja.slug}&type=custom`}
                      className="text-[#7A1C24] font-bold hover:underline text-[11px] flex items-center gap-1"
                    >
                      <span>Custom Quote (from ₹{(pooja.customQuoteStartingPrice || 11000).toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Detailed Package Comparison (Core Requirement) */}
      <section id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
            Package Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 mt-1">
            Choose Your Preferred Ceremonial Tier
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            All tiers include Gurukul-certified Pandits. Higher tiers include co-priests, extensive samagri, and extended havan chanting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pooja.packages.map((pkg) => {
            const isSelected = pkg.id === selectedPackageId;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border-2 bg-white relative ${
                  isSelected
                    ? 'border-[#7A1C24] shadow-xl ring-2 ring-[#7A1C24]/10'
                    : 'border-[#E7E2DA] hover:border-stone-400 shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-6 bg-[#7A1C24] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow">
                    Selected Choice
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif-title text-xl font-bold text-stone-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-stone-100 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#7A1C24] font-mono">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400">Fixed Total</span>
                  </div>

                  {/* Specs summary */}
                  <div className="py-2.5 px-3 bg-stone-50 rounded-lg text-xs space-y-1.5 text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Duration:</span>
                      <span className="font-semibold">{pkg.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pandits Conducted:</span>
                      <span className="font-semibold">{pkg.panditCount} Pandit{pkg.panditCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Samagri Included:</span>
                      <span className="font-semibold text-emerald-700">{pkg.includesSamagri ? 'Yes (Full Kit)' : 'Devotee Prepares'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Dakshina Included:</span>
                      <span className="font-semibold text-emerald-700">{pkg.includesDakshina ? 'Yes (Included)' : 'Excluded'}</span>
                    </div>
                  </div>

                  {/* Inclusions Check List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block">
                      Package Inclusions:
                    </span>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((inc) => (
                        <li key={inc.id} className="text-xs text-stone-600 flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom button */}
                <div className="pt-6 mt-6 border-t border-stone-100">
                  <Link
                    to={`/book?pooja=${pooja.slug}&package=${pkg.id}`}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-center block transition-all ${
                      isSelected
                        ? 'bg-[#7A1C24] text-white hover:bg-[#5E141B] shadow-sm'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    Book This Package
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Ritual Purpose & Vedic Instructions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-6">
          <div>
            <h3 className="font-serif-title text-xl font-bold text-stone-900 mb-2">
              Spiritual Significance & Benefits
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {pooja.description}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h4 className="font-serif-title text-base font-bold text-stone-900 mb-2">
              Key Ritual Objectives
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {pooja.purpose}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-3">
            <h4 className="font-serif-title text-base font-bold text-stone-900">
              Devotee Preparation Checklist (To Keep Ready)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
              {pooja.ritualRequirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 leading-relaxed">
              <span className="font-semibold text-stone-900 block mb-0.5">Vedic Guidance:</span>
              {pooja.instructions}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Available Add-ons */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E7E2DA] space-y-4">
          <h3 className="font-serif-title text-lg font-bold text-stone-900">
            Auspicious Ritual Add-ons
          </h3>
          <p className="text-xs text-stone-500">
            Enhance your ceremony with complementary Vedic offerings available during booking.
          </p>

          <div className="space-y-3 pt-2">
            {pooja.addons.map((addon) => (
              <div
                key={addon.id}
                className="p-3 bg-stone-50/60 rounded-xl border border-stone-200/80 space-y-1"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-stone-800">{addon.name}</span>
                  <span className="text-xs font-bold text-[#7A1C24] font-mono">
                    +₹{addon.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to={`/book?pooja=${pooja.slug}`}
              className="w-full py-2.5 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-xs font-semibold rounded-lg text-center block shadow-xs transition-colors"
            >
              Configure in Booking Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:hidden flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-stone-400 block font-medium">Selected Package</span>
          <span className="text-base font-bold text-[#7A1C24] font-mono">
            ₹{selectedPkg?.price.toLocaleString('en-IN')}
          </span>
        </div>
        <Link
          to={`/book?pooja=${pooja.slug}&package=${selectedPkg?.id}`}
          className="px-5 py-2.5 bg-[#7A1C24] text-white text-xs font-semibold rounded-lg shadow"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};
