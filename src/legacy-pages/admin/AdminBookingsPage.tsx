import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Booking, BookingHistory, Pandit } from '../../types/index.ts';
import {
  Search,
  Filter,
  CalendarCheck,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  FileText,
  Eye,
  Plus,
  Pencil,
  Archive,
} from 'lucide-react';
import {
  Table,
  Tag,
  Drawer,
  Button,
  Modal,
  Input,
  Select,
  Timeline,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import { AdminBookingFormModal } from './AdminBookingFormModal.tsx';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const { TextArea } = Input;
const { Option } = Select;

export const AdminBookingsPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedParamId = searchParams.get('selectedId');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Booking Drawer State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Action Modals State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newRescheduleDate, setNewRescheduleDate] = useState(dayjs().add(2, 'day').format('YYYY-MM-DD'));
  const [newRescheduleTime, setNewRescheduleTime] = useState('09:00');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [newPanditId, setNewPanditId] = useState('');
  const [reassignNotes, setReassignNotes] = useState('');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newAdminNote, setNewAdminNote] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [bookingBeingEdited, setBookingBeingEdited] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const [allB, allP] = await Promise.all([
        api.getAdminBookings(),
        api.getAllPanditsAdmin(),
      ]);
      setBookings(allB);
      setPandits(allP);

      // Auto-open if selectedParamId present
      if (selectedParamId) {
        const found = allB.find((b) => b.id === selectedParamId);
        if (found) {
          openDrawer(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openDrawer = async (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
    setLoadingHistory(true);
    try {
      const { history } = await api.getBookingDetail(booking.id);
      setBookingHistory(history);
    } catch {
      setBookingHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const openCreateForm = () => {
    setBookingBeingEdited(null);
    setBookingFormOpen(true);
  };

  const openEditForm = (booking: Booking) => {
    setBookingBeingEdited(booking);
    setBookingFormOpen(true);
  };

  const handleBookingSaved = async (booking: Booking) => {
    setBookingFormOpen(false);
    setBookingBeingEdited(null);
    await fetchBookings();
    if (drawerOpen) {
      const refreshed = await api.getBookingDetail(booking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    }
  };

  const confirmArchiveBooking = (booking: Booking) => {
    Modal.confirm({
      title: t('adminBookings.archiveTitle', { reference: booking.bookingReference }),
      content: t('adminBookings.archiveDescription'),
      okText: t('adminBookings.archive'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.archiveAdminBooking(booking.id);
          toaster.success(t('adminBookings.archived'));
          closeDrawer();
          await fetchBookings();
        } catch (error) {
          toaster.error(error instanceof Error ? error.message : t('adminBookings.archiveFailed'));
          throw error;
        }
      },
    });
  };

  // --- Actions ---

  const handleConfirm = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      await api.confirmBooking(selectedBooking.id, 'Acharya Vidyadhar (Admin)');
      toaster.success(t('adminBookings.confirmed'));
      await fetchBookings();
      // refresh active
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.confirmFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking) return;
    const [h, m] = newRescheduleTime.split(':').map(Number);
    const newStarts = dayjs(newRescheduleDate).hour(h).minute(m).second(0).toISOString();

    setActionLoading(true);
    try {
      await api.rescheduleBooking(selectedBooking.id, newStarts, 'Admin', rescheduleNotes);
      toaster.success(t('adminBookings.rescheduled'));
      setRescheduleModalOpen(false);
      await fetchBookings();
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.rescheduleFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReassignSubmit = async () => {
    if (!selectedBooking || !newPanditId) {
      toaster.error(t('adminBookings.choosePriest'));
      return;
    }
    setActionLoading(true);
    try {
      await api.reassignPandit(selectedBooking.id, newPanditId, 'Admin', reassignNotes);
      toaster.success(t('adminBookings.reassigned'));
      setReassignModalOpen(false);
      await fetchBookings();
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.reassignFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!selectedBooking) return;
    if (!cancelReason.trim()) {
      toaster.error(t('adminBookings.cancellationReasonRequired'));
      return;
    }
    setActionLoading(true);
    try {
      await api.cancelBooking(selectedBooking.id, 'Admin', cancelReason);
      toaster.success(t('adminBookings.cancelled'));
      setCancelModalOpen(false);
      await fetchBookings();
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.cancelFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      await api.completeBooking(selectedBooking.id, 'Admin');
      toaster.success(t('adminBookings.completed'));
      await fetchBookings();
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.completeFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNoteSubmit = async () => {
    if (!selectedBooking || !newAdminNote.trim()) return;
    setActionLoading(true);
    try {
      await api.addBookingNote(selectedBooking.id, 'Admin', newAdminNote);
      toaster.success(t('adminBookings.noteAdded'));
      setNoteModalOpen(false);
      setNewAdminNote('');
      const refreshed = await api.getBookingDetail(selectedBooking.id);
      setSelectedBooking(refreshed.booking);
      setBookingHistory(refreshed.history);
    } catch (err: any) {
      toaster.error(err.message || t('adminBookings.noteFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.bookingReference.toLowerCase().includes(q) ||
        b.poojaName.toLowerCase().includes(q) ||
        b.customer.fullName.toLowerCase().includes(q) ||
        b.customer.phone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: Booking['status']) => {
    let color = 'default';
    if (status === 'CONFIRMED') color = 'green';
    if (status === 'PENDING') color = 'gold';
    if (status === 'AWAITING_CUSTOM_QUOTE') color = 'orange';
    if (status === 'QUOTE_SENT') color = 'cyan';
    if (status === 'RESCHEDULED') color = 'blue';
    if (status === 'COMPLETED') color = 'purple';
    if (status === 'CANCELLED') color = 'red';
    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    {
      title: t('adminBookings.reference'),
      dataIndex: 'bookingReference',
      key: 'bookingReference',
      render: (ref: string, record: Booking) => (
        <button
          onClick={() => openDrawer(record)}
          className="font-mono font-bold text-xs text-[#7A1C24] hover:underline cursor-pointer text-left"
        >
          {ref}
        </button>
      ),
    },
    {
      title: t('adminBookings.ceremonyPackage'),
      key: 'pooja',
      render: (_: any, record: Booking) => (
        <div>
          <div className="font-semibold text-xs text-stone-900">{record.poojaName}</div>
          <div className="text-[10px] text-stone-500">{record.packageName || record.bookingType}</div>
        </div>
      ),
    },
    {
      title: t('adminBookings.devotee'),
      key: 'customer',
      render: (_: any, record: Booking) => (
        <div>
          <div className="text-xs font-semibold text-stone-800">{record.customer.fullName}</div>
          <div className="text-[10px] text-stone-500 font-mono">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: t('adminBookings.scheduledMuhurat'),
      dataIndex: 'appointmentStartsAt',
      key: 'appointmentStartsAt',
      render: (date: string) => (
        <span className="font-mono text-xs text-stone-700">
          {dayjs(date).format('DD MMM YYYY, hh:mm A')}
        </span>
      ),
    },
    {
      title: t('adminBookings.assignedPriest'),
      dataIndex: 'assignedPanditName',
      key: 'assignedPanditName',
      render: (name: string) => (
        <span className="text-xs text-stone-700">
          {name || <span className="text-amber-700 font-medium italic">{t('adminBookings.unassigned')}</span>}
        </span>
      ),
    },
    {
      title: t('adminBookings.mode'),
      dataIndex: 'serviceMode',
      key: 'serviceMode',
      render: (mode: string) => <span className="text-[11px] font-semibold text-stone-600">{mode}</span>,
    },
    {
      title: t('adminBookings.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Booking['status']) => getStatusBadge(status),
    },
    {
      title: t('adminBookings.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className="font-mono font-bold text-xs text-stone-900">
          {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
        </span>
      ),
    },
    {
      title: t('adminBookings.actions'),
      key: 'actions',
      render: (_: any, record: Booking) => (
        <div className="flex gap-1">
          <Button
            size="small"
            onClick={() => openDrawer(record)}
            icon={<Eye className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            {t('adminBookings.details')}
          </Button>
          <Button
            size="small"
            onClick={() => openEditForm(record)}
            icon={<Pencil className="w-3.5 h-3.5" />}
            aria-label={t('adminBookings.editReference', { reference: record.bookingReference })}
          />
          <Button
            size="small"
            danger
            onClick={() => confirmArchiveBooking(record)}
            icon={<Archive className="w-3.5 h-3.5" />}
            aria-label={t('adminBookings.archiveReference', { reference: record.bookingReference })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">
            {t('adminBookings.title')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('adminBookings.description')}
          </p>
        </div>
        <Button
          type="primary"
          onClick={openCreateForm}
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#7A1C24]"
        >
          {t('adminBookings.create')}
        </Button>
      </div>

      {/* Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t('adminBookings.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#7A1C24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-48 text-xs"
            size="middle"
          >
            <Option value="ALL">{t('adminBookings.allStatuses', { count: bookings.length })}</Option>
            <Option value="PENDING">{t('adminBookings.pending')}</Option>
            <Option value="CONFIRMED">{t('adminBookings.confirmedStatus')}</Option>
            <Option value="AWAITING_CUSTOM_QUOTE">{t('adminBookings.awaitingQuote')}</Option>
            <Option value="QUOTE_SENT">{t('adminBookings.quoteSent')}</Option>
            <Option value="RESCHEDULED">{t('adminBookings.rescheduledStatus')}</Option>
            <Option value="COMPLETED">{t('adminBookings.completedStatus')}</Option>
            <Option value="CANCELLED">{t('adminBookings.cancelledStatus')}</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="text-xs overflow-x-auto"
        />
      </div>

      {/* Detailed Management Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="font-serif-title text-base font-bold text-stone-900">
              {t('adminBookings.detailsFor', { reference: selectedBooking?.bookingReference || '' })}
            </span>
            {selectedBooking && getStatusBadge(selectedBooking.status)}
          </div>
        }
        placement="right"
        width={680}
        onClose={closeDrawer}
        open={drawerOpen}
      >
        {selectedBooking && (
          <div className="space-y-6 text-xs text-stone-800">
            {/* Quick Action Buttons Bar */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap gap-2">
              <Button
                size="small"
                onClick={() => openEditForm(selectedBooking)}
                icon={<Pencil className="w-3.5 h-3.5" />}
              >
                {t('adminBookings.editDetails')}
              </Button>
              <Button
                size="small"
                danger
                onClick={() => confirmArchiveBooking(selectedBooking)}
                icon={<Archive className="w-3.5 h-3.5" />}
              >
                {t('adminBookings.archive')}
              </Button>
              {['PENDING', 'RESCHEDULED'].includes(selectedBooking.status) && (
                <Button
                  type="primary"
                  size="small"
                  onClick={handleConfirm}
                  loading={actionLoading}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  className="bg-emerald-700 hover:bg-emerald-800 border-none"
                >
                  {t('adminBookings.confirmAppointment')}
                </Button>
              )}

              {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
                <>
                  <Button
                    size="small"
                    onClick={() => setRescheduleModalOpen(true)}
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    {t('adminBookings.reschedule')}
                  </Button>

                  <Button
                    size="small"
                    onClick={() => {
                      setNewPanditId(selectedBooking.assignedPanditId || '');
                      setReassignModalOpen(true);
                    }}
                    icon={<User className="w-3.5 h-3.5" />}
                  >
                    {t('adminBookings.reassignPriest')}
                  </Button>

                  <Button
                    size="small"
                    onClick={() => setCancelModalOpen(true)}
                    danger
                    icon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    {t('adminBookings.cancel')}
                  </Button>
                </>
              )}

              {selectedBooking.status === 'CONFIRMED' && (
                <Button
                  size="small"
                  onClick={handleComplete}
                  className="bg-purple-700 text-white hover:bg-purple-800 border-none"
                >
                  {t('adminBookings.markCompleted')}
                </Button>
              )}

              <Button
                size="small"
                onClick={() => setNoteModalOpen(true)}
                icon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                {t('adminBookings.addNote')}
              </Button>
            </div>

            {/* Devotee Info */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wide block">
                Devotee Particulars
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-400 block">Name:</span>
                  <span className="font-semibold">{selectedBooking.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Phone:</span>
                  <span className="font-mono font-semibold">{selectedBooking.customer.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Email:</span>
                  <span className="font-semibold">{selectedBooking.customer.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Preferred Language:</span>
                  <span className="font-semibold">{selectedBooking.preferredLanguage}</span>
                </div>
                {selectedBooking.customer.gotra && (
                  <div>
                    <span className="text-stone-400 block">Gotra:</span>
                    <span className="font-semibold">{selectedBooking.customer.gotra}</span>
                  </div>
                )}
                {selectedBooking.customer.rashi && (
                  <div>
                    <span className="text-stone-400 block">Rashi:</span>
                    <span className="font-semibold">{selectedBooking.customer.rashi}</span>
                  </div>
                )}
                {selectedBooking.customer.dateOfBirth && (
                  <div>
                    <span className="text-stone-400 block">Date of Birth:</span>
                    <span className="font-semibold">{selectedBooking.customer.dateOfBirth}</span>
                  </div>
                )}
                {selectedBooking.customer.birthPlace && (
                  <div>
                    <span className="text-stone-400 block">Place of Birth:</span>
                    <span className="font-semibold">{selectedBooking.customer.birthPlace}</span>
                  </div>
                )}
                {selectedBooking.customer.sankalpNames && selectedBooking.customer.sankalpNames.length > 0 && (
                  <div>
                    <span className="text-stone-400 block">Sankalp Family Names:</span>
                    <span className="font-semibold">{selectedBooking.customer.sankalpNames.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Schedule & Venue */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wide block">
                Appointment & Venue
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-400 block">Muhurat Window:</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {dayjs(selectedBooking.appointmentStartsAt).format('DD MMM YYYY, hh:mm A')} -{' '}
                    {dayjs(selectedBooking.appointmentEndsAt).format('hh:mm A')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Service Mode:</span>
                  <span className="font-semibold">{selectedBooking.serviceMode}</span>
                </div>
                {selectedBooking.serviceAddress && (
                  <div className="col-span-2">
                    <span className="text-stone-400 block">Address:</span>
                    <span className="font-semibold">
                      {selectedBooking.serviceAddress.addressLine1},{' '}
                      {selectedBooking.serviceAddress.addressLine2 && `${selectedBooking.serviceAddress.addressLine2}, `}
                      {selectedBooking.serviceAddress.city} - {selectedBooking.serviceAddress.postalCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Commercial Snapshot */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wide block">
                Commercial Snapshot & Package
              </span>
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>{selectedBooking.poojaName}</span>
                  <span className="font-mono font-bold text-sm text-[#7A1C24]">
                    ₹{selectedBooking.price.toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedBooking.packageSnapshot && (
                  <div className="text-[11px] text-stone-500 space-y-1 pt-1">
                    <div>Tier: {selectedBooking.packageSnapshot.name}</div>
                    <div>Priest Count: {selectedBooking.packageSnapshot.panditCount} Pandit(s)</div>
                    <div>Samagri: {selectedBooking.packageSnapshot.includesSamagri ? 'Included' : 'Devotee prepares'}</div>
                  </div>
                )}
                {selectedBooking.selectedAddons.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-stone-500 font-semibold block mb-1">Add-ons:</span>
                    {selectedBooking.selectedAddons.map((ad, i) => (
                      <div key={i} className="flex justify-between text-stone-600">
                        <span>+ {ad.name}</span>
                        <span className="font-mono">₹{ad.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wide block">
                Notes & Instructions
              </span>
              {selectedBooking.customerNotes && (
                <div>
                  <span className="text-stone-400 block text-[11px]">Devotee Note:</span>
                  <p className="bg-stone-50 p-2 rounded text-stone-700 italic">{selectedBooking.customerNotes}</p>
                </div>
              )}
              {selectedBooking.adminNotes && (
                <div>
                  <span className="text-stone-400 block text-[11px]">Internal Admin Log:</span>
                  <pre className="bg-amber-50/60 p-2 rounded text-stone-700 whitespace-pre-wrap font-sans text-xs">
                    {selectedBooking.adminNotes}
                  </pre>
                </div>
              )}
            </div>

            {/* Chronological Audit Trail */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wide block">
                Chronological History Trail
              </span>
              {loadingHistory ? (
                <div className="py-4 text-center"><Spin size="small" /></div>
              ) : bookingHistory.length === 0 ? (
                <div className="text-stone-400">No events logged.</div>
              ) : (
                <Timeline
                  className="text-xs pt-2"
                  items={bookingHistory.map((h) => ({
                    color: h.newStatus === 'CONFIRMED' ? 'green' : h.newStatus === 'CANCELLED' ? 'red' : 'blue',
                    children: (
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">{h.eventType}</span>
                          <span className="font-mono text-[10px] text-stone-400">
                            {dayjs(h.createdAt).format('DD MMM, hh:mm A')}
                          </span>
                        </div>
                        <div className="text-stone-500 text-[11px]">By: {h.changedBy}</div>
                        {h.notes && <div className="text-stone-700 italic text-[11px]">{h.notes}</div>}
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          </div>
        )}
      </Drawer>

      <AdminBookingFormModal
        open={bookingFormOpen}
        booking={bookingBeingEdited}
        onClose={() => setBookingFormOpen(false)}
        onSaved={handleBookingSaved}
      />

      {/* Reschedule Modal */}
      <Modal
        title={t('adminBookings.rescheduleTitle')}
        open={rescheduleModalOpen}
        onOk={handleRescheduleSubmit}
        onCancel={() => setRescheduleModalOpen(false)}
        confirmLoading={actionLoading}
        okText={t('adminBookings.confirmReschedule')}
      >
        <div className="space-y-4 py-2 text-xs">
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.newDate')}</label>
            <input
              type="date"
              value={newRescheduleDate}
              onChange={(e) => setNewRescheduleDate(e.target.value)}
              className="w-full p-2 border rounded font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.newStartTime')}</label>
            <Select value={newRescheduleTime} onChange={setNewRescheduleTime} className="w-full">
              <Option value="07:00">07:00 AM</Option>
              <Option value="08:30">08:30 AM</Option>
              <Option value="09:00">09:00 AM</Option>
              <Option value="10:00">10:00 AM</Option>
              <Option value="11:30">11:30 AM</Option>
              <Option value="14:00">02:00 PM</Option>
              <Option value="16:00">04:00 PM</Option>
              <Option value="18:00">06:00 PM</Option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.reasonNotes')}</label>
            <Input
              value={rescheduleNotes}
              onChange={(e) => setRescheduleNotes(e.target.value)}
              placeholder={t('adminBookings.reschedulePlaceholder')}
            />
          </div>
        </div>
      </Modal>

      {/* Reassign Pandit Modal */}
      <Modal
        title={t('adminBookings.reassignTitle')}
        open={reassignModalOpen}
        onOk={handleReassignSubmit}
        onCancel={() => setReassignModalOpen(false)}
        confirmLoading={actionLoading}
        okText={t('adminBookings.reassignPriest')}
      >
        <div className="space-y-4 py-2 text-xs">
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.selectPriest')}</label>
            <Select value={newPanditId} onChange={setNewPanditId} className="w-full">
              {pandits.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullName} ({p.experienceYears} yrs exp · {p.languages.join(', ')})
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.reassignmentReason')}</label>
            <Input
              value={reassignNotes}
              onChange={(e) => setReassignNotes(e.target.value)}
              placeholder={t('adminBookings.reassignmentPlaceholder')}
            />
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title={t('adminBookings.cancelTitle')}
        open={cancelModalOpen}
        onOk={handleCancelSubmit}
        onCancel={() => setCancelModalOpen(false)}
        confirmLoading={actionLoading}
        okText={t('adminBookings.confirmCancellation')}
        okButtonProps={{ danger: true }}
      >
        <div className="space-y-4 py-2 text-xs">
          <p className="text-stone-600">
            {t('adminBookings.cancelDescription')}
          </p>
          <div>
            <label className="text-xs font-bold block mb-1">{t('adminBookings.cancellationReason')}</label>
            <TextArea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t('adminBookings.cancellationPlaceholder')}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Add Internal Note Modal */}
      <Modal
        title={t('adminBookings.noteTitle')}
        open={noteModalOpen}
        onOk={handleAddNoteSubmit}
        onCancel={() => setNoteModalOpen(false)}
        confirmLoading={actionLoading}
        okText={t('adminBookings.saveNote')}
      >
        <div className="py-2 text-xs">
          <TextArea
            rows={4}
            value={newAdminNote}
            onChange={(e) => setNewAdminNote(e.target.value)}
            placeholder="Type confidential note about samagri preparation, gate pass requirements, or devotee preferences..."
          />
        </div>
      </Modal>
    </div>
  );
};
