/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { ConfigProvider } from 'antd';

// Layouts
import { PublicLayout } from './layouts/PublicLayout.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { PoojaListingPage } from './pages/public/PoojaListingPage.tsx';
import { PoojaDetailPage } from './pages/public/PoojaDetailPage.tsx';
import { BookingWizardPage } from './pages/public/BookingWizardPage.tsx';
import { BookingLookupPage } from './pages/public/BookingLookupPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { AppointmentBookingPage } from './pages/public/AppointmentBookingPage.tsx';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage.tsx';
import { ContentPage } from './pages/public/ContentPage.tsx';
import { AboutUsPage } from './pages/public/AboutUsPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage.tsx';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage.tsx';
import { AdminPanditsPage } from './pages/admin/AdminPanditsPage.tsx';
import { AdminCustomQuotesPage } from './pages/admin/AdminCustomQuotesPage.tsx';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';
import { AdminContactMessagesPage } from './pages/admin/AdminContactMessagesPage.tsx';

const AdminContentPagesPage = lazy(() =>
  import('./pages/admin/AdminContentPagesPage.tsx').then((module) => ({
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
        <BrowserRouter>
          <Routes>
            {/* Public Devotee Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="poojas" element={<PoojaListingPage />} />
              <Route path="poojas/:slug" element={<PoojaDetailPage />} />
              <Route path="book" element={<BookingWizardPage />} />
              <Route path="appointment" element={<AppointmentBookingPage />} />
              <Route path="track" element={<BookingLookupPage />} />
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
