import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';
import { hidePublicCeremonies } from '../../config/features.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.tsx';
import { SiteLogo } from './SiteLogo.tsx';

export const AppFooter: React.FC = () => {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  let websiteHost = '';
  try {
    websiteHost = new URL(
      settings.websiteDomain?.startsWith('http')
        ? settings.websiteDomain
        : `https://${settings.websiteDomain}`,
    ).host;
  } catch (error) {
    console.error('Unable to display the configured website domain.', error);
  }

  return (
    <footer className="bg-[#210D10] text-stone-300 border-t border-amber-900/30 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <SiteLogo
              className="text-amber-100"
              markClassName="h-8 w-8 rounded bg-amber-500/20 text-amber-400"
            />
            <p className="text-xs text-stone-400 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="pt-2 text-xs text-amber-200/80 font-serif-title italic">
              {t('footer.dharma')}
            </div>
          </div>

          {!hidePublicCeremonies && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
                {t('footer.popularPoojas')}
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link to="/poojas/ganesh-puja-havan" className="hover:text-amber-300 transition-colors">{t('footer.ganeshPuja')}</Link></li>
                <li><Link to="/poojas/griha-pravesh-vastu-shanti" className="hover:text-amber-300 transition-colors">{t('footer.grihaPravesh')}</Link></li>
                <li><Link to="/poojas/satyanarayan-puja-katha" className="hover:text-amber-300 transition-colors">{t('footer.satyanarayan')}</Link></li>
                <li><Link to="/poojas/maha-rudrabhishek-puja" className="hover:text-amber-300 transition-colors">{t('footer.mahaRudrabhishek')}</Link></li>
                <li><Link to="/book?type=custom" className="hover:text-amber-300 transition-colors">{t('footer.customRitual')}</Link></li>
              </ul>
            </div>
          )}

          {/* Devotee Assurance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
              {t('footer.vedicPromise')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('footer.certifiedPandits')}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('footer.samagri')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('footer.muhurat')}</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-200 font-serif-title uppercase tracking-wider">
              {t('footer.coordination')}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {settings.helplinePhone ? (
                  <a href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`} className="hover:text-amber-300">
                    {settings.helplinePhone}
                  </a>
                ) : <Link to="/contact" className="hover:text-amber-300">{t('footer.contactTeam')}</Link>}
              </div>
                {settings.supportEmail && <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <a href={`mailto:${settings.supportEmail}`} className="hover:text-amber-300">{settings.supportEmail}</a>
                </div>}
                {(settings.serviceAddress || settings.serviceCity) && <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{[settings.serviceAddress, settings.serviceCity].filter(Boolean).join(', ')}</span>
                </div>}
                {websiteHost && (
                  <div className="pt-1 text-xs text-stone-500">
                    <a href={`https://${websiteHost}`} className="hover:text-amber-300">{websiteHost}</a>
                  </div>
                )}
              </div>
              <div className="pt-3">
                <Link to="/contact" className="inline-block text-[11px] text-amber-300/80 hover:text-amber-200 underline mr-4">
                  {t('header.contactUs')}
                </Link>
                <Link
                to="/admin/login"
                className="inline-block text-[11px] text-amber-300/80 hover:text-amber-200 underline"
              >
                {t('footer.portalLogin')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Vishnusudarshana Dharmik Sanskar Kendra. {t('footer.allRightsReserved')}</p>
          <div className="flex items-center gap-6">
            {!hidePublicCeremonies && (
              <>
                <Link to="/poojas" className="hover:text-stone-300">{t('footer.ceremonies')}</Link>
                <span>·</span>
                <Link to="/track" className="hover:text-stone-300">{t('footer.bookingStatus')}</Link>
                <span>·</span>
              </>
            )}
            <Link to="/about-us" className="hover:text-stone-300">{t('header.aboutUs')}</Link>
            <span>·</span>
            <Link to="/privacy-policy" className="hover:text-stone-300">{t('footer.privacyPolicy')}</Link>
            <span>·</span>
            <Link to="/terms-and-conditions" className="hover:text-stone-300">{t('footer.terms')}</Link>
            <span>·</span>
            <Link to="/admin/dashboard" className="hover:text-stone-300">{t('header.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
