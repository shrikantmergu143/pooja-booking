/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';

// Layouts
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Public Pages
import { HomePage } from './legacy-pages/public/HomePage.tsx';
import { PoojaListingPage } from './legacy-pages/public/PoojaListingPage.tsx';
import { PoojaDetailPage } from './legacy-pages/public/PoojaDetailPage.tsx';
import { BookingWizardPage } from './legacy-pages/public/BookingWizardPage.tsx';
import { BookingLookupPage } from './legacy-pages/public/BookingLookupPage.tsx';
import { ContactPage } from './legacy-pages/public/ContactPage.tsx';
import { AppointmentBookingPage } from './legacy-pages/public/AppointmentBookingPage.tsx';
import { AdminAppointmentsPage } from './legacy-pages/admin/AdminAppointmentsPage.tsx';
import { ContentPage } from './legacy-pages/public/ContentPage.tsx';
import { AboutUsPage } from './legacy-pages/public/AboutUsPage.tsx';

// Admin Pages
import { AdminLoginPage } from './legacy-pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './legacy-pages/admin/AdminDashboardPage.tsx';
import { AdminBookingsPage } from './legacy-pages/admin/AdminBookingsPage.tsx';
import { AdminCatalogPage } from './legacy-pages/admin/AdminCatalogPage.tsx';
import { AdminPanditsPage } from './legacy-pages/admin/AdminPanditsPage.tsx';
import { AdminCustomQuotesPage } from './legacy-pages/admin/AdminCustomQuotesPage.tsx';
import { AdminNotificationsPage } from './legacy-pages/admin/AdminNotificationsPage.tsx';
import { AdminSettingsPage } from './legacy-pages/admin/AdminSettingsPage.tsx';
import { AdminContactMessagesPage } from './legacy-pages/admin/AdminContactMessagesPage.tsx';
import { hidePublicCeremonies } from './config/features.ts';

const AdminContentPagesPage = lazy(() =>
  import('./legacy-pages/admin/AdminContentPagesPage.tsx').then((module) => ({
    default: module.AdminContentPagesPage,
  })),
);

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#7A1C24',
            colorLink: '#7A1C24',
            colorLinkHover: '#5E141B',
            borderRadius: 8,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          },
        }}
      >
        <ToastContainer position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Devotee Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route
                path="poojas"
                element={hidePublicCeremonies ? <Navigate to="/" replace /> : <PoojaListingPage />}
              />
              <Route
                path="poojas/:slug"
                element={hidePublicCeremonies ? <Navigate to="/" replace /> : <PoojaDetailPage />}
              />
              <Route
                path="book"
                element={hidePublicCeremonies ? <Navigate to="/" replace /> : <BookingWizardPage />}
              />
              <Route path="appointment" element={<AppointmentBookingPage />} />
              <Route
                path="track"
                element={hidePublicCeremonies ? <Navigate to="/" replace /> : <BookingLookupPage />}
              />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path=":slug" element={<ContentPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Console Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="appointments" element={<AdminAppointmentsPage />} />
              <Route path="catalog" element={<AdminCatalogPage />} />
              <Route path="pandits" element={<AdminPanditsPage />} />
              <Route path="quotes" element={<AdminCustomQuotesPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="contact-messages" element={<AdminContactMessagesPage />} />
              <Route
                path="content-pages"
                element={
                  <Suspense fallback={<div className="py-12 text-center">Loading page editor...</div>}>
                    <AdminContentPagesPage />
                  </Suspense>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
