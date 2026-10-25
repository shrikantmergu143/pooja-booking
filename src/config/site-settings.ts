import type { AppSettings } from '../types/index.ts';

export const DEFAULT_SITE_SETTINGS: AppSettings = {
  businessName: 'Vishnusudarshana Dharmik Sanskar Kendra',
  websiteName: 'Vishnusudarshana',
  websiteSubtitle: 'Dharmik Sanskar Kendra',
  websiteDomain: 'https://www.vishnusudarshana.com',
  logoUrl: '',
  helplinePhone: '98500 57444',
  supportEmail: '',
  serviceAddress: 'Shubhamastu Nilayam, Plot No 63, Srushti Nagar, Akkalkot Road',
  serviceCity: 'Solapur',
  serviceTimeszone: 'Asia/Kolkata',
  minAdvanceBookingHours: 12,
  maxAdvanceBookingDays: 60,
  defaultSlotDurationMinutes: 120,
  slotIntervalMinutes: 90,
  cancellationAllowedBeforeHours: 24,
  enableCustomerPanditPreference: true,
};
