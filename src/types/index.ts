export type BookingStatus = 
  | 'PENDING'
  | 'AWAITING_CUSTOM_QUOTE'
  | 'QUOTE_SENT'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'COMPLETED';

export type ServiceMode = 'HOME' | 'VENUE' | 'ONLINE';
export type BookingType = 'STANDARD' | 'CUSTOM';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredLanguage: string;
  gotra?: string;
  rashi?: string;
  dateOfBirth?: string;
  birthPlace?: string;
  sankalpNames?: string[];
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PoojaCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  poojaCount?: number;
}

export interface PackageInclusion {
  id: string;
  packageId: string;
  title: string;
  description?: string;
  sortOrder: number;
}

export interface PoojaPackage {
  id: string;
  poojaId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationMinutes: number;
  panditCount: number;
  includesSamagri: boolean;
  includesDakshina: boolean;
  defaultPanditId?: string;
  sortOrder: number;
  isActive: boolean;
  inclusions: PackageInclusion[];
}

export interface PoojaAddon {
  id: string;
  poojaId?: string; // Optional if global addon
  name: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface Pooja {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  purpose: string;
  ritualRequirements: string[];
  instructions: string;
  durationMinutes: number;
  defaultPanditId?: string;
  allowCustomerPanditPreference: boolean;
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  supportedModes: ServiceMode[];
  supportedLanguages: string[];
  supportedCities: string[];
  imageUrl: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  packages: PoojaPackage[];
  addons: PoojaAddon[];
  quote?: string;
  allowCustomQuote?: boolean;
  customQuoteStartingPrice?: number;
  customQuoteNotes?: string;
  category?: PoojaCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface PanditScheduleSlot {
  id: string;
  panditId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday ... 6=Saturday
  startTime: string; // e.g. "07:00"
  endTime: string;   // e.g. "19:00"
  isActive: boolean;
}

export interface PanditBlockedDate {
  id: string;
  panditId: string;
  startsAt: string; // ISO String
  endsAt: string;   // ISO String
  reason: string;
  createdAt: string;
}

export interface Pandit {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  biography: string;
  experienceYears: number;
  specializations: string[];
  languages: string[];
  serviceAreas: string[];
  supportedModes: ServiceMode[];
  eligiblePoojaIds: string[];
  isActive: boolean;
  adminNotes?: string;
  weeklySchedule: PanditScheduleSlot[];
  blockedDates: PanditBlockedDate[];
}

export interface BookingAddonSnapshot {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. PB-2026-1048
  customerId: string;
  customer: Customer;
  poojaId?: string;
  poojaName: string;
  packageId?: string;
  packageName?: string;
  assignedPanditId?: string;
  assignedPanditName?: string;
  defaultPanditIdAtBooking?: string;
  bookingType: BookingType;
  customPoojaName?: string;
  customRequirements?: string;
  participantCount: number;
  serviceMode: ServiceMode;
  serviceAddress?: CustomerAddress;
  preferredLanguage: string;
  appointmentStartsAt: string; // ISO
  appointmentEndsAt: string;   // ISO
  status: BookingStatus;
  currency: string;
  price: number;
  approvedQuoteAmount?: number;
  packageSnapshot?: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    panditCount: number;
    includesSamagri: boolean;
    includesDakshina: boolean;
    inclusions: string[];
  };
  selectedAddons: BookingAddonSnapshot[];
  customerNotes?: string;
  adminNotes?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
}

export interface BookingHistory {
  id: string;
  bookingId: string;
  previousStatus?: BookingStatus;
  newStatus: BookingStatus;
  previousPanditId?: string;
  newPanditId?: string;
  previousAppointmentStartsAt?: string;
  newAppointmentStartsAt?: string;
  changedBy: string; // 'Devotee' or Admin Name
  eventType: string; // 'CREATED', 'CONFIRMED', 'RESCHEDULED', 'REASSIGNED', 'CANCELLED', 'COMPLETED', 'NOTE_ADDED'
  notes?: string;
  createdAt: string;
}

export interface CustomQuote {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customPoojaName: string;
  version: number;
  proposedAmount: number;
  currency: string;
  quoteDetails: string;
  exclusions?: string;
  status: QuoteStatus;
  expiresAt: string;
  assignedPanditId?: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  bookingId?: string;
  bookingReference?: string;
  notificationType: 'BOOKING_RECEIVED' | 'CONFIRMATION' | 'CUSTOM_QUOTE' | 'RESCHEDULED' | 'PANDIT_ASSIGNED' | 'CANCELLED' | 'COMPLETED';
  recipient: string;
  subject: string;
  contentSnippet: string;
  status: NotificationStatus;
  attemptCount: number;
  providerMessageId?: string;
  errorMessage?: string;
  sentAt?: string;
  createdAt: string;
}

export interface AppSettings {
  businessName: string;
  websiteName?: string;
  websiteSubtitle?: string;
  websiteDomain?: string;
  logoUrl?: string;
  helplinePhone: string;
  supportEmail: string;
  serviceAddress: string;
  serviceCity: string;
  globalDefaultPanditId?: string;
  serviceTimeszone: string;
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  defaultSlotDurationMinutes: number;
  slotIntervalMinutes: number;
  cancellationAllowedBeforeHours: number;
  enableCustomerPanditPreference: boolean;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  status: 'DRAFT' | 'PUBLISHED';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  gotra: string;
  rashi: string;
  dateOfBirth: string;
  place: string;
  appointmentDate: string;
  appointmentTime: string;
  mobileNumber: string;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  upcomingAppointments: number;
  pendingConfirmations: number;
  awaitingCustomQuotes: number;
  confirmedRevenue: number;
  activePanditsCount: number;
  completedBookings: number;
}
