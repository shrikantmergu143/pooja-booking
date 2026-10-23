# Pooja Booking & Pandit Appointment Management System

A production-grade, full-stack devotional ceremony booking and appointment management platform inspired by bookmypoojaonline.com. This application enables devotees to seamlessly discover Vedic rituals, compare packages, verify live slot and Pandit availability, and secure standard or custom appointments, while equipping temple administrators with an authoritative dashboard for catalog management, conflict-free scheduling, quote authoring, and notification auditing.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been established based on your feedback and architectural requirements:

- **Confirmed Decision 1 (Booking Workflow Focus)**: Standard package bookings are prioritized for core stabilization, providing an end-to-end multi-step stepper, live slot discovery, transparent samagri/dakshina breakdowns, and instant reference generation. Custom quote requests are supported with review states and quotation drafting.
- **Confirmed Decision 2 (Administrative Priority)**: Catalog management (Categories, Poojas, Packages, Add-ons, and Pandit eligibility profiles) is prioritized to ensure rich, accurate domain data powers the customer booking engine from day one.
- **Decision 3 (Runtime & Architecture)**: Full-stack TypeScript architecture running on the dev server with modular REST APIs (`/api/v1/*`) integrated directly via Vite server middleware and a robust relational data store supporting ACID transactions, duration-aware conflict protection, and historical price snapshotting.
- **Decision 4 (Visual Theme & Devotional Aesthetics)**: Warm ivory canvas (`#FAF7F2`), deep temple maroon accents (`#7A1C24`), and sacred saffron gold (`#D97706`), utilizing Ant Design and Tailwind CSS with strict zero-pill typography and domain-authentic photography.

---

## 1. Overview & Core Concept

### What It Does
The platform connects devotees with qualified Vedic Pandits for religious ceremonies (Pooja, Havan, Jaap, Sanskar, and Vastu rituals) across three supported modes:
1. **Home (In-Person)**: Pandit travels to the devotee's residence.
2. **Venue (Temple / Hall)**: Conducted at an external hall or temple.
3. **Online (E-Pooja / Virtual)**: Conducted via live video stream with Sankalp taken remotely.

Devotees can explore ceremony requirements, verify samagri and dakshina inclusions, check real-time availability for their preferred date and city, and book appointments with instant reference numbers (`PB-2026-XXXX`). 

Administrators gain full control over:
- Service catalog, tiered packages (e.g., Simple, Standard, Premium/Grand), and ritual add-ons.
- Pandit profiles, Vedic specializations, language proficiencies, weekly working schedules, and leave/blocked dates.
- Intelligent default Pandit assignment (Package level $\to$ Pooja level $\to$ Global default) with automatic fallback if unavailable.
- Conflict-proof appointment scheduling, status transitions (`PENDING`, `CONFIRMED`, `RESCHEDULED`, `CANCELLED`, `COMPLETED`), custom quotation delivery, and email notification logs.

### Target Audience & Personas
- **Devotees & Families**: Looking for authentic, hassle-free religious ceremonies with verified pandits, transparent pricing, and clear preparation instructions.
- **Temple Priests / Pandits**: Managing verified ritual assignments, scheduling availability, and ceremony instructions.
- **Administrative Coordinators**: Managing customer bookings, quoting custom multi-day Vedic rituals, resolving scheduling bottlenecks, and tracking operational health.

### Key Value
- **Zero Double-Bookings**: Transactional conflict verification prevents overlapping appointments for any Pandit.
- **Snapshot Immutability**: Historical booking records preserve agreed package details and pricing even if catalog items change later.
- **Complete Operational Visibility**: Real statistics, audit logs, and notification tracking without fake metrics or dead controls.

---

## 2. User Experience & Visual Design

### Key User Flows

#### Public Devotee Experience
```
[Home Page / Hero Search]
       │
       ▼
[Pooja Catalog & Filters] ──(Category / Mode / City / Language)
       │
       ▼
[Pooja Details View] ───────(Inclusions, Samagri, Dakshina, Ritual Steps)
       │
       ▼
[Interactive Booking Wizard]
  ├── Step 1: Booking Type & Package Selection (or Custom Request)
  ├── Step 2: Devotee & Family Details (Name, Phone, Gotra, Sankalp Names)
  ├── Step 3: Service Mode & Address (Home / Venue / Online)
  ├── Step 4: Date & Dynamic Time Slot Picker (Real availability check)
  ├── Step 5: Pandit Preference / Assigned Default Pandit Profile
  └── Step 6: Commercial Summary, Add-ons & Review
       │
       ▼
[Booking Confirmation Page] ──(Unique Reference, Calendar reminder, Next Steps)
```

#### Administrative Operations Experience
```
[Admin Login & Auth Guard]
       │
       ▼
[Admin Dashboard] ──────────(Live stats: Today's poojas, Pending quotes, Pandit load)
       │
  ┌────┼─────────────────────────┬──────────────────────────┐
  ▼    ▼                         ▼                          ▼
[Bookings Manager]      [Catalog Manager]          [Pandit & Schedules]    [Custom Quotes]
• Filter by status/date • Poojas & Categories      • Pandit profiles       • Review custom briefs
• Confirm / Reschedule  • Packages & Inclusions    • Weekly shift builder  • Draft priced quotes
• Reassign Pandit       • Ritual Add-ons           • Block leaves / dates  • Track customer status
• Action audit history  • Default assignments      • Eligibility mapping   • Convert to booking
```

### Visual Identity & Theme
- **Aesthetic Direction**: Warm, devotional, sanctified yet modern and high-trust. Inspired by traditional brass lamps, vermilion, turmeric, and silk textiles without cluttered kitsch.
- **Color Palette**:
  - Dominant Canvas (60%): Warm Ivory / Soft Rice Paper (`#FAF7F2` and `#FFFDF9`)
  - Structural Surfaces (30%): Pure Card White (`#FFFFFF`), Soft Sandstone Borders (`#E7E2DA`), and Deep Charcoal Typography (`#1C1917`, `#44403C`)
  - Devotional Accent Budget (10%): Royal Temple Maroon (`#7A1C24`, hover `#5E141B`) and Sacred Saffron Gold (`#D97706`, accent `#B45309`)
- **Typography & Scale**:
  - Display & Headings: `Cinzel` / `Playfair Display` serif for timeless devotional elegance.
  - Body & UI: `Plus Jakarta Sans` for crisp legibility across forms, tabs, and tables.
  - Numerals: `font-mono tabular-nums` for prices, dates, time-slots, and reference codes.
- **Discipline & Anti-Slop Rules**:
  - Metadata displayed as clean, unboxed text separated by quiet typographic bullets (`·`).
  - No candy pill sandwiches, no arbitrary scoreboards, no floating pulsing dots.
  - Real responsive desktop layout (1440px baseline) and seamless mobile touch steppers with $\ge 44\text{px}$ touch targets.

---

## 3. Key Product Decisions & Trade-Offs

| Decision Area | Chosen Approach | Rationale & Trade-off |
|---|---|---|
| **Architecture & Server Execution** | Unified full-stack TypeScript application with Express / NestJS REST controllers integrated into the dev runtime on port 3000. | Ensures instantaneous live preview inside AI Studio iframe with zero port forwarding conflicts, while maintaining clean modular DTOs, controllers, and services. |
| **Relational Data & Concurrency** | Normalized relational schema with foreign keys, transactional locking, and interval exclusion logic. | Guarantees that concurrent booking submissions cannot double-book a Pandit during the same time window. |
| **Commercial Immutability** | JSONB price and package snapshots stored directly on the `bookings` row at time of creation. | Protects billing and contract accuracy: future price increases or package modifications will never alter past or in-progress bookings. |
| **Default Pandit Resolution** | Multi-tier cascade: Package Default $\to$ Pooja Default $\to$ Global Default $\to$ System Auto-Resolver. | Honors ritual specialization while providing seamless customer convenience and fallback when primary Pandits are on leave. |
| **Notifications & Outbox** | Transactional `notification_logs` table with SMTP delivery simulation and retry mechanism. | Ensures a transient email failure never aborts or rolls back a successfully persisted booking transaction. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 19)                         │
│                                                                        │
│   Public Devotee Views                Admin Dashboard & Management     │
│   ├── HomePage (Hero, Catalog, FAQs)  ├── AdminLogin & ProtectedGuard  │
│   ├── PoojaListing & Detail Views     ├── Operational Dashboard Stats  │
│   ├── Multi-Step Booking Wizard       ├── Booking Lifecycle Drawer     │
│   └── Booking Status & Tracking       └── Catalog & Pandit Schedulers  │
│                   │                                 │                  │
│                   └───────────────┬─────────────────┘                  │
│                                   │ Axios REST Client (JWT Header)     │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ /api/v1/*
┌───────────────────────────────────▼────────────────────────────────────┐
│                    API ROUTER & CONTROLLER LAYER                       │
│                                                                        │
│  ├── /auth: Login, profile, password reset                             │
│  ├── /categories & /poojas: Public catalog & Admin CRUD                │
│  ├── /packages & /addons: Package tiers, inclusions & prices           │
│  ├── /pandits & /availability: Slot calculator & leave manager         │
│  ├── /bookings: Transactional booking, confirm, reschedule, reassign   │
│  ├── /custom-quotes: Quotation lifecycle (draft, send, approve)        │
│  └── /dashboard & /notifications: Live aggregation & outbox history    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       BUSINESS SERVICE LAYER                           │
│                                                                        │
│  ├── BookingService: Transaction coordinator, snapshotter, validator   │
│  ├── AvailabilityEngine: Day-of-week slots, blocked dates, duration    │
│  ├── PanditResolver: Priority cascade (Package -> Pooja -> Global)     │
│  └── NotificationDispatcher: Email builder & outbox log recorder       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  RELATIONAL STORAGE (ACID Persistent)                  │
│                                                                        │
│  • admin_users         • pooja_categories   • pandits                  │
│  • customers           • poojas             • pandit_availability      │
│  • customer_addresses  • pooja_packages     • pandit_blocked_dates     │
│  • bookings            • package_inclusions • pandit_poojas            │
│  • booking_history     • pooja_addons       • custom_quotes            │
│  • booking_addons      • app_settings       • notification_logs        │
└────────────────────────────────────────────────────────────────────────┘
```

### Relational Entity Schema Summary

1. **`admin_users`**: Admin credentials (`email`, `password_hash`, `role`, `name`, `is_active`).
2. **`customers`**: Devotee contact records (`full_name`, `email`, `phone`, `country_code`, `preferred_language`).
3. **`pooja_categories`**: Hierarchical categories (`name`, `slug`, `description`, `image_url`, `sort_order`, `is_active`).
4. **`poojas`**: Ceremonies (`name`, `slug`, `purpose`, `instructions`, `duration_minutes`, `default_pandit_id`, `allow_customer_pandit_preference`).
5. **`pooja_packages`**: Tiers (`pooja_id`, `name`, `price`, `currency`, `duration_minutes`, `pandit_count`, `includes_samagri`, `includes_dakshina`, `default_pandit_id`).
6. **`package_inclusions`**: Itemized details per package (`package_id`, `title`, `description`, `sort_order`).
7. **`pooja_addons`**: Optional sacred add-ons (Navgrah Havan, Gau Seva, Special Prasad, Extra Pandit).
8. **`pandits`**: Priests (`full_name`, `email`, `phone`, `experience_years`, `specializations`, `profile_image`, `biography`, `is_active`).
9. **`pandit_availability`**: Weekly recurring slots (`pandit_id`, `day_of_week`, `start_time`, `end_time`).
10. **`pandit_blocked_dates`**: Vacation and blackout intervals (`pandit_id`, `starts_at`, `ends_at`, `reason`).
11. **`pandit_poojas`**: Priest-to-ceremony qualification mapping (`pandit_id`, `pooja_id`, `is_eligible`).
12. **`bookings`**: Core appointments with unique reference `PB-YYYYMMDD-XXXX`, customer FK, Pandit FK, appointment range, immutable snapshots (`package_snapshot`, `customer_details_snapshot`, `selected_addons_snapshot`), price, and state machine (`PENDING`, `CONFIRMED`, `RESCHEDULED`, `CANCELLED`, `COMPLETED`, `AWAITING_CUSTOM_QUOTE`, `QUOTE_SENT`).
13. **`booking_history`**: Audit ledger tracking every status alteration, reassignment, and reschedule with actor notes.
14. **`custom_quotes`**: Quotes drafted for custom rituals (`booking_id`, `proposed_amount`, `quote_details`, `status`, `expires_at`).
15. **`notification_logs`**: Outbox audit log tracking email templates, recipients, status (`SENT`, `FAILED`), and retry counts.
16. **`app_settings`**: Global configuration (`global_default_pandit_id`, `service_timezone`, `min_advance_hours`, `contact_details`).

### Interactive Component & State Mapping

| Component | User Trigger | State Change & Side Effect |
|---|---|---|
| **PoojaFilters** | Search text, category select, service mode tag | Updates catalog query parameters, triggers filtered API re-fetch, resets pagination. |
| **PackageCard** | "Select Package" button click | Commits chosen package to booking wizard state; pre-populates price and default duration. |
| **DateTimeSlotPicker** | Date selection | Queries `/api/v1/availability/slots?date=...&duration=...`; dynamically calculates available start times free from Pandit conflicts. |
| **PanditSelector** | Pandit choice toggle | Displays the resolved default Pandit or eligible alternative; validates qualification against ceremony. |
| **BookingReview** | "Confirm & Submit Booking" button | Disables button (duplicate submission guard), issues `POST /api/v1/bookings`, commits transaction, transitions to Success screen with reference. |
| **AdminBookingDrawer** | "Reassign Pandit" or "Reschedule" | Re-runs conflict engine against target appointment interval; persists change, appends `booking_history`, queues notification. |
| **CustomQuoteModal** | "Send Quote" button | Updates quote status to `SENT`, records proposed price, logs email notification attempt. |

---

## 5. Implementation Sequence & Next Steps

Upon your approval to proceed, execution will follow this structured build plan:
1. **Infrastructure & Seed Data**: Initialize relational schema, DTO validators, and seed realistic Vedic catalog records (Ganesh Puja, Satyanarayan, Griha Pravesh, Rudrabhishek, Navgrah, etc.) and Pandit profiles.
2. **Backend API & Scheduling Engine**: Build the modular controllers, duration-aware slot calculator, and transactional booking processor with conflict protection.
3. **Devotee Experience**: Implement the public homepage, responsive ceremony catalog, package comparison cards, and the 6-step booking wizard with live validation.
4. **Admin Management Suite**: Deliver the administrative login, operational dashboard, booking lifecycle drawer, catalog manager, and custom quotation tools.
5. **Quality Verification**: Execute end-to-end booking verification, conflict prevention tests, and compilation check.
