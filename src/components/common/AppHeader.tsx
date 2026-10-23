import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, User, Search, PhoneCall } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { api } from '../../services/api.ts';
import { AppSettings } from '../../types/index.ts';
import { hidePublicCeremonyNavigation } from '../../config/features.ts';

export const AppHeader: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    api.getPublicSettings()
      .then(setSettings)
      .catch((error: Error) => console.error('Failed to load public contact details:', error));
  }, []);

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
          {settings?.helplinePhone ? <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span>Pooja Helpline: {settings.helplinePhone}</span>
          </a> : <Link to="/contact" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-amber-300" />
            <span>Contact Us</span>
          </Link>}
          <span className="text-amber-300/40">|</span>
          <Link to="/track" className="hover:text-white transition-colors">
            Track Booking
          </Link>
          <span className="text-amber-300/40">|</span>
          {isAuthenticated ? (
            <Link to="/admin/dashboard" className="text-amber-300 font-semibold hover:underline flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Admin: {user?.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="hover:text-white transition-colors flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7A1C24] to-[#9E2A2B] text-amber-300 flex items-center justify-center shadow-sm border border-amber-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-amber-400 text-amber-200" />
          </div>
          <div>
            <span className="font-serif-title text-xl font-bold tracking-tight text-[#7A1C24] block leading-none">
              {settings?.businessName || 'BookMyPooja'}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium">
              Vedic Ceremonies & Pandits
            </span>
          </div>
        </Link>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          {!hidePublicCeremonyNavigation && (
            <>
              <Link
                to="/poojas"
                className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
                  isActive('/poojas') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
                }`}
              >
                All Poojas
              </Link>
              <Link
                to="/poojas?category=griha-pravesh-vastu"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                Griha Pravesh
              </Link>
              <Link
                to="/poojas?category=vedic-pujas-havans"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                Havans & Kathas
              </Link>
              <Link
                to="/poojas?category=rudrabhishek-shiva"
                className="whitespace-nowrap transition-colors hover:text-[#7A1C24]"
              >
                Rudrabhishek
              </Link>
              <Link
                to="/track"
                className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
                  isActive('/track') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
                }`}
              >
                Check Status
              </Link>
            </>
          )}
          <Link
            to="/about-us"
            className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
              isActive('/about-us') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
            }`}
          >
            About Us
          </Link>
          <Link
            to="/appointment"
            className={`whitespace-nowrap transition-colors hover:text-[#7A1C24] ${
              isActive('/appointment') ? 'text-[#7A1C24] font-semibold border-b-2 border-[#7A1C24] pb-0.5' : ''
            }`}
          >
            Book Appointment
          </Link>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/book"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5"
          >
            <span>Book a Pooja</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
