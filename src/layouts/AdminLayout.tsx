import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { logout } from '../store/authSlice.ts';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BookOpen,
  Users,
  FileText,
  Bell,
  Settings,
  Mail,
  LogOut,
  Flame,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { message } from 'antd';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    message.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/bookings', label: 'All Bookings', icon: CalendarCheck },
    { path: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
    { path: '/admin/catalog', label: 'Poojas & Packages', icon: BookOpen },
    { path: '/admin/pandits', label: 'Pandits & Schedules', icon: Users },
    { path: '/admin/quotes', label: 'Custom Quotes', icon: FileText },
    { path: '/admin/notifications', label: 'Email Notifications', icon: Bell },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/contact-messages', label: 'Contact Messages', icon: Mail },
    { path: '/admin/content-pages', label: 'Website Pages', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#210D10] text-stone-300 flex flex-col shrink-0 border-r border-stone-800">
        {/* Brand */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7A1C24] to-amber-600 text-amber-200 flex items-center justify-center shadow">
              <Flame className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <div className="font-serif-title text-base font-bold text-amber-100 tracking-tight leading-tight">
                Pooja Admin
              </div>
              <div className="text-[10px] text-amber-400 font-medium tracking-wider uppercase">
                Priest & Operations
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#7A1C24] text-amber-100 shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-amber-300/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & view public site */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors border border-stone-700"
          >
            <span>Open Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-amber-200 truncate">{user?.name}</div>
              <div className="text-[10px] text-stone-400 truncate">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-stone-400 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Operations
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-sm font-semibold text-stone-800 capitalize">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">System Online</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600">Asia/Kolkata</span>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-full bg-[#7A1C24] text-amber-200 font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="font-medium text-stone-700 hidden md:inline">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
