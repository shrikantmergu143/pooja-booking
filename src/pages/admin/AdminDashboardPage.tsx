import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { DashboardStats, Booking } from '../../types/index.ts';
import {
  CalendarCheck,
  Clock,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Spin, Table, Tag, Button } from 'antd';
import dayjs from 'dayjs';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashStats, allBookings] = await Promise.all([
          api.getDashboardStats(),
          api.getAdminBookings(),
        ]);
        setStats(dashStats);
        setRecentBookings(allBookings.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      desc: 'All-time reservations',
      icon: CalendarCheck,
      color: 'text-stone-800',
      bg: 'bg-stone-50',
    },
    {
      title: 'Upcoming Ceremonies',
      value: stats.upcomingAppointments,
      desc: 'Confirmed & scheduled',
      icon: Clock,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/60',
    },
    {
      title: 'Pending Confirmation',
      value: stats.pendingConfirmations,
      desc: 'Awaiting admin approval',
      icon: AlertCircle,
      color: 'text-amber-700',
      bg: 'bg-amber-50/60',
      alert: stats.pendingConfirmations > 0,
    },
    {
      title: 'Custom Quote Requests',
      value: stats.awaitingCustomQuotes,
      desc: 'Custom rituals to quote',
      icon: FileText,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50/60',
      alert: stats.awaitingCustomQuotes > 0,
    },
    {
      title: 'Confirmed Revenue',
      value: `₹${stats.confirmedRevenue.toLocaleString('en-IN')}`,
      desc: 'All dakshina & samagri',
      icon: TrendingUp,
      color: 'text-[#7A1C24]',
      bg: 'bg-rose-50/60',
    },
    {
      title: 'Active Priests',
      value: stats.activePanditsCount,
      desc: 'Sanskrit verified pandits',
      icon: Users,
      color: 'text-stone-700',
      bg: 'bg-stone-50',
    },
  ];

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'bookingReference',
      key: 'bookingReference',
      render: (ref: string) => <span className="font-mono font-bold text-xs text-[#7A1C24]">{ref}</span>,
    },
    {
      title: 'Ceremony',
      dataIndex: 'poojaName',
      key: 'poojaName',
      render: (name: string, record: Booking) => (
        <div>
          <div className="font-semibold text-xs text-stone-900">{name}</div>
          {record.packageName && (
            <div className="text-[10px] text-stone-500">{record.packageName}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Devotee',
      key: 'customer',
      render: (_: any, record: Booking) => (
        <div>
          <div className="text-xs font-medium text-stone-800">{record.customer.fullName}</div>
          <div className="text-[10px] text-stone-500">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: 'Muhurat Date',
      dataIndex: 'appointmentStartsAt',
      key: 'appointmentStartsAt',
      render: (date: string) => (
        <span className="font-mono text-xs text-stone-700">
          {dayjs(date).format('DD MMM, hh:mm A')}
        </span>
      ),
    },
    {
      title: 'Assigned Priest',
      dataIndex: 'assignedPanditName',
      key: 'assignedPanditName',
      render: (name: string) => (
        <span className="text-xs text-stone-700">{name || <span className="text-amber-700 italic">Unassigned</span>}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Booking['status']) => {
        let color = 'default';
        if (status === 'CONFIRMED') color = 'green';
        if (status === 'PENDING') color = 'gold';
        if (status === 'AWAITING_CUSTOM_QUOTE') color = 'orange';
        if (status === 'COMPLETED') color = 'purple';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Booking) => (
        <Link
          to={`/admin/bookings?selectedId=${record.id}`}
          className="text-xs font-semibold text-[#7A1C24] hover:underline"
        >
          Manage
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">
            Operations & Ceremonial Console
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time appointment schedule, pandit allocations, and custom ritual quotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Review All Bookings
          </Link>
          <Link
            to="/admin/quotes"
            className="px-4 py-2 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Open Quote Builder
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl border border-stone-200 bg-white shadow-xs flex items-center justify-between ${
                c.alert ? 'ring-2 ring-amber-400/50' : ''
              }`}
            >
              <div>
                <span className="text-xs font-medium text-stone-500 block">{c.title}</span>
                <div className={`text-2xl font-bold font-mono mt-1 ${c.color}`}>
                  {c.value}
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">{c.desc}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
                <Icon className={`w-6 h-6 ${c.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#7A1C24]" />
            <h2 className="font-serif-title text-base font-bold text-stone-900">
              Active Booking Pipeline
            </h2>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-[#7A1C24] hover:underline flex items-center gap-1"
          >
            <span>View All ({stats.totalBookings})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Table
          dataSource={recentBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          className="overflow-x-auto text-xs"
        />
      </div>
    </div>
  );
};
