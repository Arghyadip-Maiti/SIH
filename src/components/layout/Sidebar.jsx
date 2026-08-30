import { NavLink } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  ShieldCheck,
  BarChart3,
  Settings,
} from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useApp } from '../../context/AppContext';
import emblemImg from '../../assets/ashoka-stambha.png';

const iconMap = {
  Home,
  FolderKanban,
  ShieldCheck,
  BarChart3,
  Settings,
};

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebarCollapse } = useApp();

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 bg-slate-100 text-slate-800 transition-all duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with Official Ashoka Stambha Emblem */}
      <div className="h-[72px] pt-2 px-3 flex items-center shrink-0 select-none">
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="flex items-center w-full min-w-0 px-2.5 py-1.5 h-12 cursor-pointer rounded-xl hover:bg-slate-200/50 transition-colors group select-none text-left focus:outline-none"
        >
          <div className="flex items-center justify-center shrink-0 w-10 h-10 select-none">
            <img
              src={emblemImg}
              alt="Ashoka Stambha National Emblem of India"
              className="object-contain shrink-0 w-10 h-10 select-none pointer-events-none"
            />
          </div>
          <div
            className={`flex flex-col leading-tight overflow-hidden transition-all duration-300 ease-in-out pl-3 select-none ${
              sidebarCollapsed
                ? 'opacity-0 max-w-0 min-w-0 pointer-events-none'
                : 'opacity-100 max-w-[150px]'
            }`}
          >
            <span className="font-extrabold text-slate-900 text-base tracking-tight font-sans whitespace-nowrap select-none">
              MPLADS AI
            </span>
            <span className="text-[9px] text-slate-500 font-medium leading-snug whitespace-nowrap select-none">
              Monitoring Platform
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden relative">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName] || Home;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm relative group transition-all duration-300 ease-in-out ${
                  isActive
                    ? sidebarCollapsed
                      ? 'text-slate-900 font-bold ml-3 mr-0 rounded-l-2xl z-20'
                      : 'bg-white text-slate-900 font-bold mx-3 rounded-xl shadow-xs border border-slate-200/80 z-20'
                    : sidebarCollapsed
                    ? 'text-slate-600 hover:text-slate-900 font-medium ml-3 mr-0 rounded-l-2xl z-10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium mx-3 rounded-xl z-10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Morphing "Tail": Retracts into main page when deactivating, emerges out when activating (in collapsed mode) */}
                  {sidebarCollapsed && (
                    <div
                      className={`absolute inset-0 bg-white rounded-l-2xl pointer-events-none origin-right transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    >
                      {/* Top Concave Inverted Corner Arc */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="absolute -top-4 right-0 w-4 h-4 pointer-events-none"
                      >
                        <path d="M16 0 C16 8.84 8.84 16 0 16 H 16 V 0 Z" fill="#ffffff" />
                      </svg>

                      {/* Bottom Concave Inverted Corner Arc */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="absolute -bottom-4 right-0 w-4 h-4 pointer-events-none"
                      >
                        <path d="M0 0 C8.84 0 16 7.16 16 16 V 0 H 0 Z" fill="#ffffff" />
                      </svg>
                    </div>
                  )}

                  <div className="w-8 h-8 flex items-center justify-center shrink-0 relative z-10">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-slate-900 scale-105' : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    />
                  </div>
                  <span
                    className={`tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out pl-3 relative z-10 ${
                      sidebarCollapsed
                        ? 'opacity-0 max-w-0 min-w-0'
                        : 'opacity-100 max-w-[160px]'
                    }`}
                  >
                    {item.label}
                  </span>

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
            : 'opacity-100 max-h-52 p-4 m-3 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-xs'
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
