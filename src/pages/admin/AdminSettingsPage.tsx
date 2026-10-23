import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { AppSettings, Pandit } from '../../types/index.ts';
import { Button, Input, InputNumber, Select, Switch, message, Spin } from 'antd';
import { Settings, Save, ShieldCheck, Clock, User, Phone } from 'lucide-react';

const { Option } = Select;

export const AdminSettingsPage: React.FC = () => {
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
      message.success('Application operational settings updated successfully!');
    } catch (err: any) {
      message.error(err.message || 'Failed to update settings.');
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
          Global Application Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure business details, global Pandit defaults, service timezone, and advance scheduling rules.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
        {/* Business & Support Details */}
        <div className="space-y-4">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            Business & Devotee Helpline
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">Business Platform Name</label>
              <Input
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Helpline Phone Number</label>
              <Input
                value={settings.helplinePhone}
                onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Support Email</label>
              <Input
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Headquarter Ashram / Temple Address</label>
              <Input
                value={settings.serviceAddress}
                onChange={(e) => setSettings({ ...settings, serviceAddress: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Business City</label>
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
            Default Priest & Regional Settings
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">Global Default Priest (Fallback)</label>
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
                Assigned when neither package nor pooja specifies an explicit default Pandit.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Service Timezone</label>
              <Input value={settings.serviceTimeszone} disabled className="font-mono bg-stone-50" />
            </div>
          </div>
        </div>

        {/* Scheduling & Cancellation Rules */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <span className="font-bold text-stone-900 text-sm font-serif-title border-b border-stone-100 pb-2 block">
            Scheduling & Booking Window Rules
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">Min. Advance Booking (Hours)</label>
              <InputNumber
                min={1}
                max={72}
                value={settings.minAdvanceBookingHours}
                onChange={(v) => setSettings({ ...settings, minAdvanceBookingHours: v || 12 })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Max. Advance Booking (Days)</label>
              <InputNumber
                min={7}
                max={365}
                value={settings.maxAdvanceBookingDays}
                onChange={(v) => setSettings({ ...settings, maxAdvanceBookingDays: v || 60 })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Free Cancellation Window (Hours)</label>
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
            Save Configuration Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
