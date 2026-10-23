import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Spin, message } from 'antd';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { AppSettings } from '../../types/index.ts';

interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
}

export const ContactPage: React.FC = () => {
  const [form] = Form.useForm<ContactFormValues>();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    api.getPublicSettings()
      .then(setSettings)
      .catch((error: Error) => setSettingsError(error.message || 'Unable to load contact details.'))
      .finally(() => setLoadingSettings(false));
  }, []);

  const submit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      await api.createContactMessage(values);
      message.success('Your message has been sent. Our team will contact you soon.');
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to send your message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">We are here to help</span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-2">Contact Us</h1>
        <p className="text-sm text-stone-600 mt-3">
          Ask us about a pooja, your appointment, or anything you need to prepare for your ceremony.
        </p>
      </div>
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-semibold text-stone-900">Looking to book an appointment?</h2>
          <p className="text-sm text-stone-600 mt-1">Submit your details and preferred date and time.</p>
        </div>
        <Link to="/appointment" className="inline-flex w-fit rounded-lg bg-[#7A1C24] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5E141B]">
          Book appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
        <section className="bg-[#210D10] text-stone-200 rounded-2xl p-7 space-y-6">
          <h2 className="font-serif-title text-xl font-bold text-amber-100">
            {loadingSettings ? 'Contact details' : settings?.businessName || 'Contact details'}
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
                <p className="text-stone-400">Contact details have not been configured yet.</p>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif-title text-xl font-bold text-stone-900 mb-5">Send us a message</h2>
          <Form<ContactFormValues> form={form} layout="vertical" onFinish={submit}>
            <div aria-hidden="true" className="hidden">
              <Form.Item name="website">
                <Input tabIndex={-1} autoComplete="off" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Form.Item name="name" label="Your name" rules={[{ required: true, max: 150 }]}>
                <Input maxLength={150} />
              </Form.Item>
              <Form.Item name="email" label="Email address" rules={[{ required: true }, { type: 'email' }]}>
                <Input type="email" maxLength={255} />
              </Form.Item>
              <Form.Item name="phone" label="Mobile number (optional)">
                <Input type="tel" maxLength={30} />
              </Form.Item>
              <Form.Item name="subject" label="Subject" rules={[{ required: true, max: 180 }]}>
                <Input maxLength={180} />
              </Form.Item>
            </div>
            <Form.Item name="message" label="Message" rules={[{ required: true, max: 5000 }]}>
              <Input.TextArea rows={6} maxLength={5000} showCount />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#7A1C24]">
              Send message
            </Button>
          </Form>
        </section>
      </div>
    </div>
  );
};
