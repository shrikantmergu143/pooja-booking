import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin, Table, Tag } from 'antd';
import { ArrowUpRight, CalendarDays, MessageSquare } from 'lucide-react';
import dayjs from 'dayjs';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';
import { api } from '../../services/api.ts';
import { Appointment, ContactMessage } from '../../types/index.ts';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const toaster = useToaster();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [allAppointments, allContactMessages] = await Promise.all([
          api.getAdminAppointments(),
          api.getAdminContactMessages(),
        ]);
        setAppointments(
          [...allAppointments].sort(
            (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
          ),
        );
        setContactMessages(
          [...allContactMessages].sort(
            (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
          ),
        );
      } catch (error) {
        toaster.error(error instanceof Error ? error.message : t('adminDashboard.loadFailed'));
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const appointmentColumns = [
    {
      title: t('adminDashboard.appointmentName'),
      key: 'name',
      render: (_: unknown, appointment: Appointment) => (
        <div>
          <div className="text-xs font-semibold text-stone-900">{appointment.name}</div>
          <div className="text-[10px] text-stone-500">{appointment.mobileNumber}</div>
          {appointment.email && (
            <div className="text-[10px] text-stone-500">{appointment.email}</div>
          )}
        </div>
      ),
    },
    {
      title: t('adminDashboard.appointmentDetails'),
      key: 'details',
      render: (_: unknown, appointment: Appointment) => (
        <div className="text-xs text-stone-700">
          <div>{t('adminDashboard.gotra')}: {appointment.gotra}</div>
          <div>{t('adminDashboard.rashi')}: {appointment.rashi}</div>
          <div>{t('adminDashboard.birthPlace')}: {appointment.place}</div>
        </div>
      ),
    },
    {
      title: t('adminDashboard.received'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-stone-700">{dayjs(date).format('DD MMM YYYY, hh:mm A')}</span>
      ),
    },
    {
      title: t('adminDashboard.action'),
      key: 'action',
      render: (_: unknown, appointment: Appointment) => (
        <Link
          to="/admin/appointments"
          className="text-xs font-semibold text-[#7A1C24] hover:underline"
          aria-label={t('adminDashboard.reviewAppointmentFor', { name: appointment.name })}
        >
          {t('adminDashboard.review')}
        </Link>
      ),
    },
  ];

  const contactMessageColumns = [
    {
      title: t('adminDashboard.contactName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, message: ContactMessage) => (
        <div>
          <div className="text-xs font-semibold text-stone-900">{name}</div>
          <div className="text-[10px] text-stone-500">{message.email}</div>
          {message.phone && <div className="text-[10px] text-stone-500">{message.phone}</div>}
        </div>
      ),
    },
    {
      title: t('adminDashboard.subject'),
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => <span className="text-xs font-medium text-stone-800">{subject}</span>,
    },
    {
      title: t('adminDashboard.message'),
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <div className="max-w-sm whitespace-pre-wrap text-xs text-stone-700 line-clamp-3">
          {message}
        </div>
      ),
    },
    {
      title: t('adminDashboard.received'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-stone-700">{dayjs(date).format('DD MMM YYYY, hh:mm A')}</span>
      ),
    },
    {
      title: t('adminDashboard.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: ContactMessage['status']) => {
        const color = status === 'RESOLVED' ? 'green' : status === 'IN_PROGRESS' ? 'blue' : 'gold';
        return <Tag color={color}>{t(`adminContactMessages.statuses.${status}`)}</Tag>;
      },
    },
    {
      title: t('adminDashboard.action'),
      key: 'action',
      render: () => (
        <Link to="/admin/contact-messages" className="text-xs font-semibold text-[#7A1C24] hover:underline">
          {t('adminDashboard.review')}
        </Link>
      ),
    },
  ];

  const openContactMessages = contactMessages.filter((message) => message.status !== 'RESOLVED').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">
            {t('adminDashboard.title')}
          </h1>
          <p className="mt-1 text-xs text-stone-500">{t('adminDashboard.description')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/appointments"
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-800"
          >
            {t('adminDashboard.reviewAppointments')}
          </Link>
          <Link
            to="/admin/contact-messages"
            className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-amber-800"
          >
            {t('adminDashboard.reviewContactMessages')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          to="/admin/appointments"
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div>
            <span className="block text-xs font-medium text-stone-500">
              {t('adminDashboard.appointmentRequests')}
            </span>
            <div className="mt-1 font-mono text-2xl font-bold text-blue-700">{appointments.length}</div>
            <span className="mt-1 block text-[11px] text-stone-400">
              {t('adminDashboard.allAppointmentRequests')}
            </span>
          </div>
          <CalendarDays className="h-8 w-8 text-blue-700" />
        </Link>
        <Link
          to="/admin/contact-messages"
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div>
            <span className="block text-xs font-medium text-stone-500">
              {t('adminDashboard.openContactMessages')}
            </span>
            <div className="mt-1 font-mono text-2xl font-bold text-amber-700">{openContactMessages}</div>
            <span className="mt-1 block text-[11px] text-stone-400">
              {t('adminDashboard.followUpRequired')}
            </span>
          </div>
          <MessageSquare className="h-8 w-8 text-amber-700" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-700" />
              <h2 className="font-serif-title text-base font-bold text-stone-900">
                {t('adminDashboard.recentAppointmentRequests')}
              </h2>
            </div>
            <Link
              to="/admin/appointments"
              className="flex items-center gap-1 text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              <span>{t('adminDashboard.viewAll', { count: appointments.length })}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Table
            dataSource={appointments.slice(0, 5)}
            columns={appointmentColumns}
            rowKey="id"
            pagination={false}
            size="small"
            locale={{ emptyText: t('adminDashboard.noAppointmentRequests') }}
            scroll={{ x: 560 }}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-700" />
              <h2 className="font-serif-title text-base font-bold text-stone-900">
                {t('adminDashboard.recentContactMessages')}
              </h2>
            </div>
            <Link
              to="/admin/contact-messages"
              className="flex items-center gap-1 text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              <span>{t('adminDashboard.viewAll', { count: contactMessages.length })}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Table
            dataSource={contactMessages.slice(0, 5)}
            columns={contactMessageColumns}
            rowKey="id"
            pagination={false}
            size="small"
            locale={{ emptyText: t('adminDashboard.noContactMessages') }}
            scroll={{ x: 720 }}
          />
        </section>
      </div>
    </div>
  );
};
