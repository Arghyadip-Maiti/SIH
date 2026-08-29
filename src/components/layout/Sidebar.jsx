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
      className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 bg-slate-50 text-slate-800 transition-all duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >


      {/* Brand Header with Official Ashoka Stambha Emblem */}
      <div className="h-[72px] pt-2 px-3 flex items-center shrink-0">
        <div
          onClick={sidebarCollapsed ? toggleSidebarCollapse : undefined}
          className={`flex items-center w-full min-w-0 px-3 h-10 ${
            sidebarCollapsed ? 'cursor-pointer' : ''
          }`}
          title={sidebarCollapsed ? 'Click to expand sidebar' : undefined}
        >
          <div className="flex items-center justify-center shrink-0 w-10 h-10">
            <img
              src={emblemImg}
              alt="Ashoka Stambha National Emblem of India"
              className="object-contain shrink-0 w-10 h-10"
            />
          </div>
          <div
            className={`flex flex-col leading-tight overflow-hidden transition-all duration-300 ease-in-out pl-3 ${
              sidebarCollapsed
                ? 'opacity-0 max-w-0 min-w-0 pointer-events-none'
                : 'opacity-100 max-w-[150px]'
            }`}
          >
            <span className="font-extrabold text-slate-900 text-base tracking-tight font-sans whitespace-nowrap">
              MPLADS AI
            </span>
            <span className="text-[9px] text-slate-500 font-medium leading-snug whitespace-nowrap">
              Monitoring Platform
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName] || Home;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm transition-colors duration-200 relative group ${
                  isActive
                    ? 'bg-slate-200 text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-slate-900 scale-105' : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    />
                  </div>
                  <span
                    className={`tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out pl-3 ${
                      sidebarCollapsed
                        ? 'opacity-0 max-w-0 min-w-0'
                        : 'opacity-100 max-w-[160px]'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Alert Count Badge */}
                  {item.id === 'alerts' && unreadAlertsCount > 0 && (
                    <span
                      className={`font-bold rounded-full transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                        sidebarCollapsed
                          ? 'opacity-0 max-w-0 pointer-events-none'
                          : 'ml-auto text-[11px] px-2 py-0.5 ' +
                            (isActive ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white')
                      }`}
                    >
                      {unreadAlertsCount}
                    </span>
                  )}

                  {/* Small Alert Dot Badge when Collapsed */}
                  {item.id === 'alerts' && unreadAlertsCount > 0 && sidebarCollapsed && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
                  )}

                  {/* Tooltip on Hover when Collapsed */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap shadow-lg">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status Card: AI Risk Engine Status */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarCollapsed
            ? 'opacity-0 max-h-0 m-0 p-0 border-0 pointer-events-none'
            : 'opacity-100 max-h-52 p-4 m-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700'
        }`}
      >
        <div className="text-xs font-bold text-slate-900 tracking-wide mb-1.5 whitespace-nowrap">
          AI Risk Engine Status
        </div>
        <div className="flex items-center gap-2 mb-3 whitespace-nowrap">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-700">Active</span>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap">
            Last Updated
          </div>
          <div className="text-xs text-slate-800 font-mono mt-0.5 whitespace-nowrap">
            10 May 2025, 10:30 AM
          </div>
        </div>
      </div>
    </aside>
  );
};
