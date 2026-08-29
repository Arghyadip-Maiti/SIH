import { useState, lazy, Suspense } from 'react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { LoadingState } from '../ui/LoadingState';
import { MapPin, Activity, CheckCircle2, Clock, ShieldAlert, IndianRupee } from 'lucide-react';

const LokSabhaConstituencyMap = lazy(() => import('../maps/LokSabhaConstituencyMap'));

export const IndiaGeographicAnalyticsSection = ({ filters = {} }) => {
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  return (
    <Card className="p-5 border border-slate-200 rounded-2xl bg-white ">
      <SectionHeader
        title="Geographic Distribution & Performance"
        subtitle="Interactive 543 Lok Sabha Constituency spatial map and regional analytics detail center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Leaflet GeoJSON Map Lazy Loaded */}
        <div className="lg:col-span-8">
          <Suspense fallback={<LoadingState message="Lazy loading interactive 543 Parliamentary Constituency map..." />}>
            <LokSabhaConstituencyMap
              selectedConstituency={selectedConstituency}
              onSelectConstituency={(data) => setSelectedConstituency(data)}
              filters={filters}
            />
          </Suspense>
        </div>

        {/* Side Detail Panel */}
        <div className="lg:col-span-4">
          {selectedConstituency ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-slate-700 shrink-0" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedConstituency.constituencyName}
                  </h3>
                </div>
                <div className="text-xs font-semibold text-slate-500 mb-4">
                  {selectedConstituency.stateName} • Code: {selectedConstituency.constituencyId}
                </div>

                <div className="space-y-3">
                  {/* MP Info */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Representative MP</div>
                    <div className="text-sm font-extrabold text-slate-800 mt-0.5">{selectedConstituency.mpName || 'Member of Parliament'}</div>
                    <div className="text-xs text-slate-700 font-semibold">{selectedConstituency.party || 'Lok Sabha'}</div>
                  </div>

                  {/* Financials */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <IndianRupee className="w-3 h-3 text-slate-700" />
                        <span>Expenditure</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900 mt-1">
                        ₹{selectedConstituency.expenditureCr || 0} Cr
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        <span>Utilization</span>
                      </div>
                      <div className="text-base font-extrabold text-emerald-600 mt-1">
                        {selectedConstituency.utilization || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Work Counts */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedConstituency.totalWorks || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">Completed</div>
                      <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{selectedConstituency.completedWorks || 0}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] font-bold text-rose-600 uppercase">Delayed</div>
                      <div className="text-sm font-extrabold text-rose-600 mt-0.5">{selectedConstituency.delayedWorks || 0}</div>
                    </div>
                  </div>

                  {/* Risk */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Risk Rating</div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedConstituency.avgRiskScore || 0} / 100</div>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedConstituency(null)}
                className="w-full mt-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Deselect Constituency
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-center">
              <MapPin className="w-8 h-8 text-slate-400 mb-2" />
              <h4 className="text-sm font-extrabold text-slate-700">No Constituency Selected</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Hover over or click any Parliamentary Constituency on the map to inspect regional performance metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
