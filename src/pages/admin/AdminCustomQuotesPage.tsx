import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Booking, CustomQuote, Pandit } from '../../types/index.ts';
import { Table, Button, Modal, Input, InputNumber, Select, Tag, message } from 'antd';
import { FileText, Send, CheckCircle2, Clock, User, Sparkles } from 'lucide-react';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export const AdminCustomQuotesPage: React.FC = () => {
  const [customBookings, setCustomBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote Drafting Modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState<Booking | null>(null);
  const [proposedAmount, setProposedAmount] = useState<number>(15000);
  const [quoteDetails, setQuoteDetails] = useState('');
  const [quoteExclusions, setQuoteExclusions] = useState('Lunch arrangement for priests by Yajman');
  const [assignedPanditId, setAssignedPanditId] = useState('');

  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const [allB, allQ, allP] = await Promise.all([
        api.getAdminBookings(),
        api.getCustomQuotes(),
        api.getAllPanditsAdmin(),
      ]);
      const customOnes = allB.filter(
        (b) => b.bookingType === 'CUSTOM' || ['AWAITING_CUSTOM_QUOTE', 'QUOTE_SENT'].includes(b.status)
      );
      setCustomBookings(customOnes);
      setQuotes(allQ);
      setPandits(allP);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDraftModal = (booking: Booking) => {
    setTargetBooking(booking);
    setProposedAmount(15000);
    setQuoteDetails(
      `Vedic Ceremony: ${booking.customPoojaName || booking.poojaName}\nIncludes: 2 Gurukul Priests, 36-item Samagri, Havan Kund setup, and Purnahuti.`
    );
    setAssignedPanditId(pandits[0]?.id || '');
    setQuoteModalOpen(true);
  };

  const handleSendQuote = async () => {
    if (!targetBooking) return;
    if (!proposedAmount || proposedAmount <= 0) {
      message.error('Please specify a valid proposed amount in INR.');
      return;
    }
    setActionLoading(true);
    try {
      await api.createCustomQuote({
        bookingId: targetBooking.id,
        proposedAmount,
        quoteDetails,
        exclusions: quoteExclusions,
        assignedPanditId: assignedPanditId || undefined,
      });
      message.success('Quote saved. Customer notification is queued for delivery.');
      setQuoteModalOpen(false);
      setTargetBooking(null);
      await loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to submit quote.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setActionLoading(true);
    try {
      await api.acceptCustomQuote(quoteId);
      message.success('Quote accepted! Booking has been automatically confirmed.');
      await loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to accept quote.');
    } finally {
      setActionLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: 'Reference',
      dataIndex: 'bookingReference',
      key: 'bookingReference',
      render: (ref: string) => <span className="font-mono font-bold text-xs text-[#7A1C24]">{ref}</span>,
    },
    {
      title: 'Ceremony Inquiry',
      key: 'inquiry',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-bold text-xs text-stone-900">{record.customPoojaName || record.poojaName}</div>
          <div className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
            "{record.customRequirements || 'Special ritual inquiry'}"
          </div>
        </div>
      ),
    },
    {
      title: 'Devotee',
      key: 'devotee',
      render: (_: any, record: Booking) => (
        <div>
          <div className="text-xs font-semibold">{record.customer.fullName}</div>
          <div className="text-[10px] text-stone-500 font-mono">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'QUOTE_SENT') color = 'cyan';
        if (status === 'CONFIRMED') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Quoted Price',
      key: 'price',
      render: (_: any, record: Booking) => (
        <span className="font-mono font-bold text-xs text-stone-900">
          {record.price > 0 ? `₹${record.price.toLocaleString('en-IN')}` : <span className="text-stone-400 italic">Unquoted</span>}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Booking) => (
        <Button
          size="small"
          type="primary"
          onClick={() => openDraftModal(record)}
          icon={<Send className="w-3.5 h-3.5" />}
          className="bg-[#7A1C24] text-xs"
        >
          {record.status === 'QUOTE_SENT' ? 'Revise Quote' : 'Create Quote'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-title text-2xl font-bold text-stone-900">
          Custom Ritual Quotations
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review customer inquiries for multi-day Havans, Bhagwat Kathas, and custom temple ceremonies.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#7A1C24]" />
          <h2 className="font-serif-title text-base font-bold text-stone-900">
            Pending Custom Ritual Requests
          </h2>
        </div>

        <Table
          dataSource={customBookings}
          columns={bookingColumns}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="text-xs overflow-x-auto"
        />
      </div>

      {/* Quote Drafting Modal */}
      <Modal
        title={`Draft Official Quotation for ${targetBooking?.bookingReference}`}
        open={quoteModalOpen}
        onOk={handleSendQuote}
        onCancel={() => setQuoteModalOpen(false)}
        confirmLoading={actionLoading}
        width={620}
        okText="Send Quote to Devotee"
      >
        {targetBooking && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border text-stone-700">
              <span className="font-semibold block mb-0.5">Customer Brief:</span>
              <p className="italic text-stone-600">{targetBooking.customRequirements}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Proposed Amount (₹ INR) *</label>
                <InputNumber
                  min={1000}
                  step={500}
                  value={proposedAmount}
                  onChange={(v) => setProposedAmount(v || 0)}
                  className="w-full font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Assign Lead Priest</label>
                <Select value={assignedPanditId} onChange={setAssignedPanditId} className="w-full">
                  {pandits.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.fullName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Quote Inclusions & Ceremony Breakdown</label>
              <TextArea
                rows={4}
                value={quoteDetails}
                onChange={(e) => setQuoteDetails(e.target.value)}
                placeholder="List samagri, havan wood, co-priests, duration..."
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Exclusions (if any)</label>
              <Input
                value={quoteExclusions}
                onChange={(e) => setQuoteExclusions(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
