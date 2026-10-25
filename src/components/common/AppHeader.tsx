import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, User, PhoneCall } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { api } from '../../services/api.ts';
import { hidePublicCeremonies } from '../../config/features.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.tsx';
import { SiteLogo } from './SiteLogo.tsx';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E2DA]">
      {/* Top micro-bar with helpline and sacred shloka */}
      <div className="bg-[#7A1C24] text-amber-100 text-xs py-1 px-4 sm:px-8 flex justify-between items-center">
        <div className="hidden sm:flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-serif-title tracking-wider">ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</span>
        </div>
        <div className="flex items-center gap-4 text-xs ml-auto">
          <LanguageSelector className="text-amber-100" />
          {settings.helplinePhone ? <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span>{t('header.poojaHelpline')}: {settings.helplinePhone}</span>
          </a> : <Link to="/contact" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span>{t('header.contactUs')}</span>
          </Link>}
          {!hidePublicCeremonies && (
            <>
              <span className="text-amber-300/40">|</span>
              <Link to="/track" className="hover:text-white transition-colors">
                {t('header.trackBooking')}
              </Link>
            </>
          )}
          <span className="text-amber-300/40">|</span>
          {isAuthenticated ? (
            <Link to="/admin/dashboard" className="text-amber-300 font-semibold hover:underline flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{t('header.admin')}: {user?.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="hover:text-white transition-colors flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{t('header.adminLogin')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 text-[#7A1C24]">
          <SiteLogo
            markClassName="h-10 w-10 rounded-lg border border-amber-500/20 bg-gradient-to-br from-[#7A1C24] to-[#9E2A2B] text-amber-300 shadow-sm transition-transform group-hover:scale-105"
            className="max-w-[15rem] sm:max-w-[20rem]"
          />
        </Link>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          {!hidePublicCeremonies && (
            <>
              <Link
                to="/poojas"
                className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
                  isActive('/poojas') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
                }`}
              >
                {t('header.allPoojas')}
              </Link>
              <Link
                to="/poojas?category=griha-pravesh-vastu"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                {t('header.grihaPravesh')}
              </Link>
              <Link
                to="/poojas?category=vedic-pujas-havans"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                {t('header.havansKathas')}
              </Link>
              <Link
                to="/poojas?category=rudrabhishek-shiva"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                {t('header.rudrabhishek')}
              </Link>
              <Link
                to="/track"
                className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
                  isActive('/track') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
                }`}
              >
                {t('header.checkStatus')}
              </Link>
            </>
          )}
          <Link
            to="/about-us"
            className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
              isActive('/about-us') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
            }`}
          >
            {t('header.aboutUs')}
          </Link>
          <Link
            to="/appointment"
            className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
              isActive('/appointment') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
            }`}
          >
            {t('header.bookAppointment')}
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        {!hidePublicCeremonies && (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5"
            >
              <span>{t('header.bookPooja')}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
