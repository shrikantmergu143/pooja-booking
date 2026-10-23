import React, { useState } from 'react';
import { Button, Form, Input, Result, message } from 'antd';
import { CalendarDays, Clock3, UserRound } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '../../services/api.ts';
import { Appointment } from '../../types/index.ts';

type AppointmentFormValues = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

export const AppointmentBookingPage: React.FC = () => {
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
      message.error(error instanceof Error ? error.message : 'Unable to book your appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Result
          status="success"
          title="Appointment request received"
          subTitle="Thank you. Our team will contact you to confirm your appointment."
          extra={
            <Button type="primary" className="bg-[#7A1C24]" onClick={() => {
              form.resetFields();
              setSubmitted(false);
            }}>
              Book another appointment
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1C24]">Personal appointment</span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-2">Book an Appointment</h1>
        <p className="text-sm text-stone-600 mt-3">
          Share your details and preferred date and time. Our team will contact you to confirm.
        </p>
      </div>
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <Form<AppointmentFormValues> form={form} layout="vertical" onFinish={submit}>
          <h2 className="flex items-center gap-2 font-semibold text-stone-900 mb-4">
            <UserRound className="w-4 h-4 text-[#7A1C24]" /> Personal details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="name" label="Full name" rules={[{ required: true }, { max: 150 }]}>
              <Input autoComplete="name" maxLength={150} />
            </Form.Item>
            <Form.Item name="mobileNumber" label="Mobile number" rules={[
              { required: true, message: 'Please enter your mobile number.' },
              { pattern: /^\+?[0-9\s()-]{7,30}$/, message: 'Enter a valid mobile number.' },
            ]}>
              <Input type="tel" autoComplete="tel" maxLength={30} />
            </Form.Item>
            <Form.Item name="email" label="Email address (optional)" rules={[{ type: 'email', message: 'Enter a valid email address.' }, { max: 255 }]}>
              <Input type="email" autoComplete="email" maxLength={255} />
            </Form.Item>
            <Form.Item name="gotra" label="Gotra" rules={[{ required: true }, { max: 150 }]}>
              <Input maxLength={150} />
            </Form.Item>
            <Form.Item name="rashi" label="Rashi" rules={[{ required: true }, { max: 100 }]}>
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date of birth" rules={[
              { required: true, message: 'Please enter your date of birth.' },
              {
                validator: (_, value: string | undefined) =>
                  !value || !dayjs(value).isAfter(dayjs(), 'day')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Date of birth cannot be in the future.')),
              },
            ]}>
              <Input type="date" max={dayjs().format('YYYY-MM-DD')} />
            </Form.Item>
            <Form.Item name="place" label="Place of birth" rules={[{ required: true }, { max: 180 }]}>
              <Input maxLength={180} />
            </Form.Item>
          </div>

          <h2 className="flex items-center gap-2 font-semibold text-stone-900 mb-4 mt-2">
            <CalendarDays className="w-4 h-4 text-[#7A1C24]" /> Preferred appointment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="appointmentDate" label="Appointment date" rules={[{ required: true, message: 'Please choose an appointment date.' }]}>
              <Input type="date" min={dayjs().format('YYYY-MM-DD')} />
            </Form.Item>
            <Form.Item name="appointmentTime" label="Appointment time" rules={[{ required: true, message: 'Please choose an appointment time.' }]}>
              <Input type="time" />
            </Form.Item>
          </div>
          <div className="flex items-start gap-2 text-xs text-stone-500 mb-5">
            <Clock3 className="w-4 h-4 shrink-0" />
            The selected date and time are a preference and will be confirmed by our team.
          </div>
          <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#7A1C24]">
            Submit appointment request
          </Button>
        </Form>
      </section>
    </div>
  );
};
