import { useLocation } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS } from '../../constants/routes';

export const Topbar = () => {
  const location = useLocation();
  const { currentUser, toggleSidebar, isMockMode } = useApp();

  // Determine page title based on active route
  const getPageTitle = () => {
    if (location.pathname.startsWith('/mp/') || location.pathname.startsWith('/projects/mp/')) {
      return 'MPLADS Performance Dashboard';
    }
    if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') {
      return 'MPLADS Performance Dashboard';
    }
    const activeNav = NAV_ITEMS.find((item) =>
      location.pathname === item.path || (item.path !== '/overview' && location.pathname.startsWith(item.path))
    );
    return activeNav?.label || 'Overview';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-30 h-20 min-h-[5rem] bg-white border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200/80 bg-white transition-all"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans tracking-tight">
            {pageTitle}
          </h1>
          {isMockMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              Mock Mode
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 pl-1 select-none">
          <div className="text-right hidden sm:block select-none">
            <p className="text-sm font-bold text-slate-900 leading-none select-none">
              {currentUser?.name || 'Administrator'}
            </p>
            <p className="text-xs text-slate-500 font-medium leading-none mt-1.5 select-none">
              {currentUser?.role || 'Ministry Administrator'}
            </p>
          </div>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-slate-200/80 shadow-sm ring-2 ring-slate-100 select-none pointer-events-none"
          />
        </div>
      </div>
    </header>
  );
};
