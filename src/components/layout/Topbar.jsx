import { useLocation } from 'react-router-dom';
import { Bell, Menu, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS } from '../../constants/routes';

export const Topbar = () => {
  const location = useLocation();
  const { currentUser, toggleSidebar, unreadAlertsCount, isMockMode } = useApp();

  // Find active nav item or default
  const activeNav = NAV_ITEMS.find((item) =>
    location.pathname === item.path || (item.path !== '/overview' && location.pathname.startsWith(item.path))
  );

  const pageTitle = activeNav?.label || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#040C24]/95 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 flex items-center justify-between shadow-md">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#0C1A42] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-white font-sans tracking-tight">
              {pageTitle}
            </h1>
            {isMockMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-[#0C1A42] text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Shield className="w-3 h-3 text-amber-400" />
                Mock Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Icon */}
        <button
          type="button"
          className="p-2 text-slate-300 hover:text-white hover:bg-[#0C1A42] rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#040C24]" />
          )}
        </button>

        <div className="h-6 w-px bg-white/20 hidden sm:block" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">
              {currentUser?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              {currentUser?.role || 'Ministry Administrator'}
            </p>
          </div>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt="User Avatar"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white/30 shadow-xs"
          />
        </div>
      </div>
    </header>
  );
};
