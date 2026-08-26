import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { MapPin, ExternalLink, X } from 'lucide-react';

export const IndiaMapSection = ({ statePerformance = [] }) => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState('expenditureCr');
  const [activeState, setActiveState] = useState(statePerformance[0] || null);

  const getMetricValue = (st) => {
    switch (selectedMetric) {
      case 'expenditureCr':
        return `₹${st.expenditureCr} Cr`;
      case 'totalWorks':
        return st.totalWorks.toLocaleString('en-IN');
      case 'utilization':
        return `${st.utilization}%`;
      case 'completionRate':
        return `${st.completionRate}%`;
      case 'avgRiskScore':
        return st.avgRiskScore;
      case 'delayedWorks':
        return st.delayedWorks;
      default:
        return st.expenditureCr;
    }
  };

  const getMarkerColor = (st) => {
    if (selectedMetric === 'avgRiskScore') {
      if (st.avgRiskScore >= 60) return '#DC2626'; // Red Critical
      if (st.avgRiskScore >= 40) return '#F59E0B'; // Amber High
      return '#16A34A'; // Green Low
    }
    if (selectedMetric === 'utilization') {
      if (st.utilization >= 85) return '#16A34A';
      if (st.utilization >= 75) return '#2563EB';
      return '#F59E0B';
    }
    return '#2563EB';
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <h3 className="text-base font-bold text-slate-900">Expenditure &amp; Performance by State</h3>
            <p className="text-xs text-slate-500">Interactive geographical distribution of MPLADS works</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none"
            >
              <option value="expenditureCr">Expenditure (₹ Cr)</option>
              <option value="totalWorks">Total Works</option>
              <option value="utilization">Utilization %</option>
              <option value="completionRate">Completion Rate %</option>
              <option value="avgRiskScore">Average Risk Score</option>
              <option value="delayedWorks">Delayed Works</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map Visualization Box */}
        <div className="lg:col-span-2 relative bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 min-h-[380px] flex items-center justify-center overflow-hidden">
          {/* India SVG Outline Map Representation */}
          <div className="relative w-full max-w-lg aspect-[4/4.5] flex items-center justify-center">
            <svg viewBox="0 0 600 700" className="w-full h-full text-slate-300 stroke-slate-400">
              {/* Simplified India Map Path */}
              <path
                d="M 280,60 L 320,80 L 350,110 L 380,100 L 410,130 L 400,160 L 450,180 L 520,170 L 550,210 L 520,240 L 470,230 L 450,260 L 380,280 L 350,330 L 330,380 L 290,440 L 270,520 L 250,580 L 240,640 L 220,590 L 190,510 L 170,430 L 150,360 L 120,310 L 90,260 L 110,210 L 140,180 L 190,150 L 230,120 L 250,70 Z"
                fill="#E2E8F0"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
            </svg>

            {/* Interactive Markers for Major States */}
            {statePerformance.map((st) => {
              // Convert lat/lng to CSS percentages relative to box
              const topPct = Math.min(88, Math.max(12, 100 - ((st.lat - 8) / (35 - 8)) * 88));
              const leftPct = Math.min(88, Math.max(12, ((st.lng - 68) / (97 - 68)) * 88));
              const isSelected = activeState?.state === st.state;

              return (
                <button
                  key={st.state}
                  onClick={() => setActiveState(st)}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all z-10`}
                >
                  <div
                    className={`flex items-center justify-center p-1.5 rounded-full shadow-md transition-transform ${
                      isSelected ? 'scale-125 ring-4 ring-blue-400/50' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: getMarkerColor(st) }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* Marker Tooltip Badge */}
                  <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                    {st.state}: {getMetricValue(st)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Color Scale Legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs text-[11px]">
            <span className="font-bold text-slate-700 block mb-1">Expenditure (₹ Cr)</span>
            <div className="space-y-1 text-slate-600 font-medium">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600"></span> &gt; 2000</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600"></span> 1000 - 2000</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-500"></span> 500 - 1000</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500"></span> 100 - 500</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500"></span> &lt; 100</div>
            </div>
          </div>
        </div>

        {/* Selected State Inspector Card (Matching Image 3) */}
        {activeState ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4 relative animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h4 className="text-base font-extrabold text-slate-900">{activeState.state}</h4>
              <button
                onClick={() => setActiveState(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs mb-5">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Expenditure</span>
                <span className="font-mono font-extrabold text-blue-600 text-sm">₹{activeState.expenditureCr} Cr</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Utilization</span>
                <span className="font-mono font-bold text-slate-900">{activeState.utilization}%</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Total Works</span>
                <span className="font-mono font-bold text-slate-900">{activeState.totalWorks.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Completed</span>
                <span className="font-mono font-bold text-emerald-700">{activeState.completedWorks?.toLocaleString('en-IN') || Math.round(activeState.totalWorks * 0.8)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">In Progress</span>
                <span className="font-mono font-bold text-blue-700">{activeState.inProgressWorks?.toLocaleString('en-IN') || Math.round(activeState.totalWorks * 0.15)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Delayed</span>
                <span className="font-mono font-bold text-rose-600">{activeState.delayedWorks}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate(`/projects?state=${encodeURIComponent(activeState.state)}`)}
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <span>View Details</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed p-6 text-center text-slate-500">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Select a state on the map</p>
            <p className="text-[11px] text-slate-400 mt-1">Click any state marker to view complete district metrics and project progress.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
