import { NavLink } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  ShieldCheck,
  Bell,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useApp } from '../../context/AppContext';
import emblemImg from '../../assets/ashoka-stambha.png';

const iconMap = {
  Home,
  FolderKanban,
  ShieldCheck,
  Bell,
  BarChart3,
  Settings,
};

export const MobileSidebar = () => {
  const { sidebarOpen, setSidebarOpen, unreadAlertsCount } = useApp();

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <aside className="relative flex-1 max-w-xs w-full bg-[#040C24] text-slate-200 flex flex-col h-full z-10 shadow-2xl border-r border-[#0D1C44]">
        {/* Header with Official Ashoka Stambha Logo */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#0D1C44]">
          <div className="flex items-center gap-3">
            <img
              src={emblemImg}
              alt="Ashoka Stambha National Emblem of India"
              className="w-10 h-10 object-contain mix-blend-screen filter brightness-125 shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-white text-base tracking-tight">MPLADS</span>
              <span className="text-[10px] text-slate-300">
                AI-Powered Monitoring &amp;<br />Analytics Platform
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.iconName] || Home;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0052FF] text-white font-semibold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#0C1A42]/70'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === 'alerts' && unreadAlertsCount > 0 && (
                  <span className="ml-auto bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadAlertsCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* AI Engine Status Card at Bottom */}
        <div className="p-4 m-3 rounded-xl bg-[#0A183C] border border-[#142A63]/80 text-slate-200">
          <div className="text-xs font-bold text-white mb-1">AI Risk Engine Status</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">Active</span>
          </div>
          <div className="pt-2 border-t border-[#142A63]/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Last Updated
            </div>
            <div className="text-xs text-slate-200 font-mono mt-0.5">
              10 May 2025, 10:30 AM
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
