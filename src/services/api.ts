import {
  AdminUser,
  Appointment,
  AppSettings,
  Booking,
  BookingHistory,
  ContactMessage,
  ContentPage,
  Customer,
  CustomQuote,
  DashboardStats,
  NotificationLog,
  Pandit,
  Pooja,
  PoojaCategory,
} from '../types/index.ts';
import { LANGUAGE_STORAGE_KEY } from '../i18n/constants.ts';
import { publicEnvironment } from '../config/public-env.ts';

const BASE_URL = `${publicEnvironment.apiBaseUrl}/api/v1`;
const ADMIN_SESSION_KEY = 'POOJA_ADMIN_SESSION';

function slugify(value?: string) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface BookingRequest {
  bookingType: 'STANDARD' | 'CUSTOM';
  poojaId?: string;
  packageId?: string;
  customPoojaName?: string;
  customRequirements?: string;
  participantCount?: number;
  customer: {
    fullName: string;
    email?: string;
    phone: string;
    countryCode?: string;
    preferredLanguage?: string;
    gotra: string;
    rashi: string;
    dateOfBirth: string;
    birthPlace: string;
    sankalpNames?: string[];
  };
  serviceMode: 'HOME' | 'VENUE' | 'ONLINE';
  serviceAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  appointmentStartsAt: string;
  preferredPanditId?: string;
  selectedAddonIds?: string[];
  customerNotes?: string;
  idempotencyKey?: string;
}

async function httpRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept-Language', localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'mr' ? 'mr' : 'en');
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const sessionText = localStorage.getItem(ADMIN_SESSION_KEY);
  if (sessionText) {
    const session = JSON.parse(sessionText) as { token?: string };
    if (session.token) headers.set('Authorization', `Bearer ${session.token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const responseText = response.status === 204 ? '' : await response.text();
  const payload: unknown = responseText ? JSON.parse(responseText) : undefined;
  const envelope = payload as { data?: T; message?: string | string[] } | undefined;

  if (!response.ok) {
    const message = Array.isArray(envelope?.message)
      ? envelope.message.join(', ')
      : envelope?.message;
    throw new Error(message || `HTTP ${response.status} Error`);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return envelope?.data as T;
  }
  return payload as T;
}

function saveAdminSession(data: { user: AdminUser; token: string }) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
}

export const api = {
  async loginAdmin(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
    const result = await httpRequest<{
      user: AdminUser;
      token?: string;
      accessToken?: string;
    }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = result.token || result.accessToken;
    if (!token) throw new Error('The login response did not include an access token.');
    const session = { user: result.user, token };
    saveAdminSession(session);
    return session;
  },

  async createAdmin(data: { name: string; email: string; password: string }) {
    return httpRequest<AdminUser>('/auth/admin/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentAdmin(): Promise<{ user: AdminUser; token: string } | null> {
    const sessionText = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionText) return null;
    const session = JSON.parse(sessionText) as { user: AdminUser; token: string };
    const user = await httpRequest<AdminUser>('/auth/admin/me');
    const current = { user, token: session.token };
    saveAdminSession(current);
    return current;
  },

  async logoutAdmin(): Promise<void> {
    try {
      await httpRequest('/auth/admin/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  async getCategories(): Promise<PoojaCategory[]> {
    return httpRequest<PoojaCategory[]>('/categories');
  },

  async getAdminCategories(): Promise<PoojaCategory[]> {
    return httpRequest<PoojaCategory[]>('/admin/categories');
  },

  async getPoojas(filter?: { categorySlug?: string; mode?: string; search?: string }): Promise<Pooja[]> {
    const params = new URLSearchParams();
    if (filter?.categorySlug) params.set('category', filter.categorySlug);
    if (filter?.mode) params.set('mode', filter.mode);
    if (filter?.search) params.set('search', filter.search);
    const queryString = params.toString();
    const query = queryString ? `?${queryString}` : '';
    return httpRequest<Pooja[]>(`/poojas${query}`);
  },

  async getAdminPoojas(): Promise<Pooja[]> {
    return httpRequest<Pooja[]>('/admin/poojas');
  },

  async getPoojaBySlug(slug: string): Promise<Pooja> {
    return httpRequest<Pooja>(`/poojas/${encodeURIComponent(slug)}`);
  },

  async getPandits(): Promise<Pandit[]> {
    return httpRequest<Pandit[]>('/pandits');
  },

  async getAvailableSlots(
    dateStr: string,
    durationMinutes: number,
    poojaId?: string,
    panditId?: string,
  ) {
    const params = new URLSearchParams({
      date: dateStr,
      duration: durationMinutes.toString(),
    });
    if (poojaId) params.set('poojaId', poojaId);
    if (panditId) params.set('panditId', panditId);
    return httpRequest<
      Array<{
        time: string;
        startsAt: string;
        endsAt: string;
        isAvailable: boolean;
        conflictReason?: string;
        panditAssigned?: string;
      }>
    >(`/availability/slots?${params.toString()}`);
  },

  async getPublicSettings(): Promise<AppSettings> {
    return httpRequest<AppSettings>('/settings/public');
  },

  async getPublishedPage(slug: string): Promise<ContentPage> {
    return httpRequest<ContentPage>(`/content-pages/${encodeURIComponent(slug)}`);
  },

  async getAdminContentPages(): Promise<ContentPage[]> {
    return httpRequest<ContentPage[]>('/admin/content-pages');
  },

  async createContentPage(page: {
    slug: string;
    title: string;
    contentHtml: string;
    status: ContentPage['status'];
    seoTitle?: string;
    seoDescription?: string;
  }): Promise<ContentPage> {
    return httpRequest<ContentPage>('/admin/content-pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  },

  async updateContentPage(
    slug: string,
    page: Partial<Pick<ContentPage, 'title' | 'contentHtml' | 'status' | 'seoTitle' | 'seoDescription'>>,
  ): Promise<ContentPage> {
    return httpRequest<ContentPage>(`/admin/content-pages/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      body: JSON.stringify(page),
    });
  },

  async deleteContentPage(slug: string): Promise<void> {
    await httpRequest(`/admin/content-pages/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
  },

  async createContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    website?: string;
  }): Promise<ContactMessage> {
    return httpRequest<ContactMessage>('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAdminContactMessages(): Promise<ContactMessage[]> {
    return httpRequest<ContactMessage[]>('/admin/contact-messages');
  },

  async updateContactMessage(
    id: string,
    data: { status?: ContactMessage['status']; adminNotes?: string },
  ): Promise<ContactMessage> {
    return httpRequest<ContactMessage>(`/admin/contact-messages/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async createAppointment(payload: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    return httpRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAdminAppointments(): Promise<Appointment[]> {
    return httpRequest<Appointment[]>('/admin/appointments');
  },

  async createAdminAppointment(
    payload: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Appointment> {
    return httpRequest<Appointment>('/admin/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAdminAppointment(
    id: string,
    payload: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Appointment> {
    return httpRequest<Appointment>(`/admin/appointments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteAdminAppointment(id: string): Promise<void> {
    await httpRequest<void>(`/admin/appointments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async createBooking(payload: BookingRequest): Promise<Booking> {
    return httpRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createAdminBooking(payload: BookingRequest): Promise<Booking> {
    return httpRequest<Booking>('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAdminBooking(
    bookingId: string,
    payload: {
      customer?: Partial<Customer>;
      serviceAddress?: Omit<NonNullable<Booking['serviceAddress']>, 'id' | 'customerId'>;
      customerNotes?: string;
    },
  ): Promise<Booking> {
    return httpRequest<Booking>(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async archiveAdminBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'DELETE',
    });
  },

  async lookupBooking(bookingReference: string, phoneEnding: string): Promise<Booking> {
    const params = new URLSearchParams({ phoneEnding });
    return httpRequest<Booking>(
      `/bookings/${encodeURIComponent(bookingReference)}?${params.toString()}`,
    );
  },

  async getAdminBookings(): Promise<Booking[]> {
    return httpRequest<Booking[]>('/admin/bookings');
  },

  async getBookingDetail(id: string): Promise<{ booking: Booking; history: BookingHistory[] }> {
    return httpRequest(`/admin/bookings/${encodeURIComponent(id)}`);
  },

  async confirmBooking(bookingId: string, _adminName = 'Admin', notes?: string) {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  async rescheduleBooking(
    bookingId: string,
    newStartsAtISO: string,
    _adminName = 'Admin',
    notes?: string,
  ) {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ startsAt: newStartsAtISO, notes }),
    });
  },

  async reassignPandit(
    bookingId: string,
    newPanditId: string,
    _adminName = 'Admin',
    notes?: string,
  ) {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/assign-pandit`, {
      method: 'POST',
      body: JSON.stringify({ panditId: newPanditId, notes }),
    });
  },

  async cancelBooking(bookingId: string, _adminName = 'Admin', reason: string) {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async completeBooking(bookingId: string, _adminName = 'Admin') {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/complete`, {
      method: 'POST',
    });
  },

  async addBookingNote(bookingId: string, _adminName = 'Admin', note: string) {
    return httpRequest(`/admin/bookings/${encodeURIComponent(bookingId)}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  async upsertCategory(category: Partial<PoojaCategory>): Promise<PoojaCategory> {
    const { id } = category;
    const requestBody = {
      name: category.name,
      slug: category.slug || slugify(category.name),
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
    };
    return httpRequest<PoojaCategory>(
      id ? `/admin/categories/${encodeURIComponent(id)}` : '/admin/categories',
      {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(requestBody),
      },
    );
  },

  async upsertPooja(pooja: Partial<Pooja>): Promise<Pooja> {
    const {
      id,
      categoryName: _categoryName,
      category: _category,
      packages: _packages,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...body
    } = pooja;
    const requestBody = {
      ...body,
      slug: body.slug || slugify(body.name),
      shortDescription: body.shortDescription || body.name,
      description: body.description || body.shortDescription || body.name,
    };
    return httpRequest<Pooja>(id ? `/admin/poojas/${encodeURIComponent(id)}` : '/admin/poojas', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  async getAllPanditsAdmin(): Promise<Pandit[]> {
    return httpRequest<Pandit[]>('/admin/pandits');
  },

  async upsertPandit(pandit: Partial<Pandit>): Promise<Pandit> {
    const { id, ...body } = pandit;
    return httpRequest<Pandit>(id ? `/admin/pandits/${encodeURIComponent(id)}` : '/admin/pandits', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(body),
    });
  },

  async createPandit(pandit: Partial<Pandit>): Promise<Pandit> {
    return this.upsertPandit(pandit);
  },

  async updatePandit(panditId: string, data: Partial<Pandit>): Promise<Pandit> {
    return this.upsertPandit({ ...data, id: panditId });
  },

  async deletePandit(panditId: string): Promise<boolean> {
    await httpRequest(`/admin/pandits/${encodeURIComponent(panditId)}`, { method: 'DELETE' });
    return true;
  },

  async updatePanditSchedule(panditId: string, weeklySchedule: unknown[]): Promise<boolean> {
    await httpRequest(`/admin/pandits/${encodeURIComponent(panditId)}/schedule`, {
      method: 'PUT',
      body: JSON.stringify({ weeklySchedule }),
    });
    return true;
  },

  async addPanditBlockedDate(
    panditId: string,
    startsAt: string,
    endsAt: string,
    reason: string,
  ): Promise<boolean> {
    await httpRequest(`/admin/pandits/${encodeURIComponent(panditId)}/blocked-dates`, {
      method: 'POST',
      body: JSON.stringify({ startsAt, endsAt, reason }),
    });
    return true;
  },

  async removePanditBlockedDate(panditId: string, blockId: string): Promise<boolean> {
    await httpRequest(
      `/admin/pandits/${encodeURIComponent(panditId)}/blocked-dates/${encodeURIComponent(blockId)}`,
      { method: 'DELETE' },
    );
    return true;
  },

  async getCustomQuotes(): Promise<CustomQuote[]> {
    return httpRequest<CustomQuote[]>('/admin/custom-quotes');
  },

  async createCustomQuote(data: {
    bookingId: string;
    proposedAmount: number;
    quoteDetails: string;
    exclusions?: string;
    assignedPanditId?: string;
  }): Promise<CustomQuote> {
    return httpRequest<CustomQuote>('/admin/custom-quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async acceptCustomQuote(quoteId: string): Promise<boolean> {
    return httpRequest<boolean>(`/admin/custom-quotes/${encodeURIComponent(quoteId)}/accept`, {
      method: 'POST',
    });
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return httpRequest<DashboardStats>('/admin/dashboard/stats');
  },

  async getNotificationLogs(): Promise<NotificationLog[]> {
    return httpRequest<NotificationLog[]>('/admin/notifications');
  },

  async retryNotification(notifId: string): Promise<boolean> {
    return httpRequest<boolean>(`/admin/notifications/${encodeURIComponent(notifId)}/retry`, {
      method: 'POST',
    });
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return httpRequest<AppSettings>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};
