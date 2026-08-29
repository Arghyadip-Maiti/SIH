import { useState, lazy, Suspense } from 'react';
import { Card } from '../../../components/ui/Card';
import { ConstituencyDetailsPanel } from '../../../components/overview/ConstituencyDetailsPanel';
import { LoadingState } from '../../../components/ui/LoadingState';
import { MapLoadingSkeleton } from '../../../components/ui/MapLoadingSkeleton';
import { MapPin, ArrowLeft, ChevronDown } from 'lucide-react';
import { METRIC_OPTIONS } from '../../../utils/constituencyDataMapper';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { Button } from '../../../components/ui/Button';

import { useRef, useEffect } from 'react';



const StateMap = lazy(() => import('../../../components/maps/StateMap'));
const DistrictMap = lazy(() => import('../../../components/maps/DistrictMap'));

export const IndiaMapSection = ({ filters = {}, statePerformance = [] }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [zoomedState, setZoomedState] = useState(null); // When set, we show DistrictMap for that state
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [activeMetric, setActiveMetric] = useState('utilization');

  const handleStateSelect = (stateData) => {
    setSelectedState(stateData);
    if (stateData) {
      setZoomedState(stateData);
      setSelectedDistrict(null);
    }
  };

  const handleBackToIndia = () => {
    setZoomedState(null);
    setSelectedState(null);
    setSelectedDistrict(null);
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 ">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {zoomedState ? `MPLADS Performance - ${zoomedState.state}` : 'MPLADS Performance by State'}
              </h3>
              

            </div>
            
          </div>
          <div className="flex items-center gap-3">
            <CustomSelect
              value={activeMetric}
              onChange={setActiveMetric}
              options={METRIC_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
              defaultLabel="Select Metric"
            />
            
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP SECTION Lazy Loaded */}
        <div className="lg:col-span-7 relative">
          <Suspense fallback={<MapLoadingSkeleton message="Loading map modules..." />}>
            {zoomedState ? (
              <DistrictMap
                zoomedState={zoomedState}
                activeMetric={activeMetric}
                onBack={handleBackToIndia}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                filters={filters}
              />
            ) : (
              <StateMap
                selectedConstituency={selectedState}
                activeMetric={activeMetric}
                onSelectConstituency={handleStateSelect}
                filters={filters}
                statePerformance={statePerformance}
              />
            )}
          </Suspense>
        </div>

        {/* CONSTITUENCY DETAILS PANEL */}
        <div className="lg:col-span-5">
          <ConstituencyDetailsPanel 
            selectedConstituency={zoomedState ? selectedDistrict : selectedState} 
          />
        </div>
      </div>
    </Card>
  );
};
