import React, { useState } from 'react';
import { Button, Form, Input, Result } from 'antd';
import { CalendarDays, Clock3, UserRound } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '../../services/api.ts';
import { Appointment } from '../../types/index.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

type AppointmentFormValues = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

export const AppointmentBookingPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [form] = Form.useForm<AppointmentFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (values: AppointmentFormValues) => {
    setSubmitting(true);
    try {
      await api.createAppointment({
        ...values,
        email: values.email?.trim() || undefined,
        mobileNumber: values.mobileNumber.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('appointment.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Result
          status="success"
          title={t('appointment.received')}
          subTitle={t('appointment.thankYou')}
          extra={
            <Button type="primary" className="bg-[#7A1C24]" onClick={() => {
              form.resetFields();
              setSubmitted(false);
            }}>
              {t('appointment.another')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">{t('appointment.eyebrow')}</span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-2">{t('appointment.title')}</h1>
        <p className="text-sm text-stone-600 mt-3">
          {t('appointment.description')}
        </p>
      </div>
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <Form<AppointmentFormValues> form={form} layout="vertical" onFinish={submit}>
          <h2 className="flex items-center gap-2 font-semibold text-stone-900 mb-4">
            <UserRound className="w-4 h-4 text-[#7A1C24]" /> {t('appointment.personalDetails')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="name" label={t('appointment.fullName')} rules={[{ required: true }, { max: 150 }]}>
              <Input autoComplete="name" maxLength={150} />
            </Form.Item>
            <Form.Item name="mobileNumber" label={t('appointment.mobile')} rules={[
              { required: true, message: t('appointment.mobileRequired') },
              { pattern: /^\+?[0-9\s()-]{7,30}$/, message: t('appointment.mobileInvalid') },
            ]}>
              <Input type="tel" autoComplete="tel" maxLength={30} />
            </Form.Item>
            <Form.Item name="email" label={t('appointment.emailOptional')} rules={[{ type: 'email', message: t('appointment.emailInvalid') }, { max: 255 }]}>
              <Input type="email" autoComplete="email" maxLength={255} />
            </Form.Item>
            <Form.Item name="gotra" label={t('appointment.gotra')} rules={[{ required: true }, { max: 150 }]}>
              <Input maxLength={150} />
            </Form.Item>
            <Form.Item name="rashi" label={t('appointment.rashi')} rules={[{ required: true }, { max: 100 }]}>
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item name="dateOfBirth" label={t('appointment.birthDate')} rules={[
              { required: true, message: t('appointment.birthDateRequired') },
              {
                validator: (_, value: string | undefined) =>
                  !value || !dayjs(value).isAfter(dayjs(), 'day')
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('appointment.birthDateFuture'))),
              },
            ]}>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} />
            </Form.Item>
            <Form.Item name="place" label={t('appointment.birthPlace')} rules={[{ required: true }, { max: 180 }]}>
              <Input maxLength={180} />
            </Form.Item>
          </div>

          {/* <h2 className="flex items-center gap-2 font-semibold text-stone-900 mb-4 mt-2">
            <CalendarDays className="w-4 h-4 text-[#7A1C24]" /> {t('appointment.preferredTime')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="appointmentDate" label={t('appointment.date')} rules={[{ required: true, message: t('appointment.dateRequired') }]}>
              <Input type="date" min={dayjs().format('YYYY-MM-DD')} />
            </Form.Item>
            <Form.Item name="appointmentTime" label={t('appointment.time')} rules={[{ required: true, message: t('appointment.timeRequired') }]}>
              <Input type="time" />
            </Form.Item>
          </div> */}
          {/* <div className="flex items-start gap-2 text-xs text-stone-500 mb-5">
            <Clock3 className="w-4 h-4 shrink-0" />
            {t('appointment.dateNote')}
          </div> */}
          <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#7A1C24]">
            {t('appointment.submit')}
          </Button>
        </Form>
      </section>
    </div>
  );
};
