import { useState, useEffect } from 'react';
import { Monitor, Save, Sun, Moon, Laptop } from 'lucide-react';

export const AppearanceSettings = ({ appearanceData = {}, onSave, saving }) => {
  const [formData, setFormData] = useState({
    theme: appearanceData.theme || 'light',
  });

  useEffect(() => {
    setFormData({
      theme: appearanceData.theme || 'light',
    });
  }, [appearanceData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, 'Appearance settings saved');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Appearance</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Select and customize platform visual theme
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Radio Selector */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Platform Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light */}
            <label
              onClick={() => setFormData({ ...formData, theme: 'light' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                formData.theme === 'light'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Sun className={`w-5 h-5 ${formData.theme === 'light' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-extrabold">Light Mode</span>
              <span className="text-[10px] opacity-75">Clean enterprise aesthetic</span>
            </label>

            {/* Dark */}
            <label
              onClick={() => setFormData({ ...formData, theme: 'dark' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                formData.theme === 'dark'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Moon className={`w-5 h-5 ${formData.theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-xs font-extrabold">Dark Mode</span>
              <span className="text-[10px] opacity-75">Low-light workstation UI</span>
            </label>

            {/* System */}
            <label
              onClick={() => setFormData({ ...formData, theme: 'system' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                formData.theme === 'system'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Laptop className={`w-5 h-5 ${formData.theme === 'system' ? 'text-blue-400' : 'text-slate-500'}`} />
              <span className="text-xs font-extrabold">System Default</span>
              <span className="text-[10px] opacity-75">Sync with OS preference</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppearanceSettings;
