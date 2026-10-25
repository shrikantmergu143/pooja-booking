import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Pandit, Pooja } from '../../types/index.ts';
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  Switch,
  Tag,
  Popconfirm,
  Badge,
} from 'antd';
import {
  Users,
  Calendar,
  Plus,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const { TextArea } = Input;
const { Option } = Select;

const DEFAULT_LANGUAGES = [
  'Hindi',
  'Sanskrit',
  'English',
  'Telugu',
  'Tamil',
  'Kannada',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Odia',
];

const DEFAULT_SPECIALIZATIONS = [
  'Vedic Pujas',
  'Havans & Homas',
  'Griha Pravesh & Vastu',
  'Sri Satyanarayan Katha',
  'Maha Rudrabhishek',
  'Navagraha Shanti',
  'Vivah Samskara',
  'Namakaran Sanskar',
  'Pitru Tarpan & Shradh',
];

const DEFAULT_SERVICE_AREAS = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Online / Virtual (Global)',
];

const DEFAULT_SCHEDULE = [
  { id: 'sch-0', panditId: '', dayOfWeek: 0, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-1', panditId: '', dayOfWeek: 1, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-2', panditId: '', dayOfWeek: 2, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-3', panditId: '', dayOfWeek: 3, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-4', panditId: '', dayOfWeek: 4, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-5', panditId: '', dayOfWeek: 5, startTime: '07:00', endTime: '19:00', isActive: true },
  { id: 'sch-6', panditId: '', dayOfWeek: 6, startTime: '07:00', endTime: '19:00', isActive: true },
];


export const AdminPanditsPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Pandit for Schedule or Leaves
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState<Pandit | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<any[]>([]);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveStart, setLeaveStart] = useState(dayjs().add(5, 'day').format('YYYY-MM-DD'));
  const [leaveEnd, setLeaveEnd] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));
  const [leaveReason, setLeaveReason] = useState('');

  // Edit / Create Pandit Modal
  const [panditModalOpen, setPanditModalOpen] = useState(false);
  const [editingPandit, setEditingPandit] = useState<Partial<Pandit> | null>(null);

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [pndts, pjs] = await Promise.all([
        api.getAllPanditsAdmin(),
        api.getPoojas(),
      ]);
      setPandits(pndts);
      setPoojas(pjs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPandit({
      fullName: '',
      phone: '',
      email: '',
      experienceYears: 10,
      languages: ['Hindi', 'Sanskrit'],
      specializations: ['Vedic Pujas', 'Havans & Homas'],
      serviceAreas: ['Mumbai', 'Online / Virtual (Global)'],
      profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      biography: '',
      adminNotes: '',
      isActive: true,
      weeklySchedule: DEFAULT_SCHEDULE,
      blockedDates: [],
    });
    setPanditModalOpen(true);
  };

  const handleOpenEditModal = (pandit: Pandit) => {
    setEditingPandit({ ...pandit });
    setPanditModalOpen(true);
  };

  const handleSavePandit = async () => {
    if (!editingPandit?.fullName?.trim()) {
      toaster.error(t('adminPandits.nameRequired'));
      return;
    }
    if (!editingPandit?.phone?.trim()) {
      toaster.error(t('adminPandits.phoneRequired'));
      return;
    }

    setSaving(true);
    try {
      await api.upsertPandit(editingPandit);
      toaster.success(editingPandit.id ? t('adminPandits.updated') : t('adminPandits.created'));
      setPanditModalOpen(false);
      setEditingPandit(null);
      await loadData();
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePandit = async (panditId: string) => {
    try {
      await api.deletePandit(panditId);
      toaster.success(t('adminPandits.deleted'));
      await loadData();
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.deleteFailed'));
    }
  };

  const handleToggleActive = async (pandit: Pandit, newActiveState: boolean) => {
    try {
      await api.updatePandit(pandit.id, { isActive: newActiveState });
      toaster.success(t('adminPandits.toggled', {
        name: pandit.fullName,
        status: newActiveState ? t('adminPandits.active') : t('adminPandits.inactive'),
      }));
      setPandits((prev) =>
        prev.map((p) => (p.id === pandit.id ? { ...p, isActive: newActiveState } : p))
      );
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.statusFailed'));
    }
  };

  const handleOpenScheduleModal = (pandit: Pandit) => {
    setSelectedPandit(pandit);
    // Initialize or clone schedule
    const current = pandit.weeklySchedule && pandit.weeklySchedule.length === 7
      ? JSON.parse(JSON.stringify(pandit.weeklySchedule))
      : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
    setEditingSchedule(current);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedPandit) return;
    setSaving(true);
    try {
      await api.updatePanditSchedule(selectedPandit.id, editingSchedule);
      toaster.success(t('adminPandits.scheduleSaved'));
      setScheduleModalOpen(false);
      await loadData();
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.scheduleFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!selectedPandit) return;
    if (!leaveReason.trim()) {
      toaster.error(t('adminPandits.leaveReasonRequired'));
      return;
    }
    setSaving(true);
    try {
      await api.addPanditBlockedDate(
        selectedPandit.id,
        new Date(leaveStart).toISOString(),
        new Date(leaveEnd).toISOString(),
        leaveReason
      );
      toaster.success(t('adminPandits.leaveAdded'));
      setLeaveReason('');
      await loadData();
      const updated = (await api.getAllPanditsAdmin()).find((p) => p.id === selectedPandit.id);
      setSelectedPandit(updated || null);
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.leaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBlockedDate = async (blockId: string) => {
    if (!selectedPandit) return;
    try {
      await api.removePanditBlockedDate(selectedPandit.id, blockId);
      toaster.success(t('adminPandits.blockRemoved'));
      await loadData();
      const updated = (await api.getAllPanditsAdmin()).find((p) => p.id === selectedPandit.id);
      setSelectedPandit(updated || null);
    } catch (err: any) {
      toaster.error(err.message || t('adminPandits.blockRemoveFailed'));
    }
  };

  const columns = [
    {
      title: t('adminPandits.priestDetails'),
      key: 'pandit',
      render: (_: any, record: Pandit) => (
        <div className="flex items-center gap-3">
          <img
            src={record.profileImage}
            alt={record.fullName}
            className="w-11 h-11 rounded-full object-cover border border-amber-400/50 shadow-xs"
          />
          <div>
            <div className="font-bold text-xs text-stone-900">{record.fullName}</div>
            <div className="text-[11px] text-stone-500 font-mono flex items-center gap-2 mt-0.5">
              <span>{record.phone}</span>
              {record.email && <span>· {record.email}</span>}
            </div>
            {record.specializations && record.specializations.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {record.specializations.slice(0, 2).map((s, idx) => (
                  <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                    {s}
                  </span>
                ))}
                {record.specializations.length > 2 && (
                  <span className="text-[10px] text-stone-400">{t('adminPandits.more', { count: record.specializations.length - 2 })}</span>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('adminPandits.experience'),
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      render: (exp: number) => <span className="font-mono text-xs font-semibold">{t('adminPandits.years', { count: exp })}</span>,
    },
    {
      title: t('adminPandits.languages'),
      dataIndex: 'languages',
      key: 'languages',
      render: (langs: string[]) => (
        <span className="text-xs text-stone-700">
          {langs && langs.length > 0 ? langs.join(', ') : t('adminPandits.hindi')}
        </span>
      ),
    },
    {
      title: t('adminPandits.serviceAreas'),
      dataIndex: 'serviceAreas',
      key: 'serviceAreas',
      render: (areas: string[]) => (
        <span className="text-[11px] text-stone-500">
          {areas && areas.length > 0 ? areas.join(', ') : t('adminPandits.allAreas')}
        </span>
      ),
    },
    {
      title: t('adminPandits.leaveBlocked'),
      key: 'blockedDates',
      render: (_: any, record: Pandit) => (
        <Button
          size="small"
          onClick={() => {
            setSelectedPandit(record);
            setLeaveModalOpen(true);
          }}
          className="text-xs"
        >
          {t('adminPandits.leavePeriods', { count: record.blockedDates ? record.blockedDates.length : 0 })}
        </Button>
      ),
    },
    {
      title: t('adminPandits.status'),
      key: 'isActive',
      render: (_: any, record: Pandit) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={record.isActive}
            size="small"
            onChange={(checked) => handleToggleActive(record, checked)}
          />
          <Tag color={record.isActive ? 'green' : 'default'} className="font-mono text-[10px] m-0">
            {record.isActive ? t('adminPandits.active') : t('adminPandits.inactive')}
          </Tag>
        </div>
      ),
    },
    {
      title: t('adminPandits.actions'),
      key: 'actions',
      render: (_: any, record: Pandit) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="small"
            onClick={() => handleOpenEditModal(record)}
            icon={<Edit className="w-3 h-3" />}
          >
            {t('adminPandits.edit')}
          </Button>
          <Button
            size="small"
            onClick={() => handleOpenScheduleModal(record)}
            icon={<Clock className="w-3 h-3" />}
          >
            {t('adminPandits.hours')}
          </Button>
          <Popconfirm
            title={t('adminPandits.deleteProfile')}
            description={t('adminPandits.deleteConfirm', { name: record.fullName })}
            onConfirm={() => handleDeletePandit(record.id)}
            okText={t('adminPandits.yesDelete')}
            cancelText={t('adminPandits.cancel')}
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              icon={<Trash2 className="w-3 h-3" />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">
            {t('adminPandits.title')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('adminPandits.description')}
          </p>
        </div>

        <Button
          type="primary"
          onClick={handleOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#7A1C24] hover:bg-[#63161c]"
        >
          {t('adminPandits.addPriest')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
        <Table
          dataSource={pandits}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="text-xs overflow-x-auto"
        />
      </div>

      {/* Pandit Profile Add / Edit Modal */}
      <Modal
        title={editingPandit?.id
          ? t('adminPandits.editTitle', { name: editingPandit.fullName || '' })
          : t('adminPandits.addTitle')}
        open={panditModalOpen}
        onOk={handleSavePandit}
        onCancel={() => setPanditModalOpen(false)}
        confirmLoading={saving}
        width={700}
        okText={editingPandit?.id ? t('adminPandits.updatePriest') : t('adminPandits.createPriest')}
        okButtonProps={{ className: 'bg-[#7A1C24]' }}
      >
        {editingPandit && (
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.fullName')}</label>
                <Input
                  value={editingPandit.fullName}
                  onChange={(e) => setEditingPandit({ ...editingPandit, fullName: e.target.value })}
                  placeholder="Pt. Ramesh Shastri"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.mobile')}</label>
                <Input
                  value={editingPandit.phone}
                  onChange={(e) => setEditingPandit({ ...editingPandit, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.email')}</label>
                <Input
                  value={editingPandit.email}
                  onChange={(e) => setEditingPandit({ ...editingPandit, email: e.target.value })}
                  placeholder="priest@vedictrust.org"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.experienceYears')}</label>
                <InputNumber
                  min={1}
                  max={60}
                  value={editingPandit.experienceYears || 10}
                  onChange={(v) => setEditingPandit({ ...editingPandit, experienceYears: v || 10 })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.languagesSpoken')}</label>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  value={editingPandit.languages || []}
                  onChange={(val) => setEditingPandit({ ...editingPandit, languages: val })}
                  placeholder={t('adminPandits.selectLanguages')}
                >
                  {DEFAULT_LANGUAGES.map((lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">{t('adminPandits.serviceAreasCities')}</label>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  value={editingPandit.serviceAreas || []}
                  onChange={(val) => setEditingPandit({ ...editingPandit, serviceAreas: val })}
                  placeholder={t('adminPandits.selectLocations')}
                >
                  {DEFAULT_SERVICE_AREAS.map((area) => (
                    <Option key={area} value={area}>
                      {area}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminPandits.specializations')}</label>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                value={editingPandit.specializations || []}
                onChange={(val) => setEditingPandit({ ...editingPandit, specializations: val })}
                placeholder={t('adminPandits.proficiencies')}
              >
                {DEFAULT_SPECIALIZATIONS.map((spec) => (
                  <Option key={spec} value={spec}>
                    {spec}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminPandits.photoUrl')}</label>
              <Input
                value={editingPandit.profileImage}
                onChange={(e) => setEditingPandit({ ...editingPandit, profileImage: e.target.value })}
                placeholder="https://..."
              />
              {editingPandit.profileImage && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={editingPandit.profileImage}
                    alt={t('adminPandits.preview')}
                    className="w-12 h-12 rounded-full object-cover border border-amber-300"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <span className="text-[11px] text-stone-500">{t('adminPandits.avatarPreview')}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminPandits.biography')}</label>
              <TextArea
                rows={3}
                value={editingPandit.biography}
                onChange={(e) => setEditingPandit({ ...editingPandit, biography: e.target.value })}
                placeholder={t('adminPandits.biographyPlaceholder')}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">{t('adminPandits.internalNotes')}</label>
              <Input
                value={editingPandit.adminNotes}
                onChange={(e) => setEditingPandit({ ...editingPandit, adminNotes: e.target.value })}
                placeholder={t('adminPandits.internalNotesPlaceholder')}
              />
            </div>

            <div className="pt-2 border-t border-stone-200">
              <label className="text-xs font-bold block mb-1">{t('adminPandits.status')}</label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPandit.isActive ?? true}
                  onChange={(v) => setEditingPandit({ ...editingPandit, isActive: v })}
                />
                <span className="text-xs text-stone-700">
                  {editingPandit.isActive ?? true ? (
                    <span className="text-emerald-700 font-medium">{t('adminPandits.activeDescription')}</span>
                  ) : (
                    <span className="text-stone-500">{t('adminPandits.inactiveDescription')}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Blocked Dates / Leave Modal */}
      <Modal
        title={t('adminPandits.blockedLeaveTitle', { name: selectedPandit?.fullName || '' })}
        open={leaveModalOpen}
        onCancel={() => setLeaveModalOpen(false)}
        footer={null}
        width={580}
      >
        <div className="space-y-4 py-2 text-xs">
          <p className="text-stone-500">
            {t('adminPandits.blockedLeaveDescription')}
          </p>

          {/* Existing leaves list */}
          <div className="space-y-2">
            <span className="font-bold text-stone-800 block">{t('adminPandits.currentBlocked')}</span>
            {!selectedPandit?.blockedDates || selectedPandit.blockedDates.length === 0 ? (
              <div className="p-3 bg-stone-50 rounded border text-stone-400">
                {t('adminPandits.noBlockedDates')}
              </div>
            ) : (
              selectedPandit.blockedDates.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-stone-800 font-mono">
                      {dayjs(b.startsAt).format('DD MMM YYYY')} — {dayjs(b.endsAt).format('DD MMM YYYY')}
                    </div>
                    <div className="text-stone-500 text-[11px] mt-0.5">{b.reason}</div>
                  </div>
                  <Button
                    size="small"
                    danger
                    type="text"
                    onClick={() => handleRemoveBlockedDate(b.id)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                  />
                </div>
              ))
            )}
          </div>

          {/* Add new blocked date */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 mt-4">
            <span className="font-bold text-stone-800 block">{t('adminPandits.recordLeave')}</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">{t('adminPandits.startDate')}</label>
                <input
                  type="date"
                  value={leaveStart}
                  onChange={(e) => setLeaveStart(e.target.value)}
                  className="w-full p-2 border rounded font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-600 block mb-1">{t('adminPandits.endDate')}</label>
                <input
                  type="date"
                  value={leaveEnd}
                  onChange={(e) => setLeaveEnd(e.target.value)}
                  className="w-full p-2 border rounded font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-stone-600 block mb-1">{t('adminPandits.reasonLeave')}</label>
              <Input
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder={t('adminPandits.leavePlaceholder')}
              />
            </div>
            <Button
              type="primary"
              size="small"
              onClick={handleAddBlockedDate}
              loading={saving}
              className="bg-[#7A1C24]"
            >
              {t('adminPandits.addBlocked')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Weekly Hours Modal */}
      <Modal
        title={t('adminPandits.weeklyHours', { name: selectedPandit?.fullName || '' })}
        open={scheduleModalOpen}
        onCancel={() => setScheduleModalOpen(false)}
        onOk={handleSaveSchedule}
        confirmLoading={saving}
        okText={t('adminPandits.saveShifts')}
        okButtonProps={{ className: 'bg-[#7A1C24]' }}
        width={560}
      >
        <div className="space-y-3 py-2 text-xs">
          <p className="text-stone-500">
            {t('adminPandits.shiftDescription')}
          </p>
          <div className="space-y-2 mt-3">
            {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
              (dayKey, i) => {
                const shiftIndex = editingSchedule.findIndex((s) => s.dayOfWeek === i);
                const shift = shiftIndex >= 0 ? editingSchedule[shiftIndex] : { dayOfWeek: i, startTime: '07:00', endTime: '19:00', isActive: true };

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      shift.isActive ? 'bg-amber-50/40 border-amber-200' : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-28">
                      <Switch
                        size="small"
                        checked={shift.isActive}
                        onChange={(checked) => {
                          const updated = [...editingSchedule];
                          if (shiftIndex >= 0) {
                            updated[shiftIndex] = { ...updated[shiftIndex], isActive: checked };
                          } else {
                            updated.push({ dayOfWeek: i, startTime: '07:00', endTime: '19:00', isActive: checked });
                          }
                          setEditingSchedule(updated);
                        }}
                      />
                      <span className="font-semibold text-stone-800">{t(`adminPandits.weekdays.${dayKey}`)}</span>
                    </div>

                    {shift.isActive ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={shift.startTime || '07:00'}
                          onChange={(e) => {
                            const updated = [...editingSchedule];
                            if (shiftIndex >= 0) {
                              updated[shiftIndex] = { ...updated[shiftIndex], startTime: e.target.value };
                            }
                            setEditingSchedule(updated);
                          }}
                          className="px-2 py-1 text-xs border rounded font-mono"
                        />
                        <span className="text-stone-400">{t('adminPandits.to')}</span>
                        <input
                          type="time"
                          value={shift.endTime || '19:00'}
                          onChange={(e) => {
                            const updated = [...editingSchedule];
                            if (shiftIndex >= 0) {
                              updated[shiftIndex] = { ...updated[shiftIndex], endTime: e.target.value };
                            }
                            setEditingSchedule(updated);
                          }}
                          className="px-2 py-1 text-xs border rounded font-mono"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">{t('adminPandits.dayOff')}</span>
                    )}

                    <Tag color={shift.isActive ? 'green' : 'default'} className="font-mono text-[10px]">
                      {shift.isActive ? 'ACTIVE' : 'OFF'}
                    </Tag>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
