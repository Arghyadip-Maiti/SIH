import { NavLink } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  ShieldCheck,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
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

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebarCollapse, unreadAlertsCount } = useApp();

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 bg-[#040C24] text-slate-200 border-r border-white/20 transition-all duration-300 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with Official Ashoka Stambha Emblem */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/15">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 p-0.5 flex items-center justify-center">
            <img
              src={emblemImg}
              alt="Ashoka Stambha National Emblem of India"
              className="w-9 h-9 object-contain mix-blend-screen filter brightness-125"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-white text-base tracking-tight font-sans">
                MPLADS AI
              </span>
              <span className="text-[9px] text-slate-300 font-normal leading-snug">
                Monitoring Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebarCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#0C1A42] transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName] || Home;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-[#0052FF] text-white font-semibold shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#0C1A42]/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-white scale-105' : 'text-slate-300 group-hover:text-white'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="tracking-wide">{item.label}</span>}

                  {/* Alert Count Badge */}
                  {item.id === 'alerts' && unreadAlertsCount > 0 && (
                    <span
                      className={`ml-auto font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-rose-600 text-white'
                      } ${sidebarCollapsed ? 'absolute top-1 right-1 px-1.5 py-0.2' : ''}`}
                    >
                      {unreadAlertsCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status Card: AI Risk Engine Status */}
      {!sidebarCollapsed && (
        <div className="p-4 m-3 rounded-xl bg-[#0A183C] border border-[#142A63]/80 text-slate-200">
          <div className="text-xs font-bold text-white tracking-wide mb-1.5">
            AI Risk Engine Status
          </div>
          <div className="flex items-center gap-2 mb-3">
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
      )}
    </aside>
  );
};
