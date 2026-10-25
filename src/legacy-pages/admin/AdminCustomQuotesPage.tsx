import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Booking, CustomQuote, Pandit } from '../../types/index.ts';
import { Table, Button, Modal, Input, InputNumber, Select, Tag } from 'antd';
import { FileText, Send, CheckCircle2, Clock, User, Sparkles } from 'lucide-react';
import dayjs from 'dayjs';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const { TextArea } = Input;
const { Option } = Select;

export const AdminCustomQuotesPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
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
      toaster.error(t('adminQuotes.invalidAmount'));
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
      toaster.success(t('adminQuotes.sent'));
      setQuoteModalOpen(false);
      setTargetBooking(null);
      await loadData();
    } catch (err: any) {
      toaster.error(err.message || t('adminQuotes.submitFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setActionLoading(true);
    try {
      await api.acceptCustomQuote(quoteId);
      toaster.success(t('adminQuotes.accepted'));
      await loadData();
    } catch (err: any) {
      toaster.error(err.message || t('adminQuotes.acceptFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: t('adminQuotes.reference'),
      dataIndex: 'bookingReference',
      key: 'bookingReference',
      render: (ref: string) => <span className="font-mono font-bold text-xs text-[#7A1C24]">{ref}</span>,
    },
    {
      title: t('adminQuotes.inquiry'),
      key: 'inquiry',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-bold text-xs text-stone-900">{record.customPoojaName || record.poojaName}</div>
          <div className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
            "{record.customRequirements || t('adminQuotes.specialInquiry')}"
          </div>
        </div>
      ),
    },
    {
      title: t('adminQuotes.devotee'),
      key: 'devotee',
      render: (_: any, record: Booking) => (
        <div>
          <div className="text-xs font-semibold">{record.customer.fullName}</div>
          <div className="text-[10px] text-stone-500 font-mono">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: t('adminQuotes.status'),
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
      title: t('adminQuotes.quotedPrice'),
      key: 'price',
      render: (_: any, record: Booking) => (
        <span className="font-mono font-bold text-xs text-stone-900">
          {record.price > 0 ? `₹${record.price.toLocaleString('en-IN')}` : <span className="text-stone-400 italic">{t('adminQuotes.unquoted')}</span>}
        </span>
      ),
    },
    {
      title: t('adminQuotes.actions'),
      key: 'actions',
      render: (_: any, record: Booking) => (
        <Button
          size="small"
          type="primary"
          onClick={() => openDraftModal(record)}
          icon={<Send className="w-3.5 h-3.5" />}
          className="bg-[#7A1C24] text-xs"
        >
          {record.status === 'QUOTE_SENT' ? t('adminQuotes.revise') : t('adminQuotes.create')}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-title text-2xl font-bold text-stone-900">
          {t('adminQuotes.title')}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {t('adminQuotes.description')}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#7A1C24]" />
          <h2 className="font-serif-title text-base font-bold text-stone-900">
            {t('adminQuotes.pending')}
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
        title={t('adminQuotes.draftTitle', { reference: targetBooking?.bookingReference || '' })}
        open={quoteModalOpen}
        onOk={handleSendQuote}
        onCancel={() => setQuoteModalOpen(false)}
        confirmLoading={actionLoading}
        width={620}
        okText={t('adminQuotes.send')}
      >
        {targetBooking && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border text-stone-700">
              <span className="font-semibold block mb-0.5">{t('adminQuotes.customerBrief')}</span>
              <p className="italic text-stone-600">{targetBooking.customRequirements}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminQuotes.amount')}</label>
                <InputNumber
                  min={1000}
                  step={500}
                  value={proposedAmount}
                  onChange={(v) => setProposedAmount(v || 0)}
                  className="w-full font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminQuotes.leadPriest')}</label>
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
              <label className="text-xs font-bold block mb-1">{t('adminQuotes.inclusions')}</label>
              <TextArea
                rows={4}
                value={quoteDetails}
                onChange={(e) => setQuoteDetails(e.target.value)}
                placeholder={t('adminQuotes.inclusionsPlaceholder')}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminQuotes.exclusions')}</label>
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
