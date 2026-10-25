import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { AppSettings, Pandit } from '../../types/index.ts';
import { Button, Input, InputNumber, Select, Switch, Spin } from 'antd';
import { Settings, Save, ShieldCheck, Clock, User, Phone } from 'lucide-react';
import { hidePublicCeremonies } from '../../config/features.ts';
import { useSiteSettings } from '../../hooks/useSiteSettings.tsx';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const { Option } = Select;

export const AdminSettingsPage: React.FC = () => {
  const toaster = useToaster();
  const { refreshSettings } = useSiteSettings();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [st, pndts] = await Promise.all([
          api.getPublicSettings(),
          api.getAllPanditsAdmin(),
        ]);
        setSettings(st);
        setPandits(pndts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
      await refreshSettings();
      toaster.success(t('adminSettings.saved'));
    } catch (err: any) {
      toaster.error(err.message || t('adminSettings.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif-title text-2xl font-bold text-stone-900">
          {t('adminSettings.title')}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {t('adminSettings.description')}
        </p>
      </div>

      <section
        aria-labelledby="public-ceremonies-setting"
        className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="public-ceremonies-setting" className="font-semibold text-stone-900">
          {t('adminSettings.visibilityTitle')}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-stone-600">
            {hidePublicCeremonies
              ? t('adminSettings.hidden')
              : t('adminSettings.visible')}
            {' '}{t('adminSettings.visibilityHelp')}
            {' '}NEXT_PUBLIC_HIDE_PUBLIC_CEREMONIES
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${hidePublicCeremonies ? 'bg-stone-200 text-stone-700' : 'bg-emerald-100 text-emerald-800'}`}>
          {hidePublicCeremonies ? t('adminSettings.hiddenBadge') : t('adminSettings.visibleBadge')}
        </span>
      </section>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            {t('adminSettings.identity')}
          </span>
          <p className="text-xs leading-5 text-stone-500">
            {t('adminSettings.identityDescription')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="website-name" className="text-xs font-bold block mb-1">{t('adminSettings.websiteName')}</label>
              <Input
                id="website-name"
                maxLength={120}
                value={settings.websiteName || ''}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="website-subtitle" className="text-xs font-bold block mb-1">{t('adminSettings.websiteSubtitle')}</label>
              <Input
                id="website-subtitle"
                maxLength={160}
                value={settings.websiteSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, websiteSubtitle: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="website-logo" className="text-xs font-bold block mb-1">{t('adminSettings.websiteLogo')}</label>
              <Input
                id="website-logo"
                type="url"
                maxLength={2048}
                placeholder="https://example.com/logo.png"
                value={settings.logoUrl || ''}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
              <span className="mt-1 block text-[11px] text-stone-400">{t('adminSettings.logoHelp')}</span>
            </div>
            <div>
              <label htmlFor="website-domain" className="text-xs font-bold block mb-1">{t('adminSettings.websiteDomain')}</label>
              <Input
                id="website-domain"
                type="url"
                maxLength={2048}
                placeholder="https://example.com"
                value={settings.websiteDomain || ''}
                onChange={(e) => setSettings({ ...settings, websiteDomain: e.target.value })}
              />
              <span className="mt-1 block text-[11px] text-stone-400">{t('adminSettings.domainHelp')}</span>
            </div>
          </div>
        </div>

        {/* Business & Support Details */}
        <div className="space-y-4">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            {t('adminSettings.businessSection')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.businessName')}</label>
              <Input
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.phone')}</label>
              <Input
                value={settings.helplinePhone}
                onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.email')}</label>
              <Input
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.address')}</label>
              <Input
                value={settings.serviceAddress}
                onChange={(e) => setSettings({ ...settings, serviceAddress: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.city')}</label>
              <Input
                value={settings.serviceCity}
                onChange={(e) => setSettings({ ...settings, serviceCity: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Global Default Pandit & Timezone */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            {t('adminSettings.regionalSection')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.defaultPandit')}</label>
              <Select
                value={settings.globalDefaultPanditId || ''}
                onChange={(val) => setSettings({ ...settings, globalDefaultPanditId: val || undefined })}
                className="w-full"
              >
                {pandits.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.fullName} ({p.experienceYears} yrs exp)
                  </Option>
                ))}
              </Select>
              <span className="text-[11px] text-stone-400 mt-1 block">
                {t('adminSettings.defaultPanditHelp')}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.timezone')}</label>
              <Input value={settings.serviceTimeszone} disabled className="font-mono bg-stone-50" />
            </div>
          </div>
        </div>

        {/* Scheduling & Cancellation Rules */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            {t('adminSettings.schedulingSection')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.minAdvance')}</label>
              <InputNumber
                min={1}
                max={72}
                value={settings.minAdvanceBookingHours}
                onChange={(v) => setSettings({ ...settings, minAdvanceBookingHours: v || 12 })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.maxAdvance')}</label>
              <InputNumber
                min={7}
                max={365}
                value={settings.maxAdvanceBookingDays}
                onChange={(v) => setSettings({ ...settings, maxAdvanceBookingDays: v || 60 })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">{t('adminSettings.cancellation')}</label>
              <InputNumber
                min={0}
                max={72}
                value={settings.cancellationAllowedBeforeHours}
                onChange={(v) => setSettings({ ...settings, cancellationAllowedBeforeHours: v || 24 })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-100">
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving}
            icon={<Save className="w-4 h-4" />}
            className="bg-[#7A1C24] font-semibold text-xs"
          >
            {t('adminSettings.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};
