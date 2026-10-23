import React, { useEffect, useState } from 'react';
import { Button, Drawer, Input, Select, Spin, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { ContactMessage } from '../../types/index.ts';
import { api } from '../../services/api.ts';

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export const AdminContactMessagesPage: React.FC = () => {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [status, setStatus] = useState<ContactMessage['status']>('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      setItems(await api.getAdminContactMessages());
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const openMessage = (item: ContactMessage) => {
    setSelected(item);
    setStatus(item.status);
    setAdminNotes(item.adminNotes || '');
  };

  const saveMessage = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.updateContactMessage(selected.id, { status, adminNotes });
      message.success('Contact message updated.');
      setSelected(null);
      await loadMessages();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to update contact message.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-title text-2xl font-bold text-stone-900">Contact messages</h1>
        <p className="text-xs text-stone-500 mt-1">Review public enquiries and track their follow-up status.</p>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'Received', dataIndex: 'createdAt', render: (value: string) => dayjs(value).format('DD MMM YYYY, hh:mm A') },
            { title: 'Name', dataIndex: 'name' },
            { title: 'Contact', render: (_: unknown, item: ContactMessage) => <span>{item.email}{item.phone ? ` · ${item.phone}` : ''}</span> },
            { title: 'Subject', dataIndex: 'subject' },
            { title: 'Status', dataIndex: 'status', render: (value: ContactMessage['status']) => <Tag color={value === 'RESOLVED' ? 'green' : value === 'IN_PROGRESS' ? 'blue' : 'gold'}>{value.replace('_', ' ')}</Tag> },
            { title: 'Action', render: (_: unknown, item: ContactMessage) => <Button size="small" onClick={() => openMessage(item)}>View</Button> },
          ]}
        />
      </div>
      {loading && items.length === 0 && <Spin />}
      <Drawer
        title={selected?.subject}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={520}
      >
        {selected && (
          <div className="space-y-5">
            <div className="text-sm text-stone-500">
              <div>{selected.name} · {selected.email}</div>
              {selected.phone && <div>{selected.phone}</div>}
              <div>{dayjs(selected.createdAt).format('DD MMM YYYY, hh:mm A')}</div>
            </div>
            <div className="whitespace-pre-wrap rounded-lg bg-stone-50 border border-stone-200 p-4 text-sm text-stone-800">
              {selected.message}
            </div>
            <label className="block text-xs font-semibold">
              Status
              <Select className="w-full mt-1" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            </label>
            <label className="block text-xs font-semibold">
              Internal notes
              <Input.TextArea className="mt-1" rows={4} maxLength={2000} value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} />
            </label>
            <Button type="primary" loading={saving} onClick={saveMessage} className="bg-[#7A1C24]">Save updates</Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
