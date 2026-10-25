import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Pooja, PoojaCategory, ServiceMode } from '../../types/index.ts';
import { Search, Clock, MapPin, Filter, X, ChevronRight } from 'lucide-react';
import { Spin, Empty } from 'antd';
import { useLanguage } from '../../hooks/useLanguage.tsx';

export const PoojaListingPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<PoojaCategory[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedMode = searchParams.get('mode') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'recommended';

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [cats, pjs] = await Promise.all([
          api.getCategories(),
          api.getPoojas({
            categorySlug: selectedCategory || undefined,
            mode: selectedMode || undefined,
            search: searchQuery || undefined,
          }),
        ]);
        setCategories(cats);
        setPoojas(pjs);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [selectedCategory, selectedMode, searchQuery]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Client-side sort
  const sortedPoojas = [...poojas].sort((a, b) => {
    const minA = Math.min(...a.packages.map(p => p.price));
    const minB = Math.min(...b.packages.map(p => p.price));
    if (sortBy === 'price-low') return minA - minB;
    if (sortBy === 'price-high') return minB - minA;
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    return 0; // recommended
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Title & Description Header */}
      <div className="border-b border-[#E7E2DA] pb-6">
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900">
          {t('poojaListing.title')}
        </h1>
        <p className="text-stone-600 text-sm mt-1">
          {t('poojaListing.description')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('poojaListing.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#7A1C24] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#7A1C24] transition-colors text-stone-700"
            >
              <option value="">{t('poojaListing.allCategories')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedMode}
              onChange={(e) => updateFilter('mode', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#7A1C24] transition-colors text-stone-700"
            >
              <option value="">{t('poojaListing.allModes')}</option>
              <option value="HOME">{t('poojaListing.atHome')}</option>
              <option value="VENUE">{t('poojaListing.atVenue')}</option>
              <option value="ONLINE">{t('poojaListing.online')}</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#7A1C24] transition-colors text-stone-700"
            >
              <option value="recommended">{t('poojaListing.recommended')}</option>
              <option value="price-low">{t('poojaListing.priceLow')}</option>
              <option value="price-high">{t('poojaListing.priceHigh')}</option>
              <option value="duration">{t('poojaListing.durationSort')}</option>
            </select>
          </div>
        </div>

        {/* Active Filters tags & Clear button */}
        {(selectedCategory || selectedMode || searchQuery) && (
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">{t('poojaListing.activeFilters')}</span>
              {selectedCategory && (
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  {t('poojaListing.category')} {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedMode && (
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  {t('poojaListing.mode')} {selectedMode}
                  <button onClick={() => updateFilter('mode', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  {t('poojaListing.keyword')} "{searchQuery}"
                  <button onClick={() => updateFilter('search', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-[#7A1C24] hover:underline font-semibold text-xs"
            >
              {t('poojaListing.clearFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Grid of Pooja Cards */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : sortedPoojas.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-[#E7E2DA] text-center">
          <Empty description={t('poojaListing.noResults')} />
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-[#7A1C24] text-white text-xs font-semibold rounded-lg"
          >
            {t('poojaListing.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPoojas.map((pooja) => {
            const minPrice = Math.min(...pooja.packages.map(p => p.price));
            return (
              <div
                key={pooja.id}
                className="bg-white rounded-xl overflow-hidden border border-[#E7E2DA] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={pooja.imageUrl}
                      alt={pooja.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {t('poojaListing.minutes', { duration: pooja.durationMinutes })}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
                      {pooja.categoryName}
                    </div>

                    <h2 className="font-serif-title text-lg font-bold text-stone-900 leading-snug">
                      <Link to={`/poojas/${pooja.slug}`} className="hover:text-[#7A1C24] transition-colors">
                        {pooja.name}
                      </Link>
                    </h2>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {pooja.shortDescription}
                    </p>

                    <div className="pt-2 text-xs text-stone-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{t('poojaListing.minutes', { duration: pooja.durationMinutes })}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>{pooja.supportedModes.join(', ')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-medium">{t('poojaListing.startingAt')}</span>
                    <span className="text-lg font-bold text-[#7A1C24] font-mono">
                      ₹{minPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/poojas/${pooja.slug}`}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      {t('poojaListing.compare')}
                    </Link>
                    <Link
                      to={`/book?pooja=${pooja.slug}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-xs transition-colors"
                    >
                      {t('poojaListing.bookNow')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
