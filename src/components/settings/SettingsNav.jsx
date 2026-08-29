import { User, Sliders, Shield, Monitor, Info } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Dashboard Preferences', icon: Sliders },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Monitor },
  { id: 'about', label: 'About MPLADS', icon: Info },
];

export const SettingsNav = ({ activeTab, onTabChange }) => {
  return (
    <>
      {/* Desktop Vertical Menu */}
      <div className="hidden md:block w-64 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs h-fit">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Settings Menu
        </div>
        <nav className="space-y-1 mt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Horizontal Pill Scroll / Select */}
      <div className="md:hidden w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SettingsNav;
