import { useState, useEffect } from 'react';
import { Sliders, Save, RefreshCw } from 'lucide-react';

export const DashboardPreferences = ({
  preferencesData = {},
  onSave,
  saving,
  onOpenResetModal,
}) => {
  const [formData, setFormData] = useState({
    financialYear: preferencesData.financialYear || '2026-27',
    landingPage: preferencesData.landingPage || '/overview',
    projectView: preferencesData.projectView || 'All Projects',
    mapMetric: preferencesData.mapMetric || 'utilization',
    tableDensity: preferencesData.tableDensity || 'compact',
  });

  useEffect(() => {
    setFormData({
      financialYear: preferencesData.financialYear || '2026-27',
      landingPage: preferencesData.landingPage || '/overview',
      projectView: preferencesData.projectView || 'All Projects',
      mapMetric: preferencesData.mapMetric || 'utilization',
      tableDensity: preferencesData.tableDensity || 'compact',
    });
  }, [preferencesData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, 'Dashboard preferences saved');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Dashboard Preferences</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Customize default views, initial fiscal scope, and visual density across the application
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Default Financial Year */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Default Financial Year
            </label>
            <select
              value={formData.financialYear}
              onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="2026-27">2026–27</option>
              <option value="2025-26">2025–26</option>
              <option value="2024-25">2024–25</option>
              <option value="2023-24">2023–24</option>
            </select>
          </div>

          {/* Default Landing Page */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Default Landing Page
            </label>
            <select
              value={formData.landingPage}
              onChange={(e) => setFormData({ ...formData, landingPage: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="/overview">Overview</option>
              <option value="/projects">Projects</option>
              <option value="/ai-risk">AI Risk Monitor</option>
              <option value="/analytics">Analytics & Trends</option>
            </select>
          </div>

          {/* Default Project View */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Default Project View
            </label>
            <select
              value={formData.projectView}
              onChange={(e) => setFormData({ ...formData, projectView: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="All Projects">All Projects</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Delayed">Delayed</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>

          {/* Default Map Metric */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Default Map Metric
            </label>
            <select
              value={formData.mapMetric}
              onChange={(e) => setFormData({ ...formData, mapMetric: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="utilization">Fund Utilization</option>
              <option value="completion">Project Completion</option>
              <option value="delay">Project Delays</option>
              <option value="avgCost">Average Project Cost</option>
              <option value="costOverrun">Cost Overrun</option>
              <option value="expenditure">Expenditure</option>
            </select>
          </div>
        </div>

        {/* Table Density Radio Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Table Density
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 cursor-pointer select-none flex-1">
              <input
                type="radio"
                name="tableDensity"
                value="comfortable"
                checked={formData.tableDensity === 'comfortable'}
                onChange={(e) => setFormData({ ...formData, tableDensity: e.target.value })}
                className="w-4 h-4 text-slate-900 focus:ring-slate-500 accent-slate-900"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Comfortable</span>
                <span className="text-[11px] text-slate-500 font-medium block">Spacious row padding for high-legibility screens</span>
              </div>
            </label>

            <label className="flex items-center gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 cursor-pointer select-none flex-1">
              <input
                type="radio"
                name="tableDensity"
                value="compact"
                checked={formData.tableDensity === 'compact'}
                onChange={(e) => setFormData({ ...formData, tableDensity: e.target.value })}
                className="w-4 h-4 text-slate-900 focus:ring-slate-500 accent-slate-900"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Compact</span>
                <span className="text-[11px] text-slate-500 font-medium block">High-density rows to fit more data on screen</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Controls & Reset Trigger */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenResetModal}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 underline underline-offset-4 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Preferences</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardPreferences;
