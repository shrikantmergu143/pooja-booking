import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { NotificationLog } from '../../types/index.ts';
import { Table, Tag, Button, message, Select } from 'antd';
import { Bell, RefreshCw, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

const { Option } = Select;

export const AdminNotificationsPage: React.FC = () => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const data = await api.getNotificationLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await api.retryNotification(id);
      message.success('Notification delivery re-attempted and marked as SENT.');
      await fetchLogs();
    } catch (err: any) {
      message.error(err.message || 'Retry failed.');
    } finally {
      setRetryingId(null);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      title: 'Recipient Devotee',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (email: string) => <span className="font-mono text-xs text-stone-900 font-semibold">{email}</span>,
    },
    {
      title: 'Event Type',
      dataIndex: 'notificationType',
      key: 'notificationType',
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: 'Subject & Snippet',
      key: 'subject',
      render: (_: any, record: NotificationLog) => (
        <div>
          <div className="font-bold text-xs text-stone-800">{record.subject}</div>
          <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{record.contentSnippet}</div>
        </div>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'bookingReference',
      key: 'bookingReference',
      render: (ref: string) => (
        <span className="font-mono text-xs text-[#7A1C24] font-semibold">{ref || '—'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: NotificationLog['status']) => (
        <Tag color={status === 'SENT' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Attempts',
      dataIndex: 'attemptCount',
      key: 'attemptCount',
      render: (count: number) => <span className="font-mono text-xs">{count}</span>,
    },
    {
      title: 'Dispatched At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="font-mono text-[11px] text-stone-500">
          {dayjs(date).format('DD MMM, hh:mm A')}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: NotificationLog) => (
        <Button
          size="small"
          loading={retryingId === record.id}
          onClick={() => handleRetry(record.id)}
          icon={<RefreshCw className="w-3 h-3" />}
          className="text-xs"
        >
          Retry
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">
            Email & Notification Audit Logs
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Outbox record tracking customer booking acknowledgements, appointment confirmations, and custom quotes.
          </p>
        </div>

        <Select value={statusFilter} onChange={setStatusFilter} className="w-40 text-xs">
          <Option value="ALL">All Dispatches</Option>
          <Option value="SENT">Delivered / Sent</Option>
          <Option value="FAILED">Failed Deliveries</Option>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <Table
          dataSource={filteredLogs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="text-xs overflow-x-auto"
        />
      </div>
    </div>
  );
};
