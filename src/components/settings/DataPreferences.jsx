import { useState, useEffect } from 'react';
import { Database, Save, RefreshCcw } from 'lucide-react';

export const DataPreferences = ({ dataPreferences = {}, onSave, saving }) => {
  const [formData, setFormData] = useState({
    currency: dataPreferences.currency || 'INR',
    numberFormat: dataPreferences.numberFormat || 'Indian (Lakhs / Crores)',
    dateFormat: dataPreferences.dateFormat || 'DD/MM/YYYY',
    recordsPerPage: dataPreferences.recordsPerPage || 25,
    autoRefresh: dataPreferences.autoRefresh ?? true,
    refreshIntervalMinutes: dataPreferences.refreshIntervalMinutes || 15,
  });

  useEffect(() => {
    setFormData({
      currency: dataPreferences.currency || 'INR',
      numberFormat: dataPreferences.numberFormat || 'Indian (Lakhs / Crores)',
      dateFormat: dataPreferences.dateFormat || 'DD/MM/YYYY',
      recordsPerPage: dataPreferences.recordsPerPage || 25,
      autoRefresh: dataPreferences.autoRefresh ?? true,
      refreshIntervalMinutes: dataPreferences.refreshIntervalMinutes || 15,
    });
  }, [dataPreferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, 'Data preferences saved');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Data Preferences</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Configure currency notation, date formatting, pagination limits, and automatic data sync intervals
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Data Display
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Currency */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Currency Notation
              </label>
              <div className="text-xs font-bold text-slate-800 bg-slate-100 p-3 rounded-xl border border-slate-200">
                ₹ INR (Indian Rupee)
              </div>
            </div>

            {/* Number Format */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Number Format System
              </label>
              <div className="text-xs font-bold text-slate-800 bg-slate-100 p-3 rounded-xl border border-slate-200">
                Indian System (Lakhs & Crores)
              </div>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Date Format
              </label>
              <select
                value={formData.dateFormat}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (29/08/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-08-29)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY (Aug 29, 2026)</option>
              </select>
            </div>

            {/* Records Per Page */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Default Records Per Page
              </label>
              <select
                value={formData.recordsPerPage}
                onChange={(e) => setFormData({ ...formData, recordsPerPage: Number(e.target.value) })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value={10}>10 Records</option>
                <option value={25}>25 Records</option>
                <option value={50}>50 Records</option>
                <option value={100}>100 Records</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Refresh Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Data Refresh Settings
          </h4>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">Automatic Background Refresh</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Periodically fetch fresh data updates from backend services.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, autoRefresh: !formData.autoRefresh })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.autoRefresh ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.autoRefresh ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {formData.autoRefresh && (
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Refresh Interval
              </label>
              <select
                value={formData.refreshIntervalMinutes}
                onChange={(e) => setFormData({ ...formData, refreshIntervalMinutes: Number(e.target.value) })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value={5}>Every 5 Minutes</option>
                <option value={10}>Every 10 Minutes</option>
                <option value={15}>Every 15 Minutes</option>
                <option value={30}>Every 30 Minutes</option>
                <option value={60}>Every 60 Minutes</option>
              </select>
            </div>
          )}
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

export default DataPreferences;
