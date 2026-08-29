import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  METRIC_OPTIONS,
  getConstituencyColor,
} from '../../utils/constituencyDataMapper';
import { MapLegend } from './MapLegend';
import { ConstituencyTooltip } from './ConstituencyTooltip';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Layers } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

const matchStateData = (feature, statePerformance) => {
  const p = feature.properties || {};
  const stName = String(p.ST_NM || '').trim().toLowerCase();
  
  if (!stName) return null;

  const record = statePerformance.find(
    (s) => s.state.toLowerCase() === stName || s.state.toLowerCase().includes(stName) || stName.includes(s.state.toLowerCase())
  );

  return record || null;
};

// Inner component to dynamically control map bounds & view reset
const MapBoundsController = ({ geoJsonBounds, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonBounds && map) {
      map.fitBounds(geoJsonBounds, { padding: [20, 20], maxZoom: 8 });
    }
  }, [geoJsonBounds, resetTrigger, map]);

  return null;
};

const StateMap = ({
  selectedConstituency, // will act as selectedState
  onSelectConstituency, // will act as onSelectState
  filters = {},
  activeMetric = 'utilization',
  statePerformance = [],
}) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetCount, setResetCount] = useState(0);

  const geoJsonRef = useRef(null);

  // Load GeoJSON dataset
  useEffect(() => {
    let isMounted = true;
    const loadGeoJson = async () => {
      try {
        setLoading(true);
        const res = await fetch('/india_states.geojson');
        if (!res.ok) throw new Error('Failed to fetch GeoJSON');
        const geoData = await res.json();
        if (isMounted) {
          setGeoJsonData(geoData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('[GeoJSON Load Error]', err);
          setError('Failed to load map data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGeoJson();
    return () => { isMounted = false; };
  }, []);

  // Compute GeoJSON bounds for auto fitBounds
  const geoJsonBounds = useMemo(() => {
    if (!geoJsonData) return null;
    try {
      const leafletGeoJson = L.geoJSON(geoJsonData);
      return leafletGeoJson.getBounds();
    } catch (e) {
      return null;
    }
  }, [geoJsonData]);

  // Style calculator for GeoJSON polygon features
  const styleFeature = useCallback(
    (feature) => {
      const data = matchStateData(feature, statePerformance);
      const stName = String(feature.properties?.ST_NM || '');
      const isSelected = selectedConstituency?.state === stName || selectedConstituency?.constituencyName === stName;

      if (!data) {
        return {
          fillColor: '#94A3B8', // Gray No Data
          fillOpacity: 0.35,
          weight: 0.6,
          color: '#F1F5F9', // Light border
        };
      }

      let metricValue = null;
      switch (activeMetric) {
        case 'utilization': metricValue = data.utilization; break;
        case 'completionRate': metricValue = data.completionRate; break;
        case 'delayedProjects': metricValue = data.delayedWorks; break;
        case 'averageRiskScore': metricValue = data.avgRiskScore; break;
        case 'expenditure': metricValue = data.expenditureCr * 10000000; break;
        case 'totalProjects': metricValue = data.totalWorks; break;
      }

      return {
        fillColor: getConstituencyColor(metricValue, activeMetric),
        fillOpacity: isSelected ? 1 : 0.85,
        weight: isSelected ? 2.5 : 0.8,
        color: isSelected ? '#1E293B' : '#FFFFFF',
      };
    },
    [activeMetric, statePerformance, selectedConstituency]
  );

  // Redraw geojson on state/metric change
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer) => {
        const feature = layer.feature;
        const newStyle = styleFeature(feature);
        layer.setStyle(newStyle);
      });
    }
  }, [styleFeature]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const data = matchStateData(feature, statePerformance);
        const layer = e.target;
        layer.setStyle({ fillOpacity: 1, weight: 1.5, color: '#475569' });
        layer.bringToFront();

        const tooltipContent = ReactDOMServer.renderToString(
          <ConstituencyTooltip feature={feature} data={data} metric={activeMetric} isState={true} />
        );
        layer.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'custom-leaflet-tooltip',
          direction: 'top',
        }).openTooltip();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
        e.target.closeTooltip();
      },
      click: (e) => {
        const data = matchStateData(feature, statePerformance);
        if (data) {
          // Wrap data to look like constituency object for the details panel
          const wrappedData = {
            constituencyName: data.state,
            state: data.state,
            totalProjects: data.totalWorks,
            averageRiskScore: data.avgRiskScore,
            utilization: data.utilization,
            completionRate: data.completionRate,
            expenditure: data.expenditureCr * 10000000,
            delayedProjects: data.delayedWorks,
            ...data
          };
          onSelectConstituency(wrappedData);
        }
      },
    });
  };

  const handleResetView = () => {
    setResetCount((c) => c + 1);
    onSelectConstituency(null);
  };

  if (loading && !geoJsonData) {
    return <LoadingState message="Loading India State GeoJSON Boundaries..." />;
  }

  if (error || !geoJsonData) {
    return <ErrorState title="GeoJSON Loading Failed" message={error || 'Unable to render map.'} />;
  }

  return (
    <div className="relative w-full h-[580px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-200">
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-white shadow-xs border-slate-200 text-slate-700 hover:bg-slate-50 w-full justify-center pointer-events-auto"
        > Reset View
        </Button>
      </div>

      <MapContainer
        center={[22.5937, 78.9629]} // Center of India
        zoom={4}
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

export default StateMap;
