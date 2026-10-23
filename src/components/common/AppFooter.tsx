import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';
import { AppSettings } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { hidePublicCeremonyNavigation } from '../../config/features.ts';

export const AppFooter: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    api.getPublicSettings()
      .then(setSettings)
      .catch((error: Error) => console.error('Failed to load public contact details:', error));
  }, []);

  return (
    <footer className="bg-[#210D10] text-stone-300 border-t border-amber-900/30 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="font-serif-title text-xl font-bold text-amber-100">
                {settings?.businessName || 'BookMyPooja'}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              India's authentic online Vedic ceremonial portal connecting devotees with verified, Gurukul-trained priests for hassle-free home, temple, and virtual rituals.
            </p>
            <div className="pt-2 text-xs text-amber-200/80 font-serif-title italic">
              "धर्मो रक्षति रक्षितः" — Dharma protects those who protect it.
            </div>
          </div>

          {!hidePublicCeremonyNavigation && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
                Popular Poojas
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link to="/poojas/ganesh-puja-havan" className="hover:text-amber-300 transition-colors">Ganesh Puja & Havan</Link></li>
                <li><Link to="/poojas/griha-pravesh-vastu-shanti" className="hover:text-amber-300 transition-colors">Griha Pravesh & Vastu</Link></li>
                <li><Link to="/poojas/satyanarayan-puja-katha" className="hover:text-amber-300 transition-colors">Satyanarayan Katha</Link></li>
                <li><Link to="/poojas/maha-rudrabhishek-puja" className="hover:text-amber-300 transition-colors">Maha Rudrabhishek</Link></li>
                <li><Link to="/book?type=custom" className="hover:text-amber-300 transition-colors">Request Custom Vedic Ritual</Link></li>
              </ul>
            </div>
          )}

          {/* Devotee Assurance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
              Our Vedic Promise
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>100% Certified Gurukul & Sanskrit University Pandits</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Pure Desi Ghee & Consecrated 36-item Samagri</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Exact Shubh Muhurat & Punctual Arrival Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
              Temple Coordination
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {settings?.helplinePhone ? (
                  <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="hover:text-amber-300">
                    {settings.helplinePhone}
                  </a>
                ) : <Link to="/contact" className="hover:text-amber-300">Contact our team</Link>}
              </div>
                {settings?.supportEmail && <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <a href={`mailto:${settings.supportEmail}`} className="hover:text-amber-300">{settings.supportEmail}</a>
                </div>}
                {(settings?.serviceAddress || settings?.serviceCity) && <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{[settings.serviceAddress, settings.serviceCity].filter(Boolean).join(', ')}</span>
                </div>}
              </div>
              <div className="pt-3">
                <Link to="/contact" className="inline-block text-[11px] text-amber-300/80 hover:text-amber-200 underline mr-4">
                  Contact Us
                </Link>
                <Link
                to="/admin/login"
                className="inline-block text-[11px] text-amber-300/80 hover:text-amber-200 underline"
              >
                Priest & Administrative Portal Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} BookMyPooja Online. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            {!hidePublicCeremonyNavigation && (
              <>
                <Link to="/poojas" className="hover:text-stone-300">Ceremonies</Link>
                <span>·</span>
                <Link to="/track" className="hover:text-stone-300">Booking Status</Link>
                <span>·</span>
              </>
            )}
            <Link to="/about-us" className="hover:text-stone-300">About Us</Link>
            <span>·</span>
            <Link to="/privacy-policy" className="hover:text-stone-300">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms-and-conditions" className="hover:text-stone-300">Terms</Link>
            <span>·</span>
            <Link to="/admin/dashboard" className="hover:text-stone-300">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
