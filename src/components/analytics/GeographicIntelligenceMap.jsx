import { useState, useEffect } from 'react';
import { Map, Layers, X, ExternalLink, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { LokSabhaConstituencyMap } from '../maps/LokSabhaConstituencyMap';
import { useApp } from '../../context/AppContext';

export const GeographicIntelligenceMap = ({
  analyticsData,
  filters = {},
  onApplyFilter,
}) => {
  const { dashboardPreferences } = useApp();
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedMapMetric, setSelectedMapMetric] = useState(() => dashboardPreferences?.mapMetric || 'utilization');

  useEffect(() => {
    if (dashboardPreferences?.mapMetric) {
      setSelectedMapMetric(dashboardPreferences.mapMetric);
    }
  }, [dashboardPreferences?.mapMetric]);

  const MAP_METRICS = [
    { id: 'utilization', label: 'Fund Utilization Rate (%)' },
    { id: 'completion', label: 'Project Completion Rate (%)' },
    { id: 'delay', label: 'Project Delays (Days)' },
    { id: 'avgCost', label: 'Average Project Cost (₹ Lakhs)' },
    { id: 'costOverrun', label: 'Cost Overrun Instances' },
    { id: 'projectDensity', label: 'Project Concentration (Works Count)' },
    { id: 'riskDensity', label: 'Risk Concentration (Composite Score)' },
    { id: 'expenditure', label: 'Expenditure (₹ Cr)' },
    { id: 'futureExpPressure', label: 'Future Expenditure Pressure' },
    { id: 'predictedDelayDensity', label: 'Predicted Delay Concentration' },
  ];

  const handleSelectConstituencyFromMap = (constData) => {
    if (!constData) {
      setSelectedConstituency(null);
      return;
    }
    // Blend with spatial analytics data if available
    const cName = (constData.constituencyName || constData.name || '').toLowerCase();
    const spatialExtra = analyticsData?.geographicAnalytics?.[cName] || {};

    setSelectedConstituency({
      ...constData,
      ...spatialExtra,
      constituencyName: constData.constituencyName || constData.name || 'Gaya',
      state: constData.state || 'Bihar',
      totalProjects: constData.totalProjects || spatialExtra.totalProjects || 184,
      utilization: constData.utilization || spatialExtra.utilization || 76.4,
      completion: constData.completionRate || spatialExtra.completion || 65.0,
      avgDelay: constData.daysDelayed || spatialExtra.delay || 18,
      forecastRisk: spatialExtra.forecastRisk || 'Moderate delay risk',
    });
  };

  const handleApplyDetailedAnalyticsFilter = () => {
    if (selectedConstituency && onApplyFilter) {
      if (selectedConstituency.state) {
        onApplyFilter('state', selectedConstituency.state);
      }
      if (selectedConstituency.constituencyName) {
        onApplyFilter('mp', selectedConstituency.constituencyName);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Geographic Intelligence & Spatial Analytics
            </h3>
          </div>
        </div>
      </div>

      {/* Main Map Box & Side Panel Layout */}
      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* Map Box */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-inner min-h-[540px]">
          <LokSabhaConstituencyMap
            selectedConstituency={selectedConstituency}
            onSelectConstituency={handleSelectConstituencyFromMap}
            filters={filters}
          />
        </div>

        {/* Side Panel Drawer (Appears when constituency is clicked) */}
        {selectedConstituency && (
          <div className="w-full lg:w-80 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-2xl flex flex-col justify-between transition-all animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Constituency Overview
                  </span>
                  <h4 className="text-lg font-black text-white mt-0.5 uppercase">
                    {selectedConstituency.constituencyName}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400">{selectedConstituency.state}</p>
                </div>
                <button
                  onClick={() => setSelectedConstituency(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Grid inside Side Panel */}
              <div className="space-y-3 mb-6">
                <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between border border-slate-700/60">
                  <span className="text-xs font-medium text-slate-300">Sanctioned Works</span>
                  <span className="text-sm font-extrabold text-white">{selectedConstituency.totalProjects}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between border border-slate-700/60">
                  <span className="text-xs font-medium text-slate-300">Fund Utilization</span>
                  <span className="text-sm font-extrabold text-emerald-400">{selectedConstituency.utilization}%</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between border border-slate-700/60">
                  <span className="text-xs font-medium text-slate-300">Project Completion</span>
                  <span className="text-sm font-extrabold text-blue-400">{selectedConstituency.completion}%</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between border border-slate-700/60">
                  <span className="text-xs font-medium text-slate-300">Average Delay</span>
                  <span className="text-sm font-extrabold text-amber-400">{selectedConstituency.avgDelay} Days</span>
                </div>

                <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">Forecast Risk Category</span>
                  <span className="text-xs font-extrabold text-indigo-200 mt-0.5 block">{selectedConstituency.forecastRisk}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyDetailedAnalyticsFilter}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>View Detailed Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeographicIntelligenceMap;
