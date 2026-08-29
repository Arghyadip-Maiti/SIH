import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getConstituencyColor } from '../../utils/constituencyDataMapper';
import { MapLegend } from './MapLegend';
import { ConstituencyTooltip } from './ConstituencyTooltip';
import { Button } from '../ui/Button';
import { MapLoadingSkeleton } from '../ui/MapLoadingSkeleton';
import { ErrorState } from '../ui/ErrorState';
import { ArrowLeft } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Deterministic mock-data generator (same approach as DistrictMap)
const pseudoHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const generateConstituencyData = (pcName, stateName) => {
  const hash = pseudoHash(pcName + stateName);
  return {
    constituencyName: pcName,
    state: stateName,
    utilization: 40 + (hash % 60),
    completionRate: 40 + ((hash * 2) % 60),
    delayedProjects: hash % 20,
    averageRiskScore: hash % 100,
    expenditure: 100000000 + (hash % 500000000),
    totalProjects: 50 + (hash % 200),
  };
};

// Auto-fits the map to the filtered state bounds
const MapBoundsController = ({ geoJsonBounds, resetTrigger }) => {
  const map = useMap();
  useEffect(() => {
    if (geoJsonBounds && map) {
      map.fitBounds(geoJsonBounds, { padding: [20, 20], maxZoom: 9 });
    }
  }, [geoJsonBounds, resetTrigger, map]);
  return null;
};

const LokSabhaStateMap = ({
  zoomedState,
  onBack,
  selectedConstituency,
  onSelectConstituency,
  onDataStatus,           // (hasData: boolean) => void
  filters = {},
  activeMetric = 'utilization',
}) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetCount, setResetCount] = useState(0);

  const geoJsonRef = useRef(null);

  // Load and filter Lok Sabha GeoJSON to the clicked state
  useEffect(() => {
    let isMounted = true;
    const loadGeoJson = async () => {
      try {
        setLoading(true);
        const res = await fetch('/LGD_Parliament_Constituencies.geojson');
        if (!res.ok) throw new Error('Failed to fetch Lok Sabha GeoJSON');
        const geoData = await res.json();

        if (isMounted) {
          const stateStr = zoomedState.state.toLowerCase().trim();

          const filteredFeatures = geoData.features.filter((f) => {
            const fName = String(f.properties?.st_name || '').toLowerCase().trim();
            return (
              fName === stateStr ||
              fName.includes(stateStr) ||
              stateStr.includes(fName)
            );
          });

          setGeoJsonData({ ...geoData, features: filteredFeatures });
          // Report data availability back to parent
          onDataStatus?.(filteredFeatures.length > 0);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load Lok Sabha constituency data.');
          onDataStatus?.(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGeoJson();
    return () => { isMounted = false; };
  }, [zoomedState]);

  // Compute bounds for auto-fit
  const geoJsonBounds = useMemo(() => {
    if (!geoJsonData || geoJsonData.features.length === 0) return null;
    try {
      return L.geoJSON(geoJsonData).getBounds();
    } catch {
      return null;
    }
  }, [geoJsonData]);

  // Style each Lok Sabha constituency polygon
  const styleFeature = useCallback(
    (feature) => {
      const pcName = String(feature.properties?.pc_name || '');
      const stName = String(feature.properties?.st_name || '');
      const data = generateConstituencyData(pcName, stName);

      const isSelected =
        selectedConstituency?.constituencyName === pcName &&
        selectedConstituency?.state?.toLowerCase() === stName.toLowerCase();

      let metricValue = null;
      switch (activeMetric) {
        case 'utilization':      metricValue = data.utilization; break;
        case 'completionRate':   metricValue = data.completionRate; break;
        case 'delayedProjects':  metricValue = data.delayedProjects; break;
        case 'averageRiskScore': metricValue = data.averageRiskScore; break;
        case 'expenditure':      metricValue = data.expenditure; break;
        case 'totalProjects':    metricValue = data.totalProjects; break;
        default: metricValue = null;
      }

      return {
        fillColor: getConstituencyColor(metricValue, activeMetric),
        fillOpacity: isSelected ? 1 : 0.85,
        weight: isSelected ? 2.5 : 0.8,
        color: isSelected ? '#1E293B' : '#FFFFFF',
      };
    },
    [activeMetric, selectedConstituency]
  );

  // Re-apply styles when metric or selection changes without full re-mount
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer) => {
        layer.setStyle(styleFeature(layer.feature));
      });
    }
  }, [styleFeature]);

  // Hover / click handlers for each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const pcName = String(feature.properties?.pc_name || '');
        const stName = String(feature.properties?.st_name || '');
        const data = generateConstituencyData(pcName, stName);

        const target = e.target;
        target.setStyle({ fillOpacity: 1, weight: 1.5, color: '#475569' });
        target.bringToFront();

        // Reuse ConstituencyTooltip with isState=false (district-style)
        const tooltipContent = ReactDOMServer.renderToString(
          <ConstituencyTooltip
            feature={{
              properties: {
                NAME_2: pcName,   // constituency name slot
                NAME_1: stName,   // state slot
              },
            }}
            data={data}
            metric={activeMetric}
            isState={false}
          />
        );
        target
          .bindTooltip(tooltipContent, {
            sticky: true,
            className: 'custom-leaflet-tooltip',
            direction: 'top',
          })
          .openTooltip();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
        e.target.closeTooltip();
      },
      click: () => {
        const pcName = String(feature.properties?.pc_name || '');
        const stName = String(feature.properties?.st_name || '');
        const data = generateConstituencyData(pcName, stName);
        onSelectConstituency(data);
      },
    });
  };

  const handleResetView = () => {
    setResetCount((c) => c + 1);
    onSelectConstituency(null);
  };

  if (loading && !geoJsonData) {
    return (
      <MapLoadingSkeleton
        message={`Loading Lok Sabha constituencies for ${zoomedState.state}...`}
      />
    );
  }

  if (error || !geoJsonData || geoJsonData.features.length === 0) {
    return (
      <div className="relative w-full h-[580px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <ErrorState
          title="Lok Sabha Data Unavailable"
          message={
            error ||
            `No Lok Sabha constituency boundaries found for ${zoomedState.state}.`
          }
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[580px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-1000 zoom-in-[0.98]">
      {/* Back button — top-left (same as DistrictMap) */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="bg-white shadow-xs border-slate-200 text-slate-700 hover:bg-slate-50 pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Reset View button — top-right (same as DistrictMap) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-white shadow-xs border-slate-200 text-slate-700 hover:bg-slate-50 w-full justify-center pointer-events-auto"
        >
          Reset View
        </Button>
      </div>

      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        wheelPxPerZoomLevel={120}
        wheelDebounceTime={100}
        zoomDelta={0.5}
        zoomSnap={0.5}
        style={{ height: '100%', width: '100%', background: '#F8FAFC' }}
        attributionControl={false}
      >
        <MapBoundsController geoJsonBounds={geoJsonBounds} resetTrigger={resetCount} />

        <GeoJSON
          ref={geoJsonRef}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <MapLegend metric={activeMetric} />
    </div>
  );
};

export default LokSabhaStateMap;
