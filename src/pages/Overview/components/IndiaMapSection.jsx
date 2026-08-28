import { useState, lazy, Suspense } from 'react';
import { Card } from '../../../components/ui/Card';
import { ConstituencyDetailsPanel } from '../../../components/overview/ConstituencyDetailsPanel';
import { LoadingState } from '../../../components/ui/LoadingState';
import { MapPin } from 'lucide-react';

const LokSabhaConstituencyMap = lazy(() => import('../../../components/maps/LokSabhaConstituencyMap'));

export const IndiaMapSection = ({ filters = {} }) => {
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                MPLADS Performance by Lok Sabha Constituency
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive 543-seat parliamentary constituency choropleth map joined with MPLADS financial, risk, and project metrics
            </p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP SECTION Lazy Loaded */}
        <div className="lg:col-span-7">
          <Suspense fallback={<LoadingState message="Lazy loading 543 Parliamentary Constituency map..." />}>
            <LokSabhaConstituencyMap
              selectedConstituency={selectedConstituency}
              onSelectConstituency={setSelectedConstituency}
              filters={filters}
            />
          </Suspense>
        </div>

        {/* CONSTITUENCY DETAILS PANEL (Right / Stacked below on mobile) */}
        <div className="lg:col-span-5">
          <ConstituencyDetailsPanel selectedConstituency={selectedConstituency} />
        </div>
      </div>
    </Card>
  );
};
