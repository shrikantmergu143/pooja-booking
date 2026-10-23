# Pooja Booking & Pandit Appointment Management System

A production-grade, full-stack devotional ceremony booking and appointment management web application built from scratch, inspired by bookmypoojaonline.com.

---

## 🕉️ Key Features

### Devotee Experience
- **Ceremony Catalog**: Curated Vedic poojas, havans, sanskars, and vastu rituals with rich photography, ritual purpose, and preparation checklists.
- **Package Comparison**: Transparent tier comparisons (Simple, Standard, Grand) with clear duration, pandit count, samagri, and dakshina breakdown.
- **Interactive 6-Step Booking Wizard**:
  1. Ceremony & package selection (or custom ritual inquiry)
  2. Devotee details (name, gotra, rashi, date/place of birth, mobile; email optional)
  3. Service mode selection (Home, Venue, or Online E-Pooja)
  4. Date & dynamic time slot picker with live conflict protection
  5. Pandit preference and assigned priest profile
  6. Commercial summary, auspicious add-ons, and instant booking reference (`PB-YYYYMMDD-XXXX`)
- **Appointment Tracking**: Devotees can track their booking status, assigned priest, and ceremony protocol by reference code and phone number.
- **Standalone Appointment Requests**: A separate customer form collects name, gotra, rashi, birth date/place, preferred appointment date/time, mobile number, and optional email without requiring a pooja or pandit selection.
- **Contact & Informational Pages**: Public contact form, dynamic business contact details, and admin-editable About, Privacy, Terms, and additional published pages.

### Administrative Operations Suite
- **Live Operations Dashboard**: Real-time KPI metrics (Total bookings, today's schedule, pending confirmations, custom quotes, and active pandits).
- **Booking Lifecycle Center**: Search, filter, and execute critical actions with full transactional conflict checks:
  - Create appointments, edit devotee details, and archive records without deleting booking history
  - Approve & Confirm Booking
  - Reschedule Appointment (with date/time conflict validation)
  - Reassign Pandit (with qualification and schedule check)
  - Cancel Booking (frees up the slot)
  - Mark Completed
  - Add Internal Operations Notes
  - Chronological History Audit Trail
- **Standalone Appointment Management**: View, create, edit, and delete customer appointment requests independently of ceremony bookings.
- **Catalog Management**: CRUD operations on Categories, Poojas, Packages, Inclusions, and Add-ons, with package-level and pooja-level default Pandit overrides.
- **Pandit & Schedule Management**: Priest directory, weekly working shift editor, and blocked dates / leave manager with conflict prevention.
- **Custom Quotation Builder**: Manage custom ritual briefs, draft itemized quotes, queue customer notifications, and convert accepted quotes into confirmed appointments.
- **Notification Outbox**: Persist booking and quote notifications with delivery attempts. Configure a delivery provider before sending or retrying email.
- **Global Settings**: Configure business details, helpline, service timezone (`Asia/Kolkata`), and advance booking window limits.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 7, Ant Design, Tailwind CSS v4, Lucide Icons, Day.js
- **State Management**: Redux Toolkit & LocalStorage session persistence
- **Architecture**: Authoritative relational data engine with interval-based appointment conflict protection and commercial snapshots

---

## Backend and admin setup

The frontend uses the NestJS API at `http://localhost:4000` by default. Set
`VITE_API_BASE_URL` in the root `.env` if the backend is hosted elsewhere.
Set `VITE_HIDE_PANDIT_APPOINTMENT=true` in the frontend `.env` to hide the
All Poojas, Griha Pravesh, Havans & Kathas, Rudrabhishek, and Check Status links
and pooja/booking links from the public header and footer. About Us and Book
Appointment remain visible, and all routes and booking functionality remain available.

For a local setup:

1. Configure the PostgreSQL connection in `backend/.env` using `backend/.env.example`.
2. From `backend`, run `npm install` and `npm run typeorm:migration:run`. The
   migrations add booking birth details, soft-archive support, contact messages,
   editable content pages, and standalone appointments. The backend uses migrations as the schema source of truth; TypeORM automatic
   synchronization is disabled to avoid out-of-band schema changes.
3. Set `INITIAL_SUPER_ADMIN_NAME`, `INITIAL_SUPER_ADMIN_EMAIL`, and
   `INITIAL_SUPER_ADMIN_PASSWORD` in `backend/.env`, then run
   `npm run admin:bootstrap`. The bootstrap command only creates an account if
   the admin table is empty.
4. Run `npm run seed:catalog` to insert the sample catalog.
5. Start the backend with `npm run start:dev`, then start the frontend from the
   repository root with `npm run dev`.

Authenticated `SUPER_ADMIN` users can create additional `ADMIN` accounts through
`POST /api/v1/auth/admin/create`.
