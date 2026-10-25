import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import {
  Pooja,
  PoojaPackage,
  PoojaAddon,
  Pandit,
  ServiceMode,
  Booking,
} from '../../types/index.ts';
import {
  Steps,
  Button,
  Radio,
  Input,
  Select,
  Checkbox,
  Spin,
  Result,
} from 'antd';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MapPin,
  Flame,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const { TextArea } = Input;
const { Option } = Select;

export const BookingWizardPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL pre-selections
  const initialPoojaSlug = searchParams.get('pooja') || '';
  const initialPackageId = searchParams.get('package') || '';
  const initialType = searchParams.get('type') === 'custom' ? 'CUSTOM' : 'STANDARD';

  // Catalog State
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Wizard Stepper State
  const [currentStep, setCurrentStep] = useState(0);

  // Form Data State
  const [bookingType, setBookingType] = useState<'STANDARD' | 'CUSTOM'>(initialType);
  const [selectedPoojaId, setSelectedPoojaId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [customPoojaName, setCustomPoojaName] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Customer Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi');
  const [gotra, setGotra] = useState('');
  const [rashi, setRashi] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [sankalpNames, setSankalpNames] = useState('');

  // Service Mode & Address
  const [serviceMode, setServiceMode] = useState<ServiceMode>('HOME');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [postalCode, setPostalCode] = useState('');

  // Schedule & Slots
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().add(2, 'day').format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Pandit Selection
  const [preferredPanditId, setPreferredPanditId] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  // Load catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [pjs, pndts] = await Promise.all([api.getPoojas(), api.getPandits()]);
        setPoojas(pjs);
        setPandits(pndts);

        // Pre-select pooja if passed in query
        if (initialPoojaSlug) {
          const match = pjs.find((p) => p.slug === initialPoojaSlug);
          if (match) {
            setSelectedPoojaId(match.id);
            if (initialPackageId && match.packages.some((pk) => pk.id === initialPackageId)) {
              setSelectedPackageId(initialPackageId);
            } else if (match.packages.length > 0) {
              setSelectedPackageId(match.packages[0].id);
            }
          }
        } else if (pjs.length > 0) {
          setSelectedPoojaId(pjs[0].id);
          setSelectedPackageId(pjs[0].packages[0]?.id || '');
        }
      } finally {
        setLoadingCatalog(false);
      }
    }
    loadCatalog();
  }, [initialPoojaSlug, initialPackageId]);

  // When Pooja changes, update available packages
  const activePooja = poojas.find((p) => p.id === selectedPoojaId);
  const activePackage = activePooja?.packages.find((p) => p.id === selectedPackageId);

  // Re-fetch slots whenever Date, Pooja, Package, or Pandit changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) return;
      setLoadingSlots(true);
      try {
        const duration = activePackage?.durationMinutes || 120;
        const slots = await api.getAvailableSlots(
          selectedDate,
          duration,
          activePooja?.id,
          preferredPanditId || undefined
        );
        setAvailableSlots(slots);
        // If current selectedSlotTime is no longer available, select first available
        const firstValid = slots.find((s) => s.isAvailable);
        if (firstValid && (!selectedSlotTime || !slots.some((s) => s.time === selectedSlotTime && s.isAvailable))) {
          setSelectedSlotTime(firstValid.time);
        } else if (!firstValid) {
          setSelectedSlotTime('');
        }
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, activePackage?.durationMinutes, activePooja?.id, preferredPanditId]);

  // Validation per step
  const validateStep = (): boolean => {
    if (currentStep === 0) {
      if (bookingType === 'STANDARD') {
        if (!selectedPoojaId) {
          toaster.error(t('bookingWizard.selectPooja'));
          return false;
        }
        if (!selectedPackageId) {
          toaster.error(t('bookingWizard.selectPackage'));
          return false;
        }
      } else {
        if (!customPoojaName.trim()) {
          toaster.error(t('bookingWizard.customNameRequired'));
          return false;
        }
        if (!customRequirements.trim()) {
          toaster.error(t('bookingWizard.requirementsRequired'));
          return false;
        }
      }
    } else if (currentStep === 1) {
      if (!fullName.trim()) {
        toaster.error(t('bookingWizard.nameRequired'));
        return false;
      }
      if (!/^\d{10}$/.test(phone)) {
        toaster.error(t('bookingWizard.mobileInvalid'));
        return false;
      }
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        toaster.error(t('bookingWizard.emailInvalid'));
        return false;
      }
      if (!gotra.trim() || !rashi.trim() || !dateOfBirth || !birthPlace.trim()) {
        toaster.error(t('bookingWizard.familyDetailsRequired'));
        return false;
      }
      if (dayjs(dateOfBirth).isAfter(dayjs(), 'day')) {
        toaster.error(t('bookingWizard.birthDateFuture'));
        return false;
      }
    } else if (currentStep === 2) {
      if (serviceMode !== 'ONLINE') {
        if (!addressLine1.trim()) {
          toaster.error(t('bookingWizard.streetRequired'));
          return false;
        }
        if (!city.trim()) {
          toaster.error(t('bookingWizard.cityRequired'));
          return false;
        }
        if (!postalCode.trim()) {
          toaster.error(t('bookingWizard.postalRequired'));
          return false;
        }
      }
    } else if (currentStep === 3) {
      if (!selectedDate) {
        toaster.error(t('bookingWizard.dateRequired'));
        return false;
      }
      if (loadingSlots) {
        toaster.error(t('bookingWizard.waitForSlots'));
        return false;
      }
      if (!availableSlots.some((slot) => slot.time === selectedSlotTime && slot.isAvailable)) {
        toaster.error(t('bookingWizard.slotRequired'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Submission handler
  const handleSubmitBooking = async () => {
    if (submitting) return; // Prevent duplicate submission
    setSubmitting(true);

    try {
      // Calculate full start time ISO
      const slotTimeParts = selectedSlotTime ? selectedSlotTime.split(':') : ['09', '00'];
      const startsDate = dayjs(selectedDate)
        .hour(Number(slotTimeParts[0]))
        .minute(Number(slotTimeParts[1]))
        .second(0)
        .toDate();

      const booking = await api.createBooking({
        bookingType,
        poojaId: bookingType === 'STANDARD' ? selectedPoojaId : undefined,
        packageId: bookingType === 'STANDARD' ? selectedPackageId : undefined,
        customPoojaName: bookingType === 'CUSTOM' ? customPoojaName : undefined,
        customRequirements: bookingType === 'CUSTOM' ? customRequirements : undefined,
        customer: {
          fullName,
          email: email.trim() || undefined,
          phone,
          countryCode: '+91',
          preferredLanguage,
          gotra: gotra.trim(),
          rashi: rashi.trim(),
          dateOfBirth,
          birthPlace: birthPlace.trim(),
          sankalpNames: sankalpNames.split(',').map((s) => s.trim()).filter(Boolean),
        },
        serviceMode,
        serviceAddress:
          serviceMode !== 'ONLINE'
            ? {
                addressLine1,
                addressLine2,
                city,
                state: 'Maharashtra',
                postalCode,
                country: 'India',
              }
            : undefined,
        appointmentStartsAt: startsDate.toISOString(),
        preferredPanditId: preferredPanditId || undefined,
        selectedAddonIds,
        customerNotes,
        idempotencyKey: `idemp_${phone}_${selectedDate}_${Date.now()}`,
      });

      setCreatedBooking(booking);
      toaster.success(t('bookingWizard.placed'));
    } catch (err: any) {
      toaster.error(err.message || t('bookingWizard.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCatalog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // --- Success Screen View ---
  if (createdBooking) {
    const isCustom = createdBooking.bookingType === 'CUSTOM';
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E7E2DA] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#7A1C24] uppercase tracking-widest font-serif-title block">
              {isCustom ? t('bookingWizard.customReceived') : t('bookingWizard.appointmentReserved')}
            </span>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {isCustom ? t('bookingWizard.customQueued') : t('bookingWizard.bookedTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto leading-relaxed">
              {isCustom
                ? email
                  ? t('bookingWizard.customFollowUpEmail')
                  : t('bookingWizard.customFollowUpPhone')
                : email
                  ? t('bookingWizard.bookingFollowUpEmail')
                  : t('bookingWizard.bookingFollowUpPhone')}
            </p>
          </div>

          {/* Booking Reference Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                {t('bookingWizard.reference')}
              </span>
              <span className="text-xl font-bold text-[#7A1C24] font-mono tracking-wider">
                {createdBooking.bookingReference}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdBooking.bookingReference);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 text-stone-600 hover:text-[#7A1C24] rounded-md transition-colors"
              title={t('bookingWizard.copyReference')}
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Summary Details */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500">{t('bookingWizard.ceremonyLabel')}</span>
              <span className="font-semibold text-stone-800">{createdBooking.poojaName}</span>
            </div>
            {createdBooking.packageName && (
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">{t('bookingWizard.tierLabel')}</span>
                <span className="font-semibold text-stone-800">{createdBooking.packageName}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500">{t('bookingWizard.scheduledDate')}</span>
              <span className="font-semibold text-stone-800 font-mono">
                {dayjs(createdBooking.appointmentStartsAt).format('DD MMM YYYY, hh:mm A')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200/60">
              <span className="text-stone-500">{t('bookingWizard.serviceMode')}</span>
              <span className="font-semibold text-stone-800">{createdBooking.serviceMode}</span>
            </div>
            {createdBooking.assignedPanditName && (
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">{t('bookingWizard.assignedPriest')}</span>
                <span className="font-semibold text-stone-800">{createdBooking.assignedPanditName}</span>
              </div>
            )}
            <div className="flex justify-between py-1 pt-2">
              <span className="text-stone-700 font-bold">{t('bookingWizard.totalAmount')}</span>
              <span className="text-base font-bold text-[#7A1C24] font-mono">
                {createdBooking.price > 0 ? `₹${createdBooking.price.toLocaleString('en-IN')}` : t('bookingWizard.toBeQuoted')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={`/track?ref=${createdBooking.bookingReference}`}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#7A1C24] hover:bg-[#5E141B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors text-center"
            >
              {t('bookingWizard.trackStatus')}
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              {t('bookingWizard.backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Active Wizard Stepper View ---
  const stepTitles = [
    t('bookingWizard.steps.ceremony'),
    t('bookingWizard.steps.devotee'),
    t('bookingWizard.steps.service'),
    t('bookingWizard.steps.date'),
    t('bookingWizard.steps.priest'),
    t('bookingWizard.steps.review'),
  ];

  // Calculate pricing breakdown
  const packagePrice = activePackage?.price || 0;
  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const ad = activePooja?.addons.find((a) => a.id === id);
    return sum + (ad?.price || 0);
  }, 0);
  const totalAmount = packagePrice + addonsTotal;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#7A1C24] uppercase tracking-wider font-serif-title">
          {t('bookingWizard.eyebrow')}
        </span>
        <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
          {t('bookingWizard.title')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {t('bookingWizard.description')}
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#E7E2DA] shadow-xs">
        <Steps
          current={currentStep}
          items={stepTitles.map((title) => ({ title }))}
          size="small"
          responsive={false}
          className="overflow-x-auto"
        />
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2DA] shadow-sm min-h-[420px] flex flex-col justify-between">
        {/* STEP 0: Ceremony & Package (or Custom) */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Booking Type Toggle */}
            <div className="p-1 bg-stone-100 rounded-lg max-w-sm mx-auto flex items-center text-xs">
              <button
                type="button"
                onClick={() => setBookingType('STANDARD')}
                className={`flex-1 py-2 font-semibold rounded-md transition-all ${
                  bookingType === 'STANDARD'
                    ? 'bg-white text-[#7A1C24] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t('bookingWizard.standard')}
              </button>
              <button
                type="button"
                onClick={() => setBookingType('CUSTOM')}
                className={`flex-1 py-2 font-semibold rounded-md transition-all ${
                  bookingType === 'CUSTOM'
                    ? 'bg-white text-[#7A1C24] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t('bookingWizard.custom')}
              </button>
            </div>

            {bookingType === 'STANDARD' ? (
              <div className="space-y-6">
                {/* Choose Pooja Dropdown */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('bookingWizard.selectCeremony')}
                  </label>
                  <Select
                    value={selectedPoojaId}
                    onChange={(val) => {
                      setSelectedPoojaId(val);
                      const p = poojas.find((pj) => pj.id === val);
                      if (p && p.packages.length > 0) {
                        setSelectedPackageId(p.packages[0].id);
                      }
                    }}
                    className="w-full"
                    size="large"
                  >
                    {poojas.map((p) => (
                      <Option key={p.id} value={p.id}>
                        {p.name} ({p.categoryName})
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Choose Package Cards */}
                {activePooja && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-stone-700 block">
                      {t('bookingWizard.selectTier', { name: activePooja.name })}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activePooja.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                            selectedPackageId === pkg.id
                              ? 'border-[#7A1C24] bg-amber-50/30 shadow-xs'
                              : 'border-stone-200 hover:border-stone-400 bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="font-serif-title font-bold text-sm text-stone-900 block">
                              {pkg.name}
                            </span>
                            <span className="text-[11px] text-stone-500 line-clamp-2">
                              {pkg.description}
                            </span>
                          </div>
                          <div className="pt-3 mt-3 border-t border-stone-100 flex items-baseline justify-between">
                            <span className="text-lg font-bold text-[#7A1C24] font-mono">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-stone-500">{t('bookingWizard.minutes', { count: pkg.durationMinutes })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Booking Input */
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('bookingWizard.ritualTitle')}
                  </label>
                  <Input
                    placeholder={t('bookingWizard.ritualTitlePlaceholder')}
                    value={customPoojaName}
                    onChange={(e) => setCustomPoojaName(e.target.value)}
                    size="large"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('bookingWizard.ritualNeeds')}
                  </label>
                  <TextArea
                    rows={4}
                    placeholder={t('bookingWizard.ritualNeedsPlaceholder')}
                    value={customRequirements}
                    onChange={(e) => setCustomRequirements(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Devotee & Family Details */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="font-serif-title text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              {t('bookingWizard.devoteeSankalp')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.fullName')}
                </label>
                <Input
                  placeholder={t('bookingWizard.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.mobile')}
                </label>
                <Input
                  type="tel"
                  placeholder={t('bookingWizard.mobilePlaceholder')}
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.email')}
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.chantingLanguage')}
                </label>
                <Select
                  value={preferredLanguage}
                  onChange={setPreferredLanguage}
                  className="w-full"
                  size="large"
                >
                  <Option value="Hindi">Hindi</Option>
                  <Option value="Sanskrit">{t('bookingWizard.sanskrit')}</Option>
                  <Option value="English">{t('bookingWizard.englishHindi')}</Option>
                  <Option value="Marathi">Marathi</Option>
                  <Option value="Gujarati">Gujarati</Option>
                  <Option value="Kannada">Kannada</Option>
                  <Option value="Telugu">Telugu</Option>
                  <Option value="Tamil">Tamil</Option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.gotra')}
                </label>
                <Input
                  placeholder={t('bookingWizard.gotraPlaceholder')}
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.rashi')}
                </label>
                <Input
                  placeholder={t('bookingWizard.rashiPlaceholder')}
                  value={rashi}
                  onChange={(e) => setRashi(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.dateOfBirth')}
                </label>
                <Input
                  type="date"
                  max={dayjs().format('YYYY-MM-DD')}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.birthPlace')}
                </label>
                <Input
                  placeholder={t('bookingWizard.birthPlacePlaceholder')}
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  size="large"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('bookingWizard.sankalpNames')}
                </label>
                <Input
                  placeholder={t('bookingWizard.sankalpNamesPlaceholder')}
                  value={sankalpNames}
                  onChange={(e) => setSankalpNames(e.target.value)}
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Service Mode & Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-serif-title text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              {t('bookingWizard.locationAndMode')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  mode: 'HOME' as ServiceMode,
                  title: t('bookingWizard.homeMode'),
                  desc: t('bookingWizard.homeModeDescription'),
                },
                {
                  mode: 'VENUE' as ServiceMode,
                  title: t('bookingWizard.venueMode'),
                  desc: t('bookingWizard.venueModeDescription'),
                },
                {
                  mode: 'ONLINE' as ServiceMode,
                  title: t('bookingWizard.onlineMode'),
                  desc: t('bookingWizard.onlineModeDescription'),
                },
              ].map((item) => (
                <div
                  key={item.mode}
                  onClick={() => setServiceMode(item.mode)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    serviceMode === item.mode
                      ? 'border-[#7A1C24] bg-amber-50/40 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900">{item.title}</div>
                  <div className="text-xs text-stone-500 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>

            {serviceMode !== 'ONLINE' ? (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t('bookingWizard.address')}
                    </label>
                    <Input
                      placeholder={t('bookingWizard.addressPlaceholder')}
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      size="large"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t('bookingWizard.city')}
                    </label>
                    <Select value={city} onChange={setCity} className="w-full" size="large">
                      <Option value="Mumbai">Mumbai</Option>
                      <Option value="Thane">Thane</Option>
                      <Option value="Navi Mumbai">Navi Mumbai</Option>
                      <Option value="Pune">Pune</Option>
                      <Option value="Delhi NCR">Delhi NCR</Option>
                      <Option value="Bengaluru">Bengaluru</Option>
                      <Option value="Hyderabad">Hyderabad</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t('bookingWizard.postalCode')}
                    </label>
                    <Input
                      placeholder={t('bookingWizard.postalPlaceholder')}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      size="large"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block mb-1">{t('bookingWizard.onlineNoteTitle')}</span>
                {t('bookingWizard.onlineNote')}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Date & Dynamic Time Slot Picker */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-serif-title text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              {t('bookingWizard.selectDateAndTime')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">
                  {t('bookingWizard.auspiciousDate')}
                </label>
                <input
                  type="date"
                  min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                  max={dayjs().add(60, 'day').format('YYYY-MM-DD')}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-[#7A1C24] font-mono text-stone-800"
                />
                <span className="text-[11px] text-stone-500 block">
                  {t('bookingWizard.advanceWindow')}
                </span>
              </div>

              {/* Dynamic Slots Grid */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-stone-700 block flex justify-between items-center">
                  <span>Available Time Slots ({selectedDate}):</span>
                  {loadingSlots && <span className="text-[11px] text-amber-700">Checking availability...</span>}
                </label>

                {loadingSlots ? (
                  <div className="py-8 text-center"><Spin /></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlotTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlotTime(slot.time)}
                          className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all text-center flex flex-col justify-center items-center ${
                            !slot.isAvailable
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#7A1C24] text-white border-[#7A1C24] shadow-sm'
                              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <span>{slot.time}</span>
                          <span className="text-[9px] font-sans font-normal mt-0.5">
                            {slot.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Pandit Profile & Preference */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="font-serif-title text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Assigned Pandit & Scholar Selection
            </h3>

            <p className="text-xs text-stone-600">
              Based on your ceremony and chosen package, our algorithm assigns our verified Chief Pandit. You may optionally choose another eligible priest.
            </p>

            <div className="space-y-3">
              {pandits.map((p) => {
                const isSelected = preferredPanditId === p.id || (!preferredPanditId && p.id === 'pandit-1');
                return (
                  <div
                    key={p.id}
                    onClick={() => setPreferredPanditId(p.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-[#7A1C24] bg-amber-50/30 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <img
                      src={p.profileImage}
                      alt={p.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif-title font-bold text-sm text-stone-900">
                          {p.fullName}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#7A1C24] text-white px-2 py-0.5 rounded font-semibold">
                            Assigned
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-800 font-medium">
                        {p.experienceYears} Years Exp · {p.languages.join(', ')}
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-2">
                        {p.biography}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Ritual Add-ons Selection */}
            {activePooja && activePooja.addons.length > 0 && (
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <span className="text-xs font-bold text-stone-800 block">
                  Add Auspicious Offerings (Optional):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePooja.addons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => {
                          setSelectedAddonIds((prev) =>
                            isChecked ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                          );
                        }}
                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          isChecked ? 'border-amber-600 bg-amber-50/50' : 'border-stone-200 bg-white'
                        }`}
                      >
                        <Checkbox checked={isChecked} />
                        <div className="flex-1 text-xs">
                          <div className="flex justify-between font-bold text-stone-800">
                            <span>{addon.name}</span>
                            <span className="font-mono text-[#7A1C24]">+₹{addon.price}</span>
                          </div>
                          <span className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {addon.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Final Commercial Review & Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="font-serif-title text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Review Appointment & Commercial Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Devotee & Ceremony Snapshot */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <div className="font-bold text-stone-800 text-sm font-serif-title border-b border-stone-200 pb-1 mb-2">
                    Ceremony Specifications
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ceremony:</span>
                    <span className="font-semibold text-stone-800">
                      {bookingType === 'STANDARD' ? activePooja?.name : customPoojaName}
                    </span>
                  </div>
                  {bookingType === 'STANDARD' && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Selected Tier:</span>
                      <span className="font-semibold text-stone-800">{activePackage?.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Scheduled Date:</span>
                    <span className="font-semibold text-stone-800 font-mono">
                      {dayjs(selectedDate).format('DD MMM YYYY')} at {selectedSlotTime || 'Morning'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Service Mode:</span>
                    <span className="font-semibold text-stone-800">{serviceMode}</span>
                  </div>
                  {serviceMode !== 'ONLINE' && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Address:</span>
                      <span className="font-semibold text-stone-800 text-right max-w-xs truncate">
                        {addressLine1}, {city} ({postalCode})
                      </span>
                    </div>
                  )}
                </div>

                {/* Devotee Info */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <div className="font-bold text-stone-800 text-sm font-serif-title border-b border-stone-200 pb-1 mb-2">
                    Devotee Particulars
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Yajman Name:</span>
                    <span className="font-semibold text-stone-800">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mobile:</span>
                    <span className="font-semibold text-stone-800">{phone}</span>
                  </div>
                  {email && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Email:</span>
                      <span className="font-semibold text-stone-800">{email}</span>
                    </div>
                  )}
                  {gotra && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Gotra:</span>
                      <span className="font-semibold text-stone-800">{gotra}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Rashi:</span>
                    <span className="font-semibold text-stone-800">{rashi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date of Birth:</span>
                    <span className="font-semibold text-stone-800">{dayjs(dateOfBirth).format('DD MMM YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Place of Birth:</span>
                    <span className="font-semibold text-stone-800">{birthPlace}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="md:col-span-5 bg-amber-50/40 p-5 rounded-xl border border-amber-200 space-y-4">
                <div className="font-bold text-stone-900 text-sm font-serif-title border-b border-amber-200 pb-2">
                  Commercial Breakdown
                </div>

                {bookingType === 'STANDARD' ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-600">{activePackage?.name}</span>
                      <span className="font-mono font-semibold">₹{packagePrice.toLocaleString('en-IN')}</span>
                    </div>
                    {selectedAddonIds.map((aId) => {
                      const ad = activePooja?.addons.find((a) => a.id === aId);
                      return (
                        <div key={aId} className="flex justify-between text-stone-500">
                          <span>+ {ad?.name}</span>
                          <span className="font-mono">₹{ad?.price.toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t border-amber-200 flex justify-between items-baseline">
                      <span className="text-stone-900 font-bold text-sm">Total Payable</span>
                      <span className="text-2xl font-bold text-[#7A1C24] font-mono">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 block text-right">
                      All Dakshina & Samagri included.
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-stone-700 leading-relaxed">
                    Custom inquiry requires quotation approval. Our coordinators will review your requirements and provide formal pricing.
                  </div>
                )}

                <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free cancellation up to 24 hours prior to muhurat.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="pt-8 mt-8 border-t border-stone-100 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="px-8 py-3 text-sm font-bold text-white bg-[#7A1C24] hover:bg-[#5E141B] rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Spin size="small" />
                  <span>Reserving Appointment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Place Booking</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
