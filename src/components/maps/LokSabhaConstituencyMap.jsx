import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  METRIC_OPTIONS,
  getConstituencyColor,
  matchConstituencyData,
} from '../../utils/constituencyDataMapper';
import { locationService } from '../../services/api/locationService';
import { MapLegend } from './MapLegend';
import { ConstituencyTooltip } from './ConstituencyTooltip';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Layers } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

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

export const LokSabhaConstituencyMap = ({
  selectedConstituency = null,
  onSelectConstituency,
  filters = {},
}) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [constituencyDataMap, setConstituencyDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMetric, setSelectedMetric] = useState('utilization');
  const [hoveredConstituency, setHoveredConstituency] = useState(null);
  const [resetCount, setResetCount] = useState(0);

  const geoJsonRef = useRef(null);

  // Load GeoJSON dataset and constituency service data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch('/LGD_Parliament_Constituencies.geojson').then((res) => res.json()),
      locationService.getConstituencyData(),
    ])
      .then(([geoData, constRes]) => {
        if (isMounted) {
          setGeoJsonData(geoData);
          setConstituencyDataMap(constRes.data || {});
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[GeoJSON/Constituency Load Error]', err);
        if (isMounted) {
          setError('Constituency boundary data could not be loaded.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute GeoJSON bounds for auto fitBounds
  const geoJsonBounds = useMemo(() => {
    if (!geoJsonData) return null;
    try {
      const leafletGeoJson = L.geoJSON(geoJsonData);
      return leafletGeoJson.getBounds();
    } catch (e) {
      console.error('[Bounds Error]', e);
      return null;
    }
  }, [geoJsonData]);

  // Handle map reset action
  const handleResetMap = useCallback(() => {
    if (onSelectConstituency) {
      onSelectConstituency(null);
    }
    setSelectedMetric('utilization');
    setResetCount((prev) => prev + 1);
  }, [onSelectConstituency]);

  // Style calculator for GeoJSON polygon features
  const styleFeature = useCallback(
    (feature) => {
      const data = matchConstituencyData(feature, constituencyDataMap, filters);
      const pcId = String(feature.properties?.pc_id || '');
      const isSelected = selectedConstituency?.constituencyId === pcId;

      if (!data || data.isFilteredOut) {
        return {
          fillColor: '#94A3B8', // Gray No Data / Filtered Out
          fillOpacity: 0.35,
          weight: 0.6,
          color: '#64748B',
        };
      }

      const metricVal = data[selectedMetric];
      const color = getConstituencyColor(metricVal, selectedMetric);

      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.95 : 0.75,
        weight: isSelected ? 3 : 0.8,
        color: isSelected ? '#1e293b' : '#334155',
      };
    },
    [filters, selectedMetric, selectedConstituency, constituencyDataMap]
  );

  // Bind interactive handlers (hover tooltip, click selection) to each polygon feature
  const onEachFeature = useCallback(
    (feature, layer) => {
      const data = matchConstituencyData(feature, constituencyDataMap, filters);

      if (data && !data.isFilteredOut) {
        // Tooltip rendering using ConstituencyTooltip component
        const tooltipHtml = ReactDOMServer.renderToString(
          <ConstituencyTooltip data={data} metric={selectedMetric} />
        );
        layer.bindTooltip(tooltipHtml, {
          direction: 'top',
          sticky: true,
          className: 'custom-leaflet-tooltip',
        });
      } else {
        const pcName = feature.properties?.pc_name || 'Constituency';
        const stName = feature.properties?.st_name || '';
        layer.bindTooltip(`<div className="text-xs font-bold p-1">${pcName} (${stName}) - No Data</div>`, {
          direction: 'top',
          sticky: true,
        });
      }

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            fillOpacity: 0.9,
            weight: 2,
            color: '#0F172A',
          });
          l.bringToFront();
          setHoveredConstituency(data);
        },
        mouseout: (e) => {
          if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(e.target);
          }
          setHoveredConstituency(null);
        },
        click: () => {
          if (data && !data.isFilteredOut && onSelectConstituency) {
            onSelectConstituency(data);
          }
        },
      });
    },
    [filters, selectedMetric, onSelectConstituency, constituencyDataMap]
  );

  if (loading) {
    return <LoadingState message="Loading 543 Lok Sabha Constituency boundaries..." />;
  }

  if (error || !geoJsonData) {
    return <ErrorState title="GeoJSON Loading Failed" message={error || 'Unable to render map.'} />;
  }

  return (
    <div className="space-y-3">
      {/* Map Control Bar Above Map */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 ">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-slate-700" />
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Map Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            {METRIC_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedConstituency && (
            <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
              Selected: {selectedConstituency.constituencyName}
            </span>
          )}

          <Button
            onClick={handleResetMap}
            variant="outline"
            size="sm"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5"
          >
            <span>Reset Map</span>
          </Button>
        </div>
      </div>

      {/* React Leaflet Map Canvas Box */}
      <div className="relative w-full h-[580px] rounded-2xl border border-slate-200  overflow-hidden z-0">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
        wheelPxPerZoomLevel={120}
        wheelDebounceTime={100}
        zoomDelta={0.5}
        zoomSnap={0.5}
          className="w-full h-full bg-slate-100"
          zoomControl={true}
        >
          {/* Tile Layer (Clean Light Voyager Basemap) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          />

          {/* Auto fitBounds Controller */}
          <MapBoundsController geoJsonBounds={geoJsonBounds} resetTrigger={resetCount} />

          {/* 543 Lok Sabha GeoJSON Choropleth Layer */}
          <GeoJSON
            key={`${selectedMetric}-${resetCount}-${JSON.stringify(filters)}`}
            ref={geoJsonRef}
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>

        {/* Dynamic Metric Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[500]">
          <MapLegend metric={selectedMetric} />
        </div>
      </div>
    </div>
  );
};

export default LokSabhaConstituencyMap;
