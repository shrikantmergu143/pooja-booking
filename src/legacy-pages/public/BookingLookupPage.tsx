import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Booking } from '../../types/index.ts';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  FileText,
  Phone,
} from 'lucide-react';
import { Input, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

export const BookingLookupPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';

  const [bookingRef, setBookingRef] = useState(prefillRef);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (prefillRef) {
      setBookingRef(prefillRef);
    }
  }, [prefillRef]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) {
      toaster.error(t('bookingLookup.referenceRequired'));
      return;
    }
    if (!phoneDigits.trim()) {
      toaster.error(t('bookingLookup.phoneRequired'));
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const found = await api.lookupBooking(bookingRef.trim(), phoneDigits.trim());
      setBooking(found);
    } catch (err: any) {
      setBooking(null);
      toaster.error(err instanceof Error ? err.message : t('bookingLookup.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <Tag color="green">{t('bookingLookup.confirmed')}</Tag>;
      case 'PENDING':
        return <Tag color="gold">{t('bookingLookup.pending')}</Tag>;
      case 'RESCHEDULED':
        return <Tag color="blue">{t('bookingLookup.rescheduled')}</Tag>;
      case 'COMPLETED':
        return <Tag color="purple">{t('bookingLookup.completed')}</Tag>;
      case 'CANCELLED':
        return <Tag color="red">{t('bookingLookup.cancelled')}</Tag>;
      case 'AWAITING_CUSTOM_QUOTE':
        return <Tag color="orange">{t('bookingLookup.awaitingQuote')}</Tag>;
      case 'QUOTE_SENT':
        return <Tag color="cyan">{t('bookingLookup.quoteSent')}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
          {t('bookingLookup.eyebrow')}
        </span>
        <h1 className="font-serif-title text-3xl font-bold text-stone-900">
          {t('bookingLookup.title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {t('bookingLookup.description')}
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2DA] shadow-xs">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t('bookingLookup.reference')}
              </label>
              <Input
                placeholder={t('bookingLookup.referencePlaceholder')}
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                size="large"
                className="font-mono text-sm uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                {t('bookingLookup.phoneDigits')}
              </label>
              <Input
                placeholder={t('bookingLookup.phonePlaceholder')}
                maxLength={4}
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value)}
                size="large"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? t('bookingLookup.verifying') : t('bookingLookup.search')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {booking && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block font-mono">
                {booking.bookingReference}
              </span>
              <h2 className="font-serif-title text-xl font-bold text-stone-900">
                {booking.poojaName}
              </h2>
            </div>
            <div>{getStatusBadge(booking.status)}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 p-3 bg-stone-50 rounded-lg">
              <span className="text-stone-400 font-semibold uppercase text-[10px]">{t('bookingLookup.muhurat')}</span>
              <div className="font-semibold text-stone-800 font-mono text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>{dayjs(booking.appointmentStartsAt).format('DD MMMM YYYY, hh:mm A')}</span>
              </div>
            </div>

            <div className="space-y-1 p-3 bg-stone-50 rounded-lg">
              <span className="text-stone-400 font-semibold uppercase text-[10px]">{t('bookingLookup.assignedPandit')}</span>
              <div className="font-semibold text-stone-800 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" />
                <span>{booking.assignedPanditName || t('bookingLookup.pendingAssignment')}</span>
              </div>
            </div>

            <div className="space-y-1 p-3 bg-stone-50 rounded-lg">
              <span className="text-stone-400 font-semibold uppercase text-[10px]">{t('bookingLookup.serviceMode')}</span>
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>
                  {booking.serviceMode}
                  {booking.serviceAddress && ` · ${booking.serviceAddress.city}`}
                </span>
              </div>
            </div>

            <div className="space-y-1 p-3 bg-stone-50 rounded-lg">
              <span className="text-stone-400 font-semibold uppercase text-[10px]">{t('bookingLookup.devoteeDetails')}</span>
              <div className="font-semibold text-stone-800">
                {booking.customer.fullName}
                {booking.customer.gotra && ` (${t('bookingLookup.gotra', { gotra: booking.customer.gotra })})`}
              </div>
            </div>
          </div>

          {/* Preparation / Next steps */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
            <span className="font-bold flex items-center gap-1.5 text-stone-900">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              {t('bookingLookup.protocol')}
            </span>
            <p>
              {t('bookingLookup.protocolDescription')}
            </p>
          </div>
        </div>
      )}

      {searched && !booking && !loading && (
        <div className="bg-white rounded-xl p-8 border border-stone-200 text-center text-xs text-stone-500">
          {t('bookingLookup.noRecords')} <Link to="/contact" className="text-[#7A1C24] underline">{t('bookingLookup.contactTeam')}</Link>.
        </div>
      )}
    </div>
  );
};
