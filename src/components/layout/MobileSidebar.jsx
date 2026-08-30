import { NavLink } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  ShieldCheck,
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
  BarChart3,
  Settings,
};

export const MobileSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <aside className="relative flex-1 max-w-xs w-full bg-slate-100 text-slate-800 flex flex-col h-full z-10">
        {/* Header with Official Ashoka Stambha Logo */}
        <div className="h-20 px-5 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img
              src={emblemImg}
              alt="Ashoka Stambha National Emblem of India"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">MPLADS</span>
              <span className="text-[10px] text-slate-500 font-medium">
                AI-Powered Monitoring &amp;<br />Analytics Platform
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
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
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* AI Engine Status Card at Bottom */}
        <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <div className="text-xs font-bold text-slate-900 mb-1">AI Risk Engine Status</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-700">Active</span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Last Updated
            </div>
            <div className="text-xs text-slate-800 font-mono mt-0.5">
              10 May 2025, 10:30 AM
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
