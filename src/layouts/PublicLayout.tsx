import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/common/AppHeader.tsx';
import { AppFooter } from '../components/common/AppFooter.tsx';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <AppHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};
