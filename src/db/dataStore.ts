import {
  Booking,
  BookingHistory,
  BookingStatus,
  CustomQuote,
  Customer,
  DashboardStats,
  NotificationLog,
  Pandit,
  Pooja,
  PoojaAddon,
  PoojaCategory,
  PoojaPackage,
  AppSettings,
  AdminUser,
} from '../types/index.ts';

// High-fidelity generated image paths
const ganeshImg = '/src/assets/images/pooja_ganesh_puja_1792745404956.jpg';
const satyanarayanImg = '/src/assets/images/pooja_satyanarayan_1792745405904.jpg';
const grihaPraveshImg = '/src/assets/images/pooja_griha_pravesh_1792745408082.jpg';
const rudrabhishekImg = '/src/assets/images/pooja_rudrabhishek_1792745407484.jpg';

// In-memory persistent database with LocalStorage backing
const STORAGE_KEY = 'POOJA_BOOKING_SYSTEM_DB_V1';

export interface DatabaseState {
  adminUsers: AdminUser[];
  categories: PoojaCategory[];
  poojas: Pooja[];
  pandits: Pandit[];
  bookings: Booking[];
  bookingHistory: BookingHistory[];
  customQuotes: CustomQuote[];
  notificationLogs: NotificationLog[];
  settings: AppSettings;
}

// Default Seed Data
const initialAdminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Acharya Vidyadhar (Super Admin)',
    email: 'admin@bookmypooja.com',
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-2',
    name: 'Pandit Rajesh Tiwari',
    email: 'coordinator@bookmypooja.com',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-10T00:00:00.000Z',
  },
];

const initialCategories: PoojaCategory[] = [
  {
    id: 'cat-1',
    name: 'Vedic Pujas & Havans',
    slug: 'vedic-pujas-havans',
    description: 'Auspicious Vedic ceremonies for peace, prosperity, health, and spiritual blessings.',
    imageUrl: ganeshImg,
    sortOrder: 1,
    isActive: true,
    poojaCount: 4,
  },
  {
    id: 'cat-2',
    name: 'Griha Pravesh & Vastu',
    slug: 'griha-pravesh-vastu',
    description: 'Purification and sanctification ceremonies for new homes, offices, and commercial establishments.',
    imageUrl: grihaPraveshImg,
    sortOrder: 2,
    isActive: true,
    poojaCount: 2,
  },
  {
    id: 'cat-3',
    name: 'Rudrabhishek & Shiva Puja',
    slug: 'rudrabhishek-shiva',
    description: 'Consecrated sacred abhishekams for removing obstacles, relief from ailments, and inner peace.',
    imageUrl: rudrabhishekImg,
    sortOrder: 3,
    isActive: true,
    poojaCount: 2,
  },
  {
    id: 'cat-4',
    name: 'Graha Shanti & Planetary Dosha',
    slug: 'graha-shanti',
    description: 'Vedic planetary remedies including Navgrah Shanti, Kaal Sarp, and Mangal Dosha Nivaran.',
    imageUrl: satyanarayanImg,
    sortOrder: 4,
    isActive: true,
    poojaCount: 3,
  },
];

const initialPandits: Pandit[] = [
  {
    id: 'pandit-1',
    fullName: 'Pt. Rameshwar Sharma Shastri',
    email: 'rameshwar.shastri@vedictrust.org',
    phone: '+91 98201 44521',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    biography: 'Certified Ved-Murti from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi. Over 24 years of expertise in Shukla Yajurveda, Havans, and Griha Pravesh sanskars.',
    experienceYears: 24,
    specializations: ['Yajurveda Karmakand', 'Griha Pravesh', 'Satyanarayan Katha', 'Vedic Vivah'],
    languages: ['Hindi', 'Sanskrit', 'Marathi', 'English'],
    serviceAreas: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Online'],
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    eligiblePoojaIds: ['pooja-1', 'pooja-2', 'pooja-3', 'pooja-4', 'pooja-5'],
    isActive: true,
    adminNotes: 'Senior Chief Priest. Recommended for high-profile and detailed Vedic rituals.',
    weeklySchedule: [
      { id: 'sch-1', panditId: 'pandit-1', dayOfWeek: 0, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-2', panditId: 'pandit-1', dayOfWeek: 1, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-3', panditId: 'pandit-1', dayOfWeek: 2, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-4', panditId: 'pandit-1', dayOfWeek: 3, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-5', panditId: 'pandit-1', dayOfWeek: 4, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-6', panditId: 'pandit-1', dayOfWeek: 5, startTime: '06:30', endTime: '19:30', isActive: true },
      { id: 'sch-7', panditId: 'pandit-1', dayOfWeek: 6, startTime: '06:30', endTime: '19:30', isActive: true },
    ],
    blockedDates: [
      {
        id: 'blk-1',
        panditId: 'pandit-1',
        startsAt: '2026-11-15T00:00:00.000Z',
        endsAt: '2026-11-18T23:59:59.000Z',
        reason: 'Pilgrimage to Kashi Vishwanath Temple',
        createdAt: '2026-10-01T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'pandit-2',
    fullName: 'Acharya Shrikant Joshi',
    email: 'shrikant.joshi@vedictrust.org',
    phone: '+91 97112 33419',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    biography: 'Rigveda Acharya with 18 years of ritual experience. Renowned for authentic Maha Rudrabhishek chanting, Laghurudra, and Navgrah Dosha Nivaran.',
    experienceYears: 18,
    specializations: ['Rigveda Samhita', 'Maha Rudrabhishek', 'Navgrah Shanti', 'Mahamrityunjaya Jaap'],
    languages: ['Hindi', 'Sanskrit', 'Gujarati', 'English'],
    serviceAreas: ['Delhi NCR', 'Noida', 'Gurugram', 'Faridabad', 'Online'],
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    eligiblePoojaIds: ['pooja-1', 'pooja-3', 'pooja-4', 'pooja-5'],
    isActive: true,
    adminNotes: 'Punctual and articulates Vedic mantras with clear explanations in English and Hindi for younger devotees.',
    weeklySchedule: [
      { id: 'sch-8', panditId: 'pandit-2', dayOfWeek: 0, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-9', panditId: 'pandit-2', dayOfWeek: 1, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-10', panditId: 'pandit-2', dayOfWeek: 2, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-11', panditId: 'pandit-2', dayOfWeek: 3, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-12', panditId: 'pandit-2', dayOfWeek: 4, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-13', panditId: 'pandit-2', dayOfWeek: 5, startTime: '07:00', endTime: '20:00', isActive: true },
      { id: 'sch-14', panditId: 'pandit-2', dayOfWeek: 6, startTime: '07:00', endTime: '20:00', isActive: true },
    ],
    blockedDates: [],
  },
  {
    id: 'pandit-3',
    fullName: 'Pt. Anant Narayan Dixit',
    email: 'anant.dixit@vedictrust.org',
    phone: '+91 94480 12890',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    biography: 'Krishna Yajurveda Pandit with 14 years of practice. Specialist in Vastu Dosh Nivaran, Ganpati Atharvashirsha Avartan, and Lakshmi Kuber pujas.',
    experienceYears: 14,
    specializations: ['Ganapati Atharvashirsha', 'Vastu Havan', 'Lakshmi Puja', 'Sudharshana Havan'],
    languages: ['Hindi', 'Sanskrit', 'Kannada', 'Telugu'],
    serviceAreas: ['Bengaluru', 'Mysuru', 'Hyderabad', 'Online'],
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    eligiblePoojaIds: ['pooja-1', 'pooja-2', 'pooja-4'],
    isActive: true,
    adminNotes: 'Fluent in South Indian traditions as well as North Indian paddhati.',
    weeklySchedule: [
      { id: 'sch-15', panditId: 'pandit-3', dayOfWeek: 0, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-16', panditId: 'pandit-3', dayOfWeek: 1, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-17', panditId: 'pandit-3', dayOfWeek: 2, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-18', panditId: 'pandit-3', dayOfWeek: 3, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-19', panditId: 'pandit-3', dayOfWeek: 4, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-20', panditId: 'pandit-3', dayOfWeek: 5, startTime: '06:00', endTime: '18:00', isActive: true },
      { id: 'sch-21', panditId: 'pandit-3', dayOfWeek: 6, startTime: '06:00', endTime: '18:00', isActive: true },
    ],
    blockedDates: [],
  },
];

const initialGlobalAddons: PoojaAddon[] = [
  {
    id: 'addon-1',
    name: 'Navgrah Havan Ahuti (108 Mantras)',
    description: 'Special samidha and guggul offering to harmonize all nine cosmic planetary energies.',
    price: 1100,
    currency: 'INR',
    isActive: true,
  },
  {
    id: 'addon-2',
    name: 'Gau Seva & Green Fodder Seva',
    description: 'Offering of 21kg fresh green grass and gur to sacred cows at an affiliated Gaushala in your Gotra name.',
    price: 751,
    currency: 'INR',
    isActive: true,
  },
  {
    id: 'addon-3',
    name: 'Maha Prasad Distribution (21 Devotee Boxes)',
    description: 'Confection of pure desi ghee Besan Ladoo / Panchamrit prasad packaged hygienically for guests.',
    price: 1500,
    currency: 'INR',
    isActive: true,
  },
  {
    id: 'addon-4',
    name: 'Additional Co-Priest (Upadhyay)',
    description: 'Assisting Vedic scholar for continuous mantra japa recitation and ritual preparation.',
    price: 2500,
    currency: 'INR',
    isActive: true,
  },
];

const initialPoojas: Pooja[] = [
  {
    id: 'pooja-1',
    categoryId: 'cat-1',
    categoryName: 'Vedic Pujas & Havans',
    name: 'Vedic Ganesh Puja & Havan',
    slug: 'ganesh-puja-havan',
    shortDescription: 'Invoke Lord Ganesha to remove obstacles, bring success, and bless new endeavors.',
    description: 'Lord Ganesha is the Pratham Pujya deity invoked before starting any auspicious milestone. This ritual incorporates Ganapati Sthapana, 108 recitation of Ganapati Atharvashirsha, Modak archana, and a sacred Agni Havan for prosperity and intellect.',
    purpose: 'Removing career, business, or education hindrances, initiating new ventures, and seeking domestic peace.',
    ritualRequirements: [
      'Devotee should wear clean, traditional attire (dhoti/kurta or saree)',
      'Clean wooden chowki or elevated platform facing East or North',
      'Fresh flowers (red hibiscus preferred) and 21 Durva grass blades',
      'Panchamrit (Milk, Curd, Ghee, Honey, Sugar) prepared fresh',
    ],
    instructions: 'The head of the family sits facing East. Fasting until the completion of Purnahuti is recommended for the Yajman.',
    durationMinutes: 120,
    defaultPanditId: 'pandit-1',
    allowCustomerPanditPreference: true,
    minAdvanceBookingHours: 12,
    maxAdvanceBookingDays: 60,
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Marathi', 'English', 'Gujarati'],
    supportedCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Thane'],
    imageUrl: ganeshImg,
    isActive: true,
    quote: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    allowCustomQuote: true,
    customQuoteStartingPrice: 11000,
    customQuoteNotes: 'Tailored Ganapati Atharvashirsha Sahasranama with 1008 Modak offering & extended Havan.',
    packages: [
      {
        id: 'pkg-101',
        poojaId: 'pooja-1',
        name: 'Basic Sankalp Package',
        description: 'Ideal for small apartments or simple family prayer with fundamental Vedic rituals.',
        price: 3100,
        currency: 'INR',
        durationMinutes: 90,
        panditCount: 1,
        includesSamagri: false,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 1,
        isActive: true,
        inclusions: [
          { id: 'inc-1', packageId: 'pkg-101', title: '1 Qualified Vedic Pandit', sortOrder: 1 },
          { id: 'inc-2', packageId: 'pkg-101', title: 'Complete Ganapati Sthapana & 16 Upchar Puja', sortOrder: 2 },
          { id: 'inc-3', packageId: 'pkg-101', title: 'Atharvashirsha Path Recitation', sortOrder: 3 },
          { id: 'inc-4', packageId: 'pkg-101', title: 'Dakshina included (Samagri by devotee)', sortOrder: 4 },
        ],
      },
      {
        id: 'pkg-102',
        poojaId: 'pooja-1',
        name: 'Standard Puja with Complete Samagri',
        description: 'Our most popular comprehensive ritual including all 36 sacred samagri items brought by the Pandit.',
        price: 5100,
        currency: 'INR',
        durationMinutes: 120,
        panditCount: 1,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 2,
        isActive: true,
        inclusions: [
          { id: 'inc-5', packageId: 'pkg-102', title: '1 Experienced Vedic Acharya', sortOrder: 1 },
          { id: 'inc-6', packageId: 'pkg-102', title: 'Full 36-item Premium Samagri kit provided', sortOrder: 2 },
          { id: 'inc-7', packageId: 'pkg-102', title: 'Sacred Havan with 108 Ahutis', sortOrder: 3 },
          { id: 'inc-8', packageId: 'pkg-102', title: 'Aarti, Prasad blessing, and Raksha Sutra', sortOrder: 4 },
          { id: 'inc-9', packageId: 'pkg-102', title: 'Dakshina & traveling expenses included', sortOrder: 5 },
        ],
      },
      {
        id: 'pkg-103',
        poojaId: 'pooja-1',
        name: 'Grand Maha Ganesha Havan (2 Pandits)',
        description: 'Elaborate ceremony with two priests, 1008 Modak Archana, and Maha Purnahuti.',
        price: 9100,
        currency: 'INR',
        durationMinutes: 180,
        panditCount: 2,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 3,
        isActive: true,
        inclusions: [
          { id: 'inc-10', packageId: 'pkg-103', title: '2 Vedic Priests (Mukhya Acharya + Upadhyay)', sortOrder: 1 },
          { id: 'inc-11', packageId: 'pkg-103', title: 'Full Premium Samagri, Dry Fruits & Ghee (3kg)', sortOrder: 2 },
          { id: 'inc-12', packageId: 'pkg-103', title: '1008 Modak/Durva Sahasranama Archana', sortOrder: 3 },
          { id: 'inc-13', packageId: 'pkg-103', title: 'Large Copper Havan Kund setup brought by priests', sortOrder: 4 },
          { id: 'inc-14', packageId: 'pkg-103', title: 'All Dakshina and transport fully covered', sortOrder: 5 },
        ],
      },
    ],
    addons: initialGlobalAddons,
  },
  {
    id: 'pooja-2',
    categoryId: 'cat-2',
    categoryName: 'Griha Pravesh & Vastu',
    name: 'Griha Pravesh & Vastu Shanti Puja',
    slug: 'griha-pravesh-vastu-shanti',
    shortDescription: 'Sanctify your new residence with Vastu Purusha invocation, Navgrah Havan, and auspicious threshold entry.',
    description: 'Entering a new residence requires pacifying planetary energies and honoring the Vastu Purusha. This extensive ceremony features Dwar Puja, Kalash Yatra, Milk Boiling ritual, Navgrah Sthapana, Vastu Mandala Havan, and Maha Purnahuti for happiness and harmony.',
    purpose: 'Blessing new homes, nullifying structural vastu flaws, invoking abundance, and dispelling negative vibrations.',
    ritualRequirements: [
      'Main entrance toran made of fresh mango leaves and marigold',
      'New brass or copper pot for the auspicious milk boiling ceremony',
      'Rangoli at main door threshold',
      'Clean space reserved in the Northeast (Ishanya) corner for the altar',
    ],
    instructions: 'Auspicious Muhurat will be verified by the Acharya prior to the ritual. Devotees should ensure electricity and water are functional.',
    durationMinutes: 180,
    defaultPanditId: 'pandit-1',
    allowCustomerPanditPreference: true,
    minAdvanceBookingHours: 24,
    maxAdvanceBookingDays: 90,
    supportedModes: ['HOME', 'VENUE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Marathi', 'Gujarati', 'Telugu'],
    supportedCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Thane'],
    imageUrl: grihaPraveshImg,
    isActive: true,
    quote: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं । विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ॥',
    allowCustomQuote: true,
    customQuoteStartingPrice: 18000,
    customQuoteNotes: 'Bespoke Vastu Mandala, 4-priest Havans, and multi-day ceremonies available upon request.',
    packages: [
      {
        id: 'pkg-201',
        poojaId: 'pooja-2',
        name: 'Standard Griha Pravesh & Havan',
        description: 'Complete ceremony with 1 Senior Pandit, Navgrah Havan, and threshold entrance ritual.',
        price: 7500,
        currency: 'INR',
        durationMinutes: 150,
        panditCount: 1,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 1,
        isActive: true,
        inclusions: [
          { id: 'inc-15', packageId: 'pkg-201', title: '1 Senior Vedic Pandit', sortOrder: 1 },
          { id: 'inc-16', packageId: 'pkg-201', title: 'Complete Griha Pravesh & Havan Samagri included', sortOrder: 2 },
          { id: 'inc-17', packageId: 'pkg-201', title: 'Dwar Puja, Gau Puja (symbolic), and Kalash Sthapana', sortOrder: 3 },
          { id: 'inc-18', packageId: 'pkg-201', title: 'Navgrah & Vastu Shanti Havan', sortOrder: 4 },
        ],
      },
      {
        id: 'pkg-202',
        poojaId: 'pooja-2',
        name: 'Premium Maha Vastu Shanti (2 Pandits)',
        description: 'Our signature grand ceremony featuring 2 Priests, Vastu Mandala drawing, and extensive Havan.',
        price: 12500,
        currency: 'INR',
        durationMinutes: 210,
        panditCount: 2,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 2,
        isActive: true,
        inclusions: [
          { id: 'inc-19', packageId: 'pkg-202', title: '2 Senior Vedic Acharyas', sortOrder: 1 },
          { id: 'inc-20', packageId: 'pkg-202', title: 'Exotic Vastu Shanti Samagri + 4kg Pure Cow Ghee', sortOrder: 2 },
          { id: 'inc-21', packageId: 'pkg-202', title: 'Vastu Purusha Sthapana & 81-pada Vastu Mandala', sortOrder: 3 },
          { id: 'inc-22', packageId: 'pkg-202', title: 'Navgrah, Rudra, and Kuber Ahutis', sortOrder: 4 },
          { id: 'inc-23', packageId: 'pkg-202', title: 'Shanti Path, Brahmin Bhojan packet distribution', sortOrder: 5 },
        ],
      },
    ],
    addons: initialGlobalAddons,
  },
  {
    id: 'pooja-3',
    categoryId: 'cat-3',
    categoryName: 'Rudrabhishek & Shiva Puja',
    name: 'Maha Rudrabhishek Puja',
    slug: 'maha-rudrabhishek-puja',
    shortDescription: 'Potent Vedic abhishek of Lord Shiva using sacred liquids accompanied by Namakam and Chamakam recitations.',
    description: 'Rudrabhishek is revered across ancient scriptures as one of the most powerful means to purify the mind, dispel karmic debts, and invite divine grace. Acharyas chant the 11 anuvakas of Sri Rudram while continuously offering holy Ganga jal, cow milk, sugarcane juice, honey, and panchamrit.',
    purpose: 'Health revitalization, liberation from chronic worries, spiritual elevation, and destruction of negative energies.',
    ritualRequirements: [
      'Shivling (Panchdhatu, Narmadeshwar, or Brass)',
      'Large brass or copper plate (abhishek patra) with drainage bowl',
      'Bel patra (Bilva leaves) - at least 21 or 108 fresh leaves',
      'Pure Gangajal, unboiled cow milk, pure honey, and bhasma/vibhuti',
    ],
    instructions: 'Fasting on fruits and milk prior to the puja is customary. White clothes are recommended.',
    durationMinutes: 120,
    defaultPanditId: 'pandit-2',
    allowCustomerPanditPreference: true,
    minAdvanceBookingHours: 12,
    maxAdvanceBookingDays: 60,
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Gujarati', 'English'],
    supportedCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Online'],
    imageUrl: rudrabhishekImg,
    isActive: true,
    quote: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    allowCustomQuote: true,
    customQuoteStartingPrice: 15000,
    customQuoteNotes: 'Atirudra, Maharudra, or temple-scale Linga Abhishek quotes available with live Vedic chanting choir.',
    packages: [
      {
        id: 'pkg-301',
        poojaId: 'pooja-3',
        name: 'Ekadasha Rudra Abhishek',
        description: 'Single Pandit recitation of Sri Rudram with Panchamrit Abhishek and Bilvashtakam.',
        price: 4500,
        currency: 'INR',
        durationMinutes: 100,
        panditCount: 1,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-2',
        sortOrder: 1,
        isActive: true,
        inclusions: [
          { id: 'inc-24', packageId: 'pkg-301', title: '1 Rudra-certified Pandit', sortOrder: 1 },
          { id: 'inc-25', packageId: 'pkg-301', title: 'Complete Abhishek Samagri (Ganga jal, Bhasma, Bel Patra)', sortOrder: 2 },
          { id: 'inc-26', packageId: 'pkg-301', title: '11 Namakam & Chamakam Vedic chants', sortOrder: 3 },
          { id: 'inc-27', packageId: 'pkg-301', title: 'Shiva Sahasranama Archana', sortOrder: 4 },
        ],
      },
      {
        id: 'pkg-302',
        poojaId: 'pooja-3',
        name: 'Laghurudra Abhishek with Havan (2 Pandits)',
        description: 'Deep transformative ritual featuring 2 Acharyas, 11 rounds of Sri Rudram, and consecrated Shiva Havan.',
        price: 9500,
        currency: 'INR',
        durationMinutes: 180,
        panditCount: 2,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-2',
        sortOrder: 2,
        isActive: true,
        inclusions: [
          { id: 'inc-28', packageId: 'pkg-302', title: '2 Senior Ved-Shastris', sortOrder: 1 },
          { id: 'inc-29', packageId: 'pkg-302', title: 'All Abhishek & Havan items included', sortOrder: 2 },
          { id: 'inc-30', packageId: 'pkg-302', title: 'Shiva Havan with Black Sesame, Ghee & Bilva Ahutis', sortOrder: 3 },
          { id: 'inc-31', packageId: 'pkg-302', title: 'Mahamrityunjaya Stotra Samput Path', sortOrder: 4 },
        ],
      },
    ],
    addons: initialGlobalAddons,
  },
  {
    id: 'pooja-4',
    categoryId: 'cat-1',
    categoryName: 'Vedic Pujas & Havans',
    name: 'Sri Satyanarayan Swami Puja & Katha',
    slug: 'satyanarayan-puja-katha',
    shortDescription: 'Traditional full-moon or auspicious occasion puja recounting the divine leelas of Lord Vishnu.',
    description: 'The Sri Satyanarayan Puja is a beloved household ritual celebrated on Purnima, birthdays, house purchases, or weddings. It bestows peace, protects the household from adversity, and involves reading the five sacred katha chapters alongside sweet Sheera prasad preparation.',
    purpose: 'Gratitude for fulfilled wishes, family togetherness, business prosperity, and spiritual contentment.',
    ritualRequirements: [
      'Wooden chowki wrapped in yellow or red cloth',
      'Fresh banana plant stems for decorating the altar posts',
      'Ingredients for Sheera / Panjiri Prasad (Semolina, Ghee, Sugar, Banana)',
      'Panchamrit and seasonal fruits',
    ],
    instructions: 'Katha is listened to together with all family members. Evening or morning time is suitable.',
    durationMinutes: 120,
    defaultPanditId: 'pandit-1',
    allowCustomerPanditPreference: true,
    minAdvanceBookingHours: 12,
    maxAdvanceBookingDays: 60,
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Marathi', 'Gujarati', 'Kannada', 'English'],
    supportedCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Thane'],
    imageUrl: satyanarayanImg,
    isActive: true,
    packages: [
      {
        id: 'pkg-401',
        poojaId: 'pooja-4',
        name: 'Standard Satyanarayan Puja (with Samagri)',
        description: 'Complete traditional katha recital, Navgrah Puja, and Aarti with full samagri brought by priest.',
        price: 4100,
        currency: 'INR',
        durationMinutes: 120,
        panditCount: 1,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 1,
        isActive: true,
        inclusions: [
          { id: 'inc-32', packageId: 'pkg-401', title: '1 Experienced Katha Pandit', sortOrder: 1 },
          { id: 'inc-33', packageId: 'pkg-401', title: 'All 32 Puja Samagri items included', sortOrder: 2 },
          { id: 'inc-34', packageId: 'pkg-401', title: 'Ganesh, Gauri, Navgrah & Vishnu Sthapana', sortOrder: 3 },
          { id: 'inc-35', packageId: 'pkg-401', title: 'Detailed 5 Chapters Satyanarayan Katha recital', sortOrder: 4 },
          { id: 'inc-36', packageId: 'pkg-401', title: 'Maha Mangal Aarti and Prasad distribution guidance', sortOrder: 5 },
        ],
      },
      {
        id: 'pkg-402',
        poojaId: 'pooja-4',
        name: 'Grand Satyanarayan Puja & Vishnu Sahasranama Havan',
        description: 'Includes extensive Havan at conclusion with Vishnu Sahasranama chanting and 2 priests.',
        price: 7500,
        currency: 'INR',
        durationMinutes: 165,
        panditCount: 2,
        includesSamagri: true,
        includesDakshina: true,
        defaultPanditId: 'pandit-1',
        sortOrder: 2,
        isActive: true,
        inclusions: [
          { id: 'inc-37', packageId: 'pkg-402', title: '2 Vedic Acharyas', sortOrder: 1 },
          { id: 'inc-38', packageId: 'pkg-402', title: 'Premium Samagri with Copper Havan Kund', sortOrder: 2 },
          { id: 'inc-39', packageId: 'pkg-402', title: 'Vishnu Sahasranama Path with 1008 Tulsi leaves', sortOrder: 3 },
          { id: 'inc-40', packageId: 'pkg-402', title: 'Full Havan and Purnahuti', sortOrder: 4 },
        ],
      },
    ],
    addons: initialGlobalAddons,
  },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Sunil Venkatesh Rao',
    email: 'sunil.rao@gmail.com',
    phone: '+91 98450 11223',
    countryCode: '+91',
    preferredLanguage: 'English',
    gotra: 'Kashyapa',
    sankalpNames: ['Sunil Rao', 'Radhika Rao', 'Aryan Rao'],
    createdAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'cust-2',
    fullName: 'Meenakshi Iyer',
    email: 'meenakshi.iyer@yahoo.co.in',
    phone: '+91 99203 88124',
    countryCode: '+91',
    preferredLanguage: 'Hindi',
    gotra: 'Bharadwaja',
    sankalpNames: ['Meenakshi Iyer', 'Sanjay Iyer'],
    createdAt: '2026-10-18T14:30:00.000Z',
  },
];

const initialBookings: Booking[] = [
  {
    id: 'booking-1',
    bookingReference: 'PB-2026-1048',
    customerId: 'cust-1',
    customer: initialCustomers[0],
    poojaId: 'pooja-1',
    poojaName: 'Vedic Ganesh Puja & Havan',
    packageId: 'pkg-102',
    packageName: 'Standard Puja with Complete Samagri',
    assignedPanditId: 'pandit-1',
    assignedPanditName: 'Pt. Rameshwar Sharma Shastri',
    defaultPanditIdAtBooking: 'pandit-1',
    bookingType: 'STANDARD',
    participantCount: 5,
    serviceMode: 'HOME',
    serviceAddress: {
      id: 'addr-1',
      customerId: 'cust-1',
      addressLine1: 'Flat 902, Emerald Towers, Hiranandani Estate',
      addressLine2: 'Ghodbunder Road',
      city: 'Thane',
      state: 'Maharashtra',
      postalCode: '400607',
      country: 'India',
    },
    preferredLanguage: 'Hindi',
    appointmentStartsAt: '2026-10-25T09:30:00.000Z',
    appointmentEndsAt: '2026-10-25T11:30:00.000Z',
    status: 'CONFIRMED',
    currency: 'INR',
    price: 5851, // Package 5100 + Addon 751
    packageSnapshot: {
      id: 'pkg-102',
      name: 'Standard Puja with Complete Samagri',
      price: 5100,
      durationMinutes: 120,
      panditCount: 1,
      includesSamagri: true,
      includesDakshina: true,
      inclusions: [
        '1 Experienced Vedic Acharya',
        'Full 36-item Premium Samagri kit provided',
        'Sacred Havan with 108 Ahutis',
        'Aarti, Prasad blessing, and Raksha Sutra',
      ],
    },
    selectedAddons: [
      {
        addonId: 'addon-2',
        name: 'Gau Seva & Green Fodder Seva',
        price: 751,
        quantity: 1,
      },
    ],
    customerNotes: 'Please ensure Pandit arrives 15 minutes prior for altar sthapana.',
    adminNotes: 'Verified with devotee. Pt. Rameshwar Sharma has confirmed punctuality.',
    createdAt: '2026-10-18T11:20:00.000Z',
    updatedAt: '2026-10-19T09:00:00.000Z',
    confirmedAt: '2026-10-19T09:00:00.000Z',
  },
  {
    id: 'booking-2',
    bookingReference: 'PB-2026-1049',
    customerId: 'cust-2',
    customer: initialCustomers[1],
    poojaId: 'pooja-3',
    poojaName: 'Maha Rudrabhishek Puja',
    packageId: 'pkg-301',
    packageName: 'Ekadasha Rudra Abhishek',
    assignedPanditId: 'pandit-2',
    assignedPanditName: 'Acharya Shrikant Joshi',
    defaultPanditIdAtBooking: 'pandit-2',
    bookingType: 'STANDARD',
    participantCount: 3,
    serviceMode: 'ONLINE',
    preferredLanguage: 'English',
    appointmentStartsAt: '2026-10-26T07:30:00.000Z',
    appointmentEndsAt: '2026-10-26T09:10:00.000Z',
    status: 'PENDING',
    currency: 'INR',
    price: 4500,
    packageSnapshot: {
      id: 'pkg-301',
      name: 'Ekadasha Rudra Abhishek',
      price: 4500,
      durationMinutes: 100,
      panditCount: 1,
      includesSamagri: true,
      includesDakshina: true,
      inclusions: [
        '1 Rudra-certified Pandit',
        'Complete Abhishek Samagri (Ganga jal, Bhasma, Bel Patra)',
        '11 Namakam & Chamakam Vedic chants',
      ],
    },
    selectedAddons: [],
    customerNotes: 'Conducting via Zoom from California. Please send the meeting link.',
    adminNotes: 'Online puja link to be shared 2 hours before ritual.',
    createdAt: '2026-10-21T08:15:00.000Z',
    updatedAt: '2026-10-21T08:15:00.000Z',
  },
  {
    id: 'booking-3',
    bookingReference: 'PB-2026-1050',
    customerId: 'cust-1',
    customer: initialCustomers[0],
    poojaName: 'Custom 3-Day Shrimad Bhagwat Saptah Parayan',
    bookingType: 'CUSTOM',
    customPoojaName: '3-Day Shrimad Bhagwat Saptah Parayan with 3 Pandits',
    customRequirements: 'Need 3 Pandits for continuous 3-day Bhagwat Gita & Purana recital at our community hall in Thane with daily evening havan.',
    participantCount: 35,
    serviceMode: 'VENUE',
    serviceAddress: {
      id: 'addr-2',
      customerId: 'cust-1',
      addressLine1: 'Community Hall, Sector 4, Vasant Vihar',
      city: 'Thane',
      state: 'Maharashtra',
      postalCode: '400610',
      country: 'India',
    },
    preferredLanguage: 'Hindi',
    appointmentStartsAt: '2026-11-05T09:00:00.000Z',
    appointmentEndsAt: '2026-11-07T18:00:00.000Z',
    status: 'AWAITING_CUSTOM_QUOTE',
    currency: 'INR',
    price: 0,
    selectedAddons: [],
    customerNotes: 'Please quote including lunch dakshina for pandits.',
    createdAt: '2026-10-22T14:40:00.000Z',
    updatedAt: '2026-10-22T14:40:00.000Z',
  },
];

const initialHistory: BookingHistory[] = [
  {
    id: 'hist-1',
    bookingId: 'booking-1',
    newStatus: 'PENDING',
    changedBy: 'Devotee (Sunil Rao)',
    eventType: 'CREATED',
    notes: 'Devotee submitted booking online with Standard Puja package.',
    createdAt: '2026-10-18T11:20:00.000Z',
  },
  {
    id: 'hist-2',
    bookingId: 'booking-1',
    previousStatus: 'PENDING',
    newStatus: 'CONFIRMED',
    previousPanditId: 'pandit-1',
    newPanditId: 'pandit-1',
    changedBy: 'Acharya Vidyadhar (Admin)',
    eventType: 'CONFIRMED',
    notes: 'Admin verified availability and confirmed appointment with Pt. Rameshwar Sharma.',
    createdAt: '2026-10-19T09:00:00.000Z',
  },
  {
    id: 'hist-3',
    bookingId: 'booking-2',
    newStatus: 'PENDING',
    changedBy: 'Devotee (Meenakshi Iyer)',
    eventType: 'CREATED',
    notes: 'Devotee requested online E-Pooja slot.',
    createdAt: '2026-10-21T08:15:00.000Z',
  },
  {
    id: 'hist-4',
    bookingId: 'booking-3',
    newStatus: 'AWAITING_CUSTOM_QUOTE',
    changedBy: 'Devotee (Sunil Rao)',
    eventType: 'CREATED',
    notes: 'Submitted custom quote request for 3-Day Shrimad Bhagwat Saptah.',
    createdAt: '2026-10-22T14:40:00.000Z',
  },
];

const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'notif-1',
    bookingId: 'booking-1',
    bookingReference: 'PB-2026-1048',
    notificationType: 'BOOKING_RECEIVED',
    recipient: 'sunil.rao@gmail.com',
    subject: 'Booking Received - Ganesh Puja [PB-2026-1048]',
    contentSnippet: 'Namaste Sunil Ji, your booking for Vedic Ganesh Puja & Havan on 25-Oct-2026 has been received.',
    status: 'SENT',
    attemptCount: 1,
    providerMessageId: 'smtp-msg-91823901',
    sentAt: '2026-10-18T11:20:05.000Z',
    createdAt: '2026-10-18T11:20:01.000Z',
  },
  {
    id: 'notif-2',
    bookingId: 'booking-1',
    bookingReference: 'PB-2026-1048',
    notificationType: 'CONFIRMATION',
    recipient: 'sunil.rao@gmail.com',
    subject: 'Appointment Confirmed! Pt. Rameshwar Sharma Assigned [PB-2026-1048]',
    contentSnippet: 'Your appointment is officially confirmed with Pt. Rameshwar Sharma for 25-Oct at 9:30 AM.',
    status: 'SENT',
    attemptCount: 1,
    providerMessageId: 'smtp-msg-91829910',
    sentAt: '2026-10-19T09:00:04.000Z',
    createdAt: '2026-10-19T09:00:01.000Z',
  },
  {
    id: 'notif-3',
    bookingId: 'booking-2',
    bookingReference: 'PB-2026-1049',
    notificationType: 'BOOKING_RECEIVED',
    recipient: 'meenakshi.iyer@yahoo.co.in',
    subject: 'Booking Acknowledged - Maha Rudrabhishek [PB-2026-1049]',
    contentSnippet: 'We have received your online ritual request. Admin verification in progress.',
    status: 'SENT',
    attemptCount: 1,
    providerMessageId: 'smtp-msg-91834411',
    sentAt: '2026-10-21T08:15:06.000Z',
    createdAt: '2026-10-21T08:15:02.000Z',
  },
];

const initialSettings: AppSettings = {
  businessName: 'Book My Pooja Online',
  helplinePhone: '+91 80000 77108',
  supportEmail: 'blessings@bookmypoojaonline.com',
  serviceAddress: 'Shri Vedic Sansthan Complex, 108 Temple Lane, Dadar West',
  serviceCity: 'Mumbai',
  globalDefaultPanditId: 'pandit-1',
  serviceTimeszone: 'Asia/Kolkata',
  minAdvanceBookingHours: 12,
  maxAdvanceBookingDays: 60,
  defaultSlotDurationMinutes: 120,
  slotIntervalMinutes: 60,
  cancellationAllowedBeforeHours: 24,
  enableCustomerPanditPreference: true,
};

// Data Store Class providing ACID-like transactional operations
class DataStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // In SSR or if local storage fails, fallback to defaults
    }
    return {
      adminUsers: initialAdminUsers,
      categories: initialCategories,
      poojas: initialPoojas,
      pandits: initialPandits,
      bookings: initialBookings,
      bookingHistory: initialHistory,
      customQuotes: [],
      notificationLogs: initialNotificationLogs,
      settings: initialSettings,
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore storage errors in sandbox
    }
  }

  // --- Query Methods ---

  public getCategories(): PoojaCategory[] {
    return this.state.categories;
  }

  public getCategoryBySlug(slug: string): PoojaCategory | undefined {
    return this.state.categories.find(c => c.slug === slug);
  }

  public getPoojas(filter?: { categorySlug?: string; mode?: string; search?: string }): Pooja[] {
    return this.state.poojas.filter(p => {
      if (!p.isActive) return false;
      if (filter?.categorySlug) {
        const cat = this.state.categories.find(c => c.slug === filter.categorySlug);
        if (cat && p.categoryId !== cat.id) return false;
      }
      if (filter?.mode && !p.supportedModes.includes(filter.mode as any)) {
        return false;
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        const match = p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }

  public getPoojaBySlug(slug: string): Pooja | undefined {
    return this.state.poojas.find(p => p.slug === slug);
  }

  public getPoojaById(id: string): Pooja | undefined {
    return this.state.poojas.find(p => p.id === id);
  }

  public getPandits(): Pandit[] {
    return this.state.pandits.filter(p => p.isActive);
  }

  public getAllPanditsAdmin(): Pandit[] {
    return this.state.pandits;
  }

  public getPanditById(id: string): Pandit | undefined {
    return this.state.pandits.find(p => p.id === id);
  }

  public getBookings(): Booking[] {
    return [...this.state.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBookingByReference(ref: string): Booking | undefined {
    return this.state.bookings.find(b => b.bookingReference.toLowerCase() === ref.trim().toLowerCase());
  }

  public getBookingById(id: string): Booking | undefined {
    return this.state.bookings.find(b => b.id === id);
  }

  public getBookingHistory(bookingId: string): BookingHistory[] {
    return this.state.bookingHistory
      .filter(h => h.bookingId === bookingId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public getCustomQuotes(): CustomQuote[] {
    return this.state.customQuotes;
  }

  public getNotificationLogs(): NotificationLog[] {
    return [...this.state.notificationLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSettings(): AppSettings {
    return this.state.settings;
  }

  public getDashboardStats(): DashboardStats {
    const today = new Date().toISOString().slice(0, 10);
    const bookings = this.state.bookings;

    const todayBookings = bookings.filter(b => b.appointmentStartsAt.startsWith(today)).length;
    const upcomingAppointments = bookings.filter(b => 
      ['CONFIRMED', 'RESCHEDULED'].includes(b.status) && new Date(b.appointmentStartsAt) >= new Date()
    ).length;
    const pendingConfirmations = bookings.filter(b => b.status === 'PENDING').length;
    const awaitingCustomQuotes = bookings.filter(b => b.status === 'AWAITING_CUSTOM_QUOTE').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const activePanditsCount = this.state.pandits.filter(p => p.isActive).length;

    const confirmedRevenue = bookings
      .filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status))
      .reduce((acc, curr) => acc + (curr.price || 0), 0);

    return {
      totalBookings: bookings.length,
      todayBookings,
      upcomingAppointments,
      pendingConfirmations,
      awaitingCustomQuotes,
      confirmedRevenue,
      activePanditsCount,
      completedBookings,
    };
  }

  // --- Slot Availability & Conflict Engine ---

  /**
   * Resolves the default pandit based on strict priority:
   * 1. Package-level default Pandit
   * 2. Pooja-level default Pandit
   * 3. Global default Pandit
   * 4. First eligible Pandit
   */
  public resolveDefaultPandit(poojaId: string, packageId?: string): Pandit | undefined {
    const pooja = this.getPoojaById(poojaId);
    if (!pooja) return undefined;

    // 1. Package default
    if (packageId) {
      const pkg = pooja.packages.find(p => p.id === packageId);
      if (pkg?.defaultPanditId) {
        const pandit = this.getPanditById(pkg.defaultPanditId);
        if (pandit && pandit.isActive) return pandit;
      }
    }

    // 2. Pooja default
    if (pooja.defaultPanditId) {
      const pandit = this.getPanditById(pooja.defaultPanditId);
      if (pandit && pandit.isActive) return pandit;
    }

    // 3. Global default
    if (this.state.settings.globalDefaultPanditId) {
      const pandit = this.getPanditById(this.state.settings.globalDefaultPanditId);
      if (pandit && pandit.isActive && pandit.eligiblePoojaIds.includes(poojaId)) return pandit;
    }

    // 4. First available eligible
    return this.state.pandits.find(p => p.isActive && p.eligiblePoojaIds.includes(poojaId));
  }

  /**
   * Checks if a Pandit has a scheduling conflict or blocked date in interval [startsAt, endsAt]
   */
  public hasPanditConflict(panditId: string, startsAt: Date, endsAt: Date, excludeBookingId?: string): { hasConflict: boolean; reason?: string } {
    const pandit = this.getPanditById(panditId);
    if (!pandit || !pandit.isActive) {
      return { hasConflict: true, reason: 'Selected Pandit is currently inactive or not found.' };
    }

    // 1. Check blocked dates / leaves
    for (const block of pandit.blockedDates) {
      const bStart = new Date(block.startsAt);
      const bEnd = new Date(block.endsAt);
      if (startsAt < bEnd && endsAt > bStart) {
        return { hasConflict: true, reason: `Pandit is on leave (${block.reason}) during this period.` };
      }
    }

    // 2. Check weekly working hours schedule
    const dayOfWeek = startsAt.getDay(); // 0-6
    const schedule = pandit.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
    if (!schedule) {
      return { hasConflict: true, reason: 'Pandit does not accept bookings on this day of the week.' };
    }

    const startHourMin = startsAt.toTimeString().slice(0, 5); // "HH:MM"
    const endHourMin = endsAt.toTimeString().slice(0, 5);
    if (startHourMin < schedule.startTime || endHourMin > schedule.endTime) {
      return { hasConflict: true, reason: `Requested slot is outside Pandit working hours (${schedule.startTime} - ${schedule.endTime}).` };
    }

    // 3. Check overlapping confirmed or in-progress bookings
    for (const b of this.state.bookings) {
      if (excludeBookingId && b.id === excludeBookingId) continue;
      if (['CANCELLED'].includes(b.status)) continue; // Cancelled appointments free up the slot
      if (b.assignedPanditId === panditId) {
        const bStart = new Date(b.appointmentStartsAt);
        const bEnd = new Date(b.appointmentEndsAt);
        // Overlap test: StartA < EndB and EndA > StartB
        if (startsAt < bEnd && endsAt > bStart) {
          return {
            hasConflict: true,
            reason: `Pandit already has an active appointment (${b.bookingReference}) booked between ${bStart.toLocaleTimeString()} and ${bEnd.toLocaleTimeString()}.`,
          };
        }
      }
    }

    return { hasConflict: false };
  }

  /**
   * Generates bookable slots for a specific date and duration, with conflict verification
   */
  public getAvailableSlots(dateStr: string, durationMinutes: number, poojaId?: string, preferredPanditId?: string) {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay();

    // Standard Vedic slot hours: 07:00, 08:30, 10:00, 11:30, 14:00, 15:30, 17:00, 18:30
    const slotTimes = ['07:00', '08:30', '10:00', '11:30', '14:00', '15:30', '17:00', '18:30'];

    const targetPandit = preferredPanditId 
      ? this.getPanditById(preferredPanditId) 
      : (poojaId ? this.resolveDefaultPandit(poojaId) : this.state.pandits[0]);

    return slotTimes.map(timeStr => {
      const [h, m] = timeStr.split(':').map(Number);
      const slotStart = new Date(targetDate);
      slotStart.setHours(h, m, 0, 0);

      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

      let isAvailable = true;
      let conflictReason: string | undefined;

      if (targetPandit) {
        const check = this.hasPanditConflict(targetPandit.id, slotStart, slotEnd);
        if (check.hasConflict) {
          isAvailable = false;
          conflictReason = check.reason;
        }
      }

      return {
        time: timeStr,
        startsAt: slotStart.toISOString(),
        endsAt: slotEnd.toISOString(),
        isAvailable,
        conflictReason,
        panditAssigned: targetPandit?.fullName,
      };
    });
  }

  // --- Transactional Booking Life Cycle ---

  public createBooking(data: {
    bookingType: 'STANDARD' | 'CUSTOM';
    poojaId?: string;
    packageId?: string;
    customPoojaName?: string;
    customRequirements?: string;
    customer: {
      fullName: string;
      email?: string;
      phone: string;
      countryCode: string;
      preferredLanguage: string;
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
  }): { booking: Booking; error?: string } {
    // 1. Idempotency Check
    if (data.idempotencyKey) {
      const existing = this.state.bookings.find(b => b.idempotencyKey === data.idempotencyKey);
      if (existing) {
        return { booking: existing };
      }
    }

    let pooja: Pooja | undefined;
    let selectedPackage: PoojaPackage | undefined;
    let durationMinutes = 120;
    let basePrice = 0;
    let poojaName = data.customPoojaName || 'Special Custom Vedic Ceremony';

    if (data.bookingType === 'STANDARD') {
      if (!data.poojaId) return { booking: null as any, error: 'Pooja is required for standard booking.' };
      pooja = this.getPoojaById(data.poojaId);
      if (!pooja) return { booking: null as any, error: 'Pooja not found.' };
      poojaName = pooja.name;

      if (!data.packageId) return { booking: null as any, error: 'Package selection is required.' };
      selectedPackage = pooja.packages.find(p => p.id === data.packageId);
      if (!selectedPackage) return { booking: null as any, error: 'Selected package not found.' };

      durationMinutes = selectedPackage.durationMinutes;
      basePrice = selectedPackage.price;
    }

    // 2. Resolve Pandit
    let targetPanditId = data.preferredPanditId;
    if (!targetPanditId && pooja) {
      const resolved = this.resolveDefaultPandit(pooja.id, selectedPackage?.id);
      targetPanditId = resolved?.id;
    }

    const assignedPandit = targetPanditId ? this.getPanditById(targetPanditId) : undefined;

    // 3. Calculate Appointment Duration & Check Conflict
    const startsAt = new Date(data.appointmentStartsAt);
    const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);

    if (assignedPandit && data.bookingType === 'STANDARD') {
      const conflict = this.hasPanditConflict(assignedPandit.id, startsAt, endsAt);
      if (conflict.hasConflict) {
        return { booking: null as any, error: `Appointment Conflict: ${conflict.reason}` };
      }
    }

    // 4. Calculate Add-ons
    const selectedAddons: Booking['selectedAddons'] = [];
    let addonsTotal = 0;
    if (data.selectedAddonIds && data.selectedAddonIds.length > 0) {
      for (const aId of data.selectedAddonIds) {
        const found = initialGlobalAddons.find(a => a.id === aId);
        if (found) {
          selectedAddons.push({
            addonId: found.id,
            name: found.name,
            price: found.price,
            quantity: 1,
          });
          addonsTotal += found.price;
        }
      }
    }

    const totalPrice = data.bookingType === 'STANDARD' ? basePrice + addonsTotal : 0;

    // 5. Create or reuse Customer
    const customerId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id: customerId,
      fullName: data.customer.fullName,
      email: data.customer.email || '',
      phone: data.customer.phone,
      countryCode: data.customer.countryCode || '+91',
      preferredLanguage: data.customer.preferredLanguage || 'Hindi',
      gotra: data.customer.gotra,
      rashi: data.customer.rashi,
      dateOfBirth: data.customer.dateOfBirth,
      birthPlace: data.customer.birthPlace,
      sankalpNames: data.customer.sankalpNames,
      createdAt: new Date().toISOString(),
    };

    // 6. Generate Human-Readable Booking Reference: PB-YYYYMMDD-XXXX
    const datePart = startsAt.toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `PB-${datePart}-${randPart}`;

    const newBookingId = `booking-${Date.now()}`;
    const initialStatus: BookingStatus = data.bookingType === 'CUSTOM' ? 'AWAITING_CUSTOM_QUOTE' : 'PENDING';

    const newBooking: Booking = {
      id: newBookingId,
      bookingReference,
      customerId,
      customer: newCustomer,
      poojaId: pooja?.id,
      poojaName,
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.name,
      assignedPanditId: assignedPandit?.id,
      assignedPanditName: assignedPandit?.fullName,
      defaultPanditIdAtBooking: assignedPandit?.id,
      bookingType: data.bookingType,
      customPoojaName: data.customPoojaName,
      customRequirements: data.customRequirements,
      participantCount: 1,
      serviceMode: data.serviceMode,
      serviceAddress: data.serviceAddress ? { id: `addr-${Date.now()}`, customerId, ...data.serviceAddress } : undefined,
      preferredLanguage: data.customer.preferredLanguage || 'Hindi',
      appointmentStartsAt: startsAt.toISOString(),
      appointmentEndsAt: endsAt.toISOString(),
      status: initialStatus,
      currency: 'INR',
      price: totalPrice,
      packageSnapshot: selectedPackage ? {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
        durationMinutes: selectedPackage.durationMinutes,
        panditCount: selectedPackage.panditCount,
        includesSamagri: selectedPackage.includesSamagri,
        includesDakshina: selectedPackage.includesDakshina,
        inclusions: selectedPackage.inclusions.map(i => i.title),
      } : undefined,
      selectedAddons,
      customerNotes: data.customerNotes,
      idempotencyKey: data.idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Commit transaction to state
    this.state.bookings.push(newBooking);

    // Record initial history event
    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId: newBookingId,
      newStatus: initialStatus,
      changedBy: `Devotee (${newCustomer.fullName})`,
      eventType: 'CREATED',
      notes: data.bookingType === 'CUSTOM' ? 'Custom ritual inquiry submitted for quotation.' : 'Standard ceremony booked online.',
      createdAt: new Date().toISOString(),
    });

    // Record Outbox Notification
    this.state.notificationLogs.push({
      id: `notif-${Date.now()}`,
      bookingId: newBookingId,
      bookingReference,
      notificationType: data.bookingType === 'CUSTOM' ? 'CUSTOM_QUOTE' : 'BOOKING_RECEIVED',
      recipient: newCustomer.email,
      subject: `Booking Request Received [${bookingReference}] - ${poojaName}`,
      contentSnippet: `Namaste ${newCustomer.fullName}, your booking request for ${poojaName} has been received into the queue.`,
      status: 'SENT',
      attemptCount: 1,
      providerMessageId: `smtp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { booking: newBooking };
  }

  public confirmBooking(bookingId: string, adminName: string, notes?: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (!['PENDING', 'RESCHEDULED'].includes(booking.status)) {
      return { success: false, error: `Cannot confirm booking in '${booking.status}' status.` };
    }

    if (!booking.assignedPanditId) {
      return { success: false, error: 'Cannot confirm appointment without an assigned Pandit.' };
    }

    // Recheck conflict
    const conflict = this.hasPanditConflict(
      booking.assignedPanditId,
      new Date(booking.appointmentStartsAt),
      new Date(booking.appointmentEndsAt),
      booking.id
    );
    if (conflict.hasConflict) {
      return { success: false, error: `Cannot confirm: ${conflict.reason}` };
    }

    const prevStatus = booking.status;
    booking.status = 'CONFIRMED';
    booking.confirmedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    if (notes) booking.adminNotes = (booking.adminNotes ? booking.adminNotes + '\n' : '') + notes;

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      previousStatus: prevStatus,
      newStatus: 'CONFIRMED',
      changedBy: adminName,
      eventType: 'CONFIRMED',
      notes: notes || 'Admin approved booking and confirmed Pandit assignment.',
      createdAt: new Date().toISOString(),
    });

    this.state.notificationLogs.push({
      id: `notif-${Date.now()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      notificationType: 'CONFIRMATION',
      recipient: booking.customer.email,
      subject: `Appointment Confirmed! [${booking.bookingReference}] - ${booking.poojaName}`,
      contentSnippet: `Your ceremony is confirmed for ${new Date(booking.appointmentStartsAt).toLocaleDateString()}. Assigned Pandit: ${booking.assignedPanditName}.`,
      status: 'SENT',
      attemptCount: 1,
      providerMessageId: `smtp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  public rescheduleBooking(bookingId: string, newStartsAtISO: string, adminName: string, notes?: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const oldDuration = new Date(booking.appointmentEndsAt).getTime() - new Date(booking.appointmentStartsAt).getTime();
    const newStarts = new Date(newStartsAtISO);
    const newEnds = new Date(newStarts.getTime() + oldDuration);

    if (booking.assignedPanditId) {
      const conflict = this.hasPanditConflict(booking.assignedPanditId, newStarts, newEnds, booking.id);
      if (conflict.hasConflict) {
        return { success: false, error: `Cannot reschedule: ${conflict.reason}` };
      }
    }

    const oldStarts = booking.appointmentStartsAt;
    booking.appointmentStartsAt = newStarts.toISOString();
    booking.appointmentEndsAt = newEnds.toISOString();
    const prevStatus = booking.status;
    booking.status = 'RESCHEDULED';
    booking.updatedAt = new Date().toISOString();

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      previousStatus: prevStatus,
      newStatus: 'RESCHEDULED',
      previousAppointmentStartsAt: oldStarts,
      newAppointmentStartsAt: newStarts.toISOString(),
      changedBy: adminName,
      eventType: 'RESCHEDULED',
      notes: notes || `Rescheduled from ${new Date(oldStarts).toLocaleString()} to ${newStarts.toLocaleString()}`,
      createdAt: new Date().toISOString(),
    });

    this.state.notificationLogs.push({
      id: `notif-${Date.now()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      notificationType: 'RESCHEDULED',
      recipient: booking.customer.email,
      subject: `Ceremony Rescheduled [${booking.bookingReference}] - ${booking.poojaName}`,
      contentSnippet: `Your ceremony has been rescheduled to ${newStarts.toLocaleString()}.`,
      status: 'SENT',
      attemptCount: 1,
      providerMessageId: `smtp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  public reassignPandit(bookingId: string, newPanditId: string, adminName: string, notes?: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const newPandit = this.getPanditById(newPanditId);
    if (!newPandit) return { success: false, error: 'Target Pandit not found.' };

    // Check conflict
    const conflict = this.hasPanditConflict(
      newPandit.id,
      new Date(booking.appointmentStartsAt),
      new Date(booking.appointmentEndsAt),
      booking.id
    );
    if (conflict.hasConflict) {
      return { success: false, error: `Cannot reassign: ${conflict.reason}` };
    }

    const oldPanditId = booking.assignedPanditId;
    booking.assignedPanditId = newPandit.id;
    booking.assignedPanditName = newPandit.fullName;
    booking.updatedAt = new Date().toISOString();

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      previousPanditId: oldPanditId,
      newPanditId: newPandit.id,
      newStatus: booking.status,
      changedBy: adminName,
      eventType: 'REASSIGNED',
      notes: notes || `Reassigned Pandit to ${newPandit.fullName}`,
      createdAt: new Date().toISOString(),
    });

    this.state.notificationLogs.push({
      id: `notif-${Date.now()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      notificationType: 'PANDIT_ASSIGNED',
      recipient: booking.customer.email,
      subject: `Pandit Assigned [${booking.bookingReference}] - ${newPandit.fullName}`,
      contentSnippet: `Your ceremony will be conducted by ${newPandit.fullName}.`,
      status: 'SENT',
      attemptCount: 1,
      providerMessageId: `smtp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  public cancelBooking(bookingId: string, adminName: string, reason: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const prevStatus = booking.status;
    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      previousStatus: prevStatus,
      newStatus: 'CANCELLED',
      changedBy: adminName,
      eventType: 'CANCELLED',
      notes: `Cancellation reason: ${reason}`,
      createdAt: new Date().toISOString(),
    });

    this.state.notificationLogs.push({
      id: `notif-${Date.now()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      notificationType: 'CANCELLED',
      recipient: booking.customer.email,
      subject: `Booking Cancellation Notice [${booking.bookingReference}]`,
      contentSnippet: `Your booking has been cancelled. Reason: ${reason}.`,
      status: 'SENT',
      attemptCount: 1,
      providerMessageId: `smtp-${Date.now()}`,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  public completeBooking(bookingId: string, adminName: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const prevStatus = booking.status;
    booking.status = 'COMPLETED';
    booking.completedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      previousStatus: prevStatus,
      newStatus: 'COMPLETED',
      changedBy: adminName,
      eventType: 'COMPLETED',
      notes: 'Ceremony successfully performed and concluded with Purnahuti blessings.',
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  public addBookingNote(bookingId: string, adminName: string, note: string): { success: boolean; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    booking.adminNotes = (booking.adminNotes ? booking.adminNotes + '\n' : '') + `[${new Date().toLocaleDateString()} ${adminName}]: ${note}`;
    booking.updatedAt = new Date().toISOString();

    this.state.bookingHistory.push({
      id: `hist-${Date.now()}`,
      bookingId,
      newStatus: booking.status,
      changedBy: adminName,
      eventType: 'NOTE_ADDED',
      notes: note,
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return { success: true };
  }

  // --- Custom Quote Workflows ---

  public createCustomQuote(data: {
    bookingId: string;
    proposedAmount: number;
    quoteDetails: string;
    exclusions?: string;
    assignedPanditId?: string;
  }): CustomQuote {
    const booking = this.getBookingById(data.bookingId);
    const newQuote: CustomQuote = {
      id: `quote-${Date.now()}`,
      bookingId: data.bookingId,
      bookingReference: booking?.bookingReference || 'PB-CUSTOM',
      customerName: booking?.customer.fullName || 'Devotee',
      customerPhone: booking?.customer.phone || '',
      customPoojaName: booking?.customPoojaName || booking?.poojaName || 'Custom Pooja',
      version: 1,
      proposedAmount: data.proposedAmount,
      currency: 'INR',
      quoteDetails: data.quoteDetails,
      exclusions: data.exclusions,
      status: 'SENT',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedPanditId: data.assignedPanditId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.customQuotes.unshift(newQuote);

    if (booking) {
      booking.status = 'QUOTE_SENT';
      booking.price = data.proposedAmount;
      booking.approvedQuoteAmount = data.proposedAmount;
      if (data.assignedPanditId) {
        const p = this.getPanditById(data.assignedPanditId);
        if (p) {
          booking.assignedPanditId = p.id;
          booking.assignedPanditName = p.fullName;
        }
      }
      booking.updatedAt = new Date().toISOString();

      this.state.bookingHistory.push({
        id: `hist-${Date.now()}`,
        bookingId: booking.id,
        newStatus: 'QUOTE_SENT',
        changedBy: 'Admin',
        eventType: 'QUOTE_SENT',
        notes: `Quotation sent: ₹${data.proposedAmount}. ${data.quoteDetails}`,
        createdAt: new Date().toISOString(),
      });

      this.state.notificationLogs.push({
        id: `notif-${Date.now()}`,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        notificationType: 'CUSTOM_QUOTE',
        recipient: booking.customer.email,
        subject: `Quotation Prepared for ${booking.customPoojaName} [${booking.bookingReference}]`,
        contentSnippet: `We have prepared an official quote of ₹${data.proposedAmount} for your custom ritual request.`,
        status: 'SENT',
        attemptCount: 1,
        providerMessageId: `smtp-${Date.now()}`,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    this.persist();
    return newQuote;
  }

  public acceptCustomQuote(quoteId: string): boolean {
    const quote = this.state.customQuotes.find(q => q.id === quoteId);
    if (!quote) return false;

    quote.status = 'ACCEPTED';
    quote.acceptedAt = new Date().toISOString();

    const booking = this.getBookingById(quote.bookingId);
    if (booking) {
      booking.status = 'CONFIRMED';
      booking.price = quote.proposedAmount;
      booking.confirmedAt = new Date().toISOString();
      booking.updatedAt = new Date().toISOString();

      this.state.bookingHistory.push({
        id: `hist-${Date.now()}`,
        bookingId: booking.id,
        newStatus: 'CONFIRMED',
        changedBy: 'Devotee & Admin',
        eventType: 'CONFIRMED',
        notes: `Quote accepted (₹${quote.proposedAmount}). Booking confirmed.`,
        createdAt: new Date().toISOString(),
      });
    }

    this.persist();
    return true;
  }

  // --- Catalog Administration ---

  public upsertCategory(cat: Partial<PoojaCategory>): PoojaCategory {
    const existingIndex = this.state.categories.findIndex(c => c.id === cat.id);
    if (existingIndex >= 0) {
      this.state.categories[existingIndex] = { ...this.state.categories[existingIndex], ...cat } as PoojaCategory;
      this.persist();
      return this.state.categories[existingIndex];
    } else {
      const newCat: PoojaCategory = {
        id: `cat-${Date.now()}`,
        name: cat.name || 'New Category',
        slug: (cat.name || 'new-category').toLowerCase().replace(/\s+/g, '-'),
        description: cat.description || '',
        imageUrl: cat.imageUrl || ganeshImg,
        sortOrder: this.state.categories.length + 1,
        isActive: true,
        poojaCount: 0,
      };
      this.state.categories.push(newCat);
      this.persist();
      return newCat;
    }
  }

  public upsertPooja(poojaData: Partial<Pooja>): Pooja {
    const existingIndex = this.state.poojas.findIndex(p => p.id === poojaData.id);
    if (existingIndex >= 0) {
      this.state.poojas[existingIndex] = { ...this.state.poojas[existingIndex], ...poojaData } as Pooja;
      this.persist();
      return this.state.poojas[existingIndex];
    } else {
      const newPooja: Pooja = {
        id: `pooja-${Date.now()}`,
        categoryId: poojaData.categoryId || 'cat-1',
        name: poojaData.name || 'New Vedic Ceremony',
        slug: (poojaData.name || 'new-ceremony').toLowerCase().replace(/\s+/g, '-'),
        shortDescription: poojaData.shortDescription || 'Auspicious ritual for blessings and prosperity.',
        description: poojaData.description || 'Full ceremonial Vedic rituals conducted by authenticated Pandits.',
        purpose: poojaData.purpose || 'Spiritual peace and material well-being.',
        ritualRequirements: poojaData.ritualRequirements || ['Fresh flowers', 'Copper kalash', 'Fruits'],
        instructions: poojaData.instructions || 'Fasting recommended for Yajman.',
        durationMinutes: poojaData.durationMinutes || 120,
        defaultPanditId: poojaData.defaultPanditId || 'pandit-1',
        allowCustomerPanditPreference: true,
        minAdvanceBookingHours: 12,
        maxAdvanceBookingDays: 60,
        supportedModes: poojaData.supportedModes || ['HOME', 'VENUE', 'ONLINE'],
        supportedLanguages: ['Hindi', 'Sanskrit', 'English'],
        supportedCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune'],
        imageUrl: poojaData.imageUrl || ganeshImg,
        isActive: poojaData.isActive ?? true,
        quote: poojaData.quote || 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
        allowCustomQuote: poojaData.allowCustomQuote ?? true,
        customQuoteStartingPrice: poojaData.customQuoteStartingPrice || 11000,
        customQuoteNotes: poojaData.customQuoteNotes || 'Custom ritual scope with dedicated Vedic Acharyas and bespoke samagri.',
        packages: poojaData.packages || [
          {
            id: `pkg-${Date.now()}`,
            poojaId: `pooja-${Date.now()}`,
            name: 'Standard Samagri Package',
            description: 'Complete ceremony with 1 Pandit and full Samagri.',
            price: 5100,
            currency: 'INR',
            durationMinutes: 120,
            panditCount: 1,
            includesSamagri: true,
            includesDakshina: true,
            sortOrder: 1,
            isActive: true,
            inclusions: [
              { id: `inc-1`, packageId: `pkg-${Date.now()}`, title: '1 Qualified Pandit', sortOrder: 1 },
              { id: `inc-2`, packageId: `pkg-${Date.now()}`, title: 'All Ritual Samagri included', sortOrder: 2 },
            ],
          },
        ],
        addons: initialGlobalAddons,
      };
      this.state.poojas.push(newPooja);
      this.persist();
      return newPooja;
    }
  }

  public upsertPandit(panditData: Partial<Pandit>): Pandit {
    const existingIndex = this.state.pandits.findIndex(p => p.id === panditData.id);
    if (existingIndex >= 0) {
      this.state.pandits[existingIndex] = { ...this.state.pandits[existingIndex], ...panditData } as Pandit;
      this.persist();
      return this.state.pandits[existingIndex];
    } else {
      const newPandit: Pandit = {
        id: `pandit-${Date.now()}`,
        fullName: panditData.fullName || 'Vedic Shastri',
        email: panditData.email || 'priest@vedictrust.org',
        phone: panditData.phone || '+91 98000 00000',
        profileImage: panditData.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
        biography: panditData.biography || 'Devoted Vedic scholar with rigorous Gurukul training.',
        experienceYears: panditData.experienceYears || 10,
        specializations: panditData.specializations || ['Vedic Pujas', 'Havans'],
        languages: panditData.languages || ['Hindi', 'Sanskrit'],
        serviceAreas: panditData.serviceAreas || ['Mumbai', 'Delhi NCR', 'Online'],
        supportedModes: ['HOME', 'VENUE', 'ONLINE'],
        eligiblePoojaIds: ['pooja-1', 'pooja-2'],
        isActive: true,
        weeklySchedule: [
          { id: `sch-new-0`, panditId: `pandit-${Date.now()}`, dayOfWeek: 0, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-1`, panditId: `pandit-${Date.now()}`, dayOfWeek: 1, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-2`, panditId: `pandit-${Date.now()}`, dayOfWeek: 2, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-3`, panditId: `pandit-${Date.now()}`, dayOfWeek: 3, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-4`, panditId: `pandit-${Date.now()}`, dayOfWeek: 4, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-5`, panditId: `pandit-${Date.now()}`, dayOfWeek: 5, startTime: '07:00', endTime: '19:00', isActive: true },
          { id: `sch-new-6`, panditId: `pandit-${Date.now()}`, dayOfWeek: 6, startTime: '07:00', endTime: '19:00', isActive: true },
        ],
        blockedDates: [],
      };
      this.state.pandits.push(newPandit);
      this.persist();
      return newPandit;
    }
  }

  public addPanditBlockedDate(panditId: string, startsAt: string, endsAt: string, reason: string): boolean {
    const pandit = this.getPanditById(panditId);
    if (!pandit) return false;

    pandit.blockedDates.push({
      id: `blk-${Date.now()}`,
      panditId,
      startsAt,
      endsAt,
      reason,
      createdAt: new Date().toISOString(),
    });

    this.persist();
    return true;
  }

  public deletePandit(panditId: string): { success: boolean; error?: string } {
    const panditIndex = this.state.pandits.findIndex(p => p.id === panditId);
    if (panditIndex < 0) {
      return { success: false, error: 'Pandit not found' };
    }

    // Check if assigned to any active bookings
    const activeBookings = this.state.bookings.filter(
      b => b.assignedPanditId === panditId && ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(b.status)
    );

    if (activeBookings.length > 0) {
      const refs = activeBookings.map(b => b.bookingReference).slice(0, 3).join(', ');
      return {
        success: false,
        error: `Cannot delete: Priest has ${activeBookings.length} active appointment(s) [${refs}]. Reassign their appointments or mark the priest inactive.`,
      };
    }

    this.state.pandits.splice(panditIndex, 1);
    this.persist();
    return { success: true };
  }

  public updatePanditSchedule(panditId: string, weeklySchedule: any[]): boolean {
    const pandit = this.getPanditById(panditId);
    if (!pandit) return false;
    pandit.weeklySchedule = weeklySchedule;
    this.persist();
    return true;
  }

  public removePanditBlockedDate(panditId: string, blockedDateId: string): boolean {
    const pandit = this.getPanditById(panditId);
    if (!pandit) return false;
    pandit.blockedDates = pandit.blockedDates.filter(b => b.id !== blockedDateId);
    this.persist();
    return true;
  }

  public retryNotification(notifId: string): boolean {
    const notif = this.state.notificationLogs.find(n => n.id === notifId);
    if (!notif) return false;

    notif.attemptCount += 1;
    notif.status = 'SENT';
    notif.errorMessage = undefined;
    notif.sentAt = new Date().toISOString();
    this.persist();
    return true;
  }

  public updateSettings(newSettings: Partial<AppSettings>): AppSettings {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.persist();
    return this.state.settings;
  }
}

export const db = new DataStore();
