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

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] border-b border-[#E7E2DA] pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Value Prop, Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-300/60 rounded-md text-amber-900 text-xs font-semibold tracking-wide">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Gurukul-Certified Vedic Priests · Authentic 36-Item Samagri</span>
              </div>

              <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#7A1C24] leading-[1.15] tracking-tight">
                Authentic Vedic Poojas, <br />
                <span className="text-amber-800">Conducted with Devotion at Your Home.</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Book verified, experienced Pandits for Griha Pravesh, Ganesh Puja, Rudrabhishek, Havans, and festive sanskars. Transparent package pricing with dakshina and full samagri included.
              </p>

              {/* Quick Search & Category Bar */}
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

              {/* Key trust bullets */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fixed Dakshina & No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Exact Shubh Muhurat Timing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>In-Person & Online E-Pooja</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Altar Card */}
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
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
              Ceremony Collections
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-stone-900 mt-1">
              Browse by Ritual Purpose
            </h2>
          </div>
          <Link
            to="/poojas"
            className="text-sm font-semibold text-[#7A1C24] hover:text-[#5E141B] flex items-center gap-1 group"
          >
            <span>View All Ceremonies</span>
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
                  <span>Explore Rituals</span>
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
            Vedic Ceremonies
          </div>
          <h2 className="text-3xl font-bold font-serif-title text-stone-900">
            Most Frequently Booked Poojas
          </h2>
          <p className="text-sm text-stone-600">
            Performed strictly per Vedic Paddhati by experienced Acharyas with full Samagri and sacred mantras.
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
                      {pooja.durationMinutes} mins
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
                    <span className="text-[10px] text-stone-500 uppercase block font-medium">Starting at</span>
                    <span className="text-lg font-bold text-[#7A1C24] font-mono">
                      ₹{minPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/poojas/${pooja.slug}`}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/book?pooja=${pooja.slug}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-xs transition-colors"
                    >
                      Book Now
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
              Our Vedic Priests
            </div>
            <h2 className="text-3xl font-bold font-serif-title text-stone-900">
              Verified Gurukul & Sanskrit Scholars
            </h2>
            <p className="text-sm text-stone-600">
              Each Pandit is verified for Sanskrit fluency, Vedic ancestry, ritual accuracy, and respectful conduct.
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
                      {pandit.experienceYears}+ Years of Ritual Experience
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
            <h2 className="font-serif-title text-xl font-bold text-stone-900">Learn about the work of a Vedic pandit</h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">
              Discover how our pandits prepare for ceremonies, guide families through each ritual, and share their knowledge.
            </p>
          </div>
          <Link
            to="/about-us"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#7A1C24] px-4 py-2.5 text-sm font-semibold text-[#7A1C24] hover:bg-rose-50"
          >
            About our pandits
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. 4-Step Sacred Ceremony Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
            Simple & Transparent
          </div>
          <h2 className="text-3xl font-bold font-serif-title text-stone-900">
            How BookMyPooja Works
          </h2>
          <p className="text-sm text-stone-600">
            Experience divine blessings in 4 seamless steps without running around for pandits or samagri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Select Ceremony & Package',
              desc: 'Choose from Vedic Havans, Griha Pravesh, or custom rituals with transparent inclusions.',
              icon: BookOpen,
            },
            {
              step: '02',
              title: 'Select Date & Shubh Muhurat',
              desc: 'Pick your auspicious date and live available time slot verified against Pandit schedules.',
              icon: Calendar,
            },
            {
              step: '03',
              title: 'Pandit Arrives with Samagri',
              desc: 'Our verified Acharya arrives punctually with pure 36-item samagri and sets up the sanctified altar.',
              icon: Sparkles,
            },
            {
              step: '04',
              title: 'Sankalp & Divine Blessings',
              desc: 'Ritual concludes with family Sankalp, Purnahuti, Aarti, and personalized Vedic blessings.',
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
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.desc}
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
              Custom Vedic Consultations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title text-white">
              Planning a Special Multi-Day Katha or Vedic Yagya?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              We arrange customized ceremonies including Shrimad Bhagwat Katha, Chandi Path, Ayush Havan, and temple consecrations with tailored priest teams and dakshina quotes.
            </p>
          </div>

          <Link
            to="/book?type=custom"
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-900 text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            Request Custom Quote
          </Link>
        </div>
      </section>
    </div>
  );
};
