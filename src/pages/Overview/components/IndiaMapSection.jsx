import { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { ConstituencyDetailsPanel } from '../../../components/overview/ConstituencyDetailsPanel';
import { MapLoadingSkeleton } from '../../../components/ui/MapLoadingSkeleton';
import { MapPin } from 'lucide-react';
import { METRIC_OPTIONS } from '../../../utils/constituencyDataMapper';
import { CustomSelect } from '../../../components/ui/CustomSelect';

const StateMap = lazy(() => import('../../../components/maps/StateMap'));
const DistrictMap = lazy(() => import('../../../components/maps/DistrictMap'));
const LokSabhaStateMap = lazy(() => import('../../../components/maps/LokSabhaStateMap'));

export const IndiaMapSection = ({ filters = {}, statePerformance = [] }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [zoomedState, setZoomedState] = useState(null);
  const [activeMetric, setActiveMetric] = useState('utilization');

  // Sub-view mode when a state is drilled into
  const [viewMode, setViewMode] = useState('districts'); // 'districts' | 'loksabha'

  // Separate selection state per view so they don't bleed across tabs
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedLokSabha, setSelectedLokSabha] = useState(null);

  // null = unknown (loading), true = has data, false = no data for this state
  const [districtDataAvailable, setDistrictDataAvailable] = useState(null);
  const [loksabhaDataAvailable, setLoksabhaDataAvailable] = useState(null);

  // Pre-check both GeoJSONs as soon as a state is drilled into, so both tabs
  // show their availability status before the user has to click each one.
  useEffect(() => {
    if (!zoomedState) return;
    const stateStr = zoomedState.state.toLowerCase().trim();
    let cancelled = false;

    const checkDistricts = fetch('/india_districts.geojson')
      .then((r) => r.json())
      .then((geoData) => {
        if (cancelled) return;
        const found = geoData.features.some((f) => {
          const n = String(f.properties?.NAME_1 || '').toLowerCase().trim();
          return n === stateStr || n.includes(stateStr) || stateStr.includes(n);
        });
        setDistrictDataAvailable(found);
      })
      .catch(() => { if (!cancelled) setDistrictDataAvailable(false); });

    const checkLokSabha = fetch('/LGD_Parliament_Constituencies.geojson')
      .then((r) => r.json())
      .then((geoData) => {
        if (cancelled) return;
        const found = geoData.features.some((f) => {
          const n = String(f.properties?.st_name || '').toLowerCase().trim();
          return n === stateStr || n.includes(stateStr) || stateStr.includes(n);
        });
        setLoksabhaDataAvailable(found);
      })
      .catch(() => { if (!cancelled) setLoksabhaDataAvailable(false); });

    return () => { cancelled = true; };
  }, [zoomedState]);

  const handleStateSelect = (stateData) => {
    setSelectedState(stateData);
    if (stateData) {
      setZoomedState(stateData);
      setSelectedDistrict(null);
      setSelectedLokSabha(null);
      setViewMode('districts');
      // Reset availability — pre-check effect will populate these
      setDistrictDataAvailable(null);
      setLoksabhaDataAvailable(null);
    }
  };

  const handleBackToIndia = () => {
    setZoomedState(null);
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedLokSabha(null);
    setViewMode('districts');
    setDistrictDataAvailable(null);
    setLoksabhaDataAvailable(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'districts') setSelectedLokSabha(null);
    if (mode === 'loksabha') setSelectedDistrict(null);
  };

  const handleDistrictDataStatus = useCallback((hasData) => {
    setDistrictDataAvailable(hasData);
  }, []);

  const handleLokSabhaDataStatus = useCallback((hasData) => {
    setLoksabhaDataAvailable(hasData);
  }, []);

  // Active selection for the details panel
  const activeSelection = zoomedState
    ? viewMode === 'districts'
      ? selectedDistrict
      : selectedLokSabha
    : selectedState;

  // Tab button helper
  const TabBtn = ({ mode, label, available }) => {
    const isActive = viewMode === mode;
    const isUnavailable = available === false;
    const isLoading = available === null && zoomedState;

    return (
      <button
        onClick={() => !isUnavailable && handleViewModeChange(mode)}
        disabled={isUnavailable}
        title={isUnavailable ? `District/constituency data not available for ${zoomedState?.state}` : undefined}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 select-none shadow-xs border ${
          isActive
            ? 'bg-slate-900 text-white border-slate-900'
            : isUnavailable
              ? 'bg-white/80 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
        }`}
      >
        {label}
        {isLoading && !isActive && (
          <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
        )}
        {isUnavailable && (
          <span className="ml-1 text-[10px] font-normal not-italic opacity-80">N/A</span>
        )}
      </button>
    );
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {zoomedState
                  ? `MPLADS Performance - ${zoomedState.state}`
                  : 'MPLADS Performance by State'}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CustomSelect
              value={activeMetric}
              onChange={setActiveMetric}
              options={METRIC_OPTIONS.map((opt) => ({ label: opt.label, value: opt.id }))}
              defaultLabel="Select Metric"
            />
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP SECTION — lazy loaded, with floating toggle buttons */}
        <div className="lg:col-span-7 relative">

          {/* ── Toggle buttons: floats inside the map, top-center without parent box ── */}
          {zoomedState && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-2 pointer-events-auto">
              <TabBtn
                mode="districts"
                label="Districts"
                available={districtDataAvailable}
              />
              <TabBtn
                mode="loksabha"
                label="Lok Sabha"
                available={loksabhaDataAvailable}
              />
            </div>
          )}

          <Suspense fallback={<MapLoadingSkeleton message="Loading map modules..." />}>
            {zoomedState ? (
              viewMode === 'loksabha' ? (
                <LokSabhaStateMap
                  zoomedState={zoomedState}
                  activeMetric={activeMetric}
                  onBack={handleBackToIndia}
                  selectedConstituency={selectedLokSabha}
                  onSelectConstituency={setSelectedLokSabha}
                  onDataStatus={handleLokSabhaDataStatus}
                  filters={filters}
                />
              ) : (
                <DistrictMap
                  zoomedState={zoomedState}
                  activeMetric={activeMetric}
                  onBack={handleBackToIndia}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={setSelectedDistrict}
                  onDataStatus={handleDistrictDataStatus}
                  filters={filters}
                />
              )
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

        {/* DETAILS PANEL */}
        <div className="lg:col-span-5">
          <ConstituencyDetailsPanel selectedConstituency={activeSelection} viewMode={zoomedState ? viewMode : undefined} />
        </div>
      </div>
    </Card>
  );
};
