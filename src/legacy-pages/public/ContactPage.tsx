import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { AppSettings } from '../../types/index.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
}

export const ContactPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [form] = Form.useForm<ContactFormValues>();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    api.getPublicSettings()
      .then(setSettings)
      .catch((error: Error) => setSettingsError(error.message || t('contact.loadFailed')))
      .finally(() => setLoadingSettings(false));
  }, []);

  const submit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      await api.createContactMessage(values);
      toaster.success(t('contact.sent'));
      form.resetFields();
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('contact.sendFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">{t('contact.eyebrow')}</span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-2">{t('contact.title')}</h1>
        <p className="text-sm text-stone-600 mt-3">
          {t('contact.description')}
        </p>
      </div>
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-semibold text-stone-900">{t('contact.appointmentTitle')}</h2>
          <p className="text-sm text-stone-600 mt-1">{t('contact.appointmentDescription')}</p>
        </div>
        <Link to="/appointment" className="inline-flex w-fit rounded-lg bg-[#7A1C24] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5E141B]">
          {t('contact.bookAppointment')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
        <section className="bg-[#210D10] text-stone-200 rounded-2xl p-7 space-y-6">
          <h2 className="font-serif-title text-xl font-bold text-amber-100">
            {loadingSettings ? t('contact.details') : settings?.businessName || t('contact.details')}
          </h2>
          {settingsError && <p role="alert" className="text-sm text-amber-200">{settingsError}</p>}
          {loadingSettings ? (
            <Spin />
          ) : (
            <div className="space-y-5 text-sm">
              {settings?.helplinePhone && (
                <div className="flex gap-3 items-start">
                  <Phone className="w-4 h-4 text-amber-400 mt-0.5" />
                  <a className="hover:text-amber-200" href={`tel:${settings.helplinePhone.replace(/[^\d+]/g, '')}`}>
                    {settings.helplinePhone}
                  </a>
                </div>
              )}
              {settings?.supportEmail && (
                <div className="flex gap-3 items-start">
                  <Mail className="w-4 h-4 text-amber-400 mt-0.5" />
                  <a className="hover:text-amber-200" href={`mailto:${settings.supportEmail}`}>
                    {settings.supportEmail}
                  </a>
                </div>
              )}
              {(settings?.serviceAddress || settings?.serviceCity) && (
                <div className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>{[settings.serviceAddress, settings.serviceCity].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {!settings?.helplinePhone && !settings?.supportEmail && !settings?.serviceAddress && !settings?.serviceCity && (
                <p className="text-stone-400">{t('contact.notConfigured')}</p>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif-title text-xl font-bold text-stone-900 mb-5">{t('contact.sendTitle')}</h2>
          <Form<ContactFormValues> form={form} layout="vertical" onFinish={submit}>
            <div aria-hidden="true" className="hidden">
              <Form.Item name="website">
                <Input tabIndex={-1} autoComplete="off" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Form.Item name="name" label={t('contact.yourName')} rules={[{ required: true, max: 150 }]}>
                <Input maxLength={150} />
              </Form.Item>
              <Form.Item name="email" label={t('contact.email')} rules={[{ required: true }, { type: 'email' }]}>
                <Input type="email" maxLength={255} />
              </Form.Item>
              <Form.Item name="phone" label={t('contact.phone')}>
                <Input type="tel" maxLength={30} />
              </Form.Item>
              <Form.Item name="subject" label={t('contact.subject')} rules={[{ required: true, max: 180 }]}>
                <Input maxLength={180} />
              </Form.Item>
            </div>
            <Form.Item name="message" label={t('contact.message')} rules={[{ required: true, max: 5000 }]}>
              <Input.TextArea rows={6} maxLength={5000} showCount />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#7A1C24]">
              {t('contact.send')}
            </Button>
          </Form>
        </section>
      </div>
    </div>
  );
};
