import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { METRIC_OPTIONS, getConstituencyColor } from '../../utils/constituencyDataMapper';
import { MapLegend } from './MapLegend';
import { ConstituencyTooltip } from './ConstituencyTooltip';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/LoadingState';
import { MapLoadingSkeleton } from '../ui/MapLoadingSkeleton';
import { ErrorState } from '../ui/ErrorState';
import { Layers, ArrowLeft } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

const pseudoHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const generateDistrictData = (districtName, stateName) => {
  const hash = pseudoHash(districtName + stateName);
  return {
    constituencyName: districtName,
    state: stateName,
    utilization: 40 + (hash % 60),
    completionRate: 40 + ((hash * 2) % 60),
    delayedProjects: hash % 20,
    averageRiskScore: hash % 100,
    expenditure: 100000000 + (hash % 500000000),
    totalProjects: 50 + (hash % 200),
  };
};

const MapBoundsController = ({ geoJsonBounds, resetTrigger }) => {
  const map = useMap();
  useEffect(() => {
    if (geoJsonBounds && map) {
      map.fitBounds(geoJsonBounds, { padding: [20, 20], maxZoom: 8 });
    }
  }, [geoJsonBounds, resetTrigger, map]);
  return null;
};

const DistrictMap = ({
  zoomedState,
  onBack,
  selectedDistrict,
  onSelectDistrict,
  filters = {},
  activeMetric = 'utilization',
}) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetCount, setResetCount] = useState(0);

  const geoJsonRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadGeoJson = async () => {
      try {
        setLoading(true);
        const res = await fetch('/india_districts.geojson');
        if (!res.ok) throw new Error('Failed to fetch GeoJSON');
        const geoData = await res.json();
        
        if (isMounted) {
          // Filter features to only include the zoomedState
          // State name matching might need some sanitization
          const stateStr = zoomedState.state.toLowerCase();
          const filteredFeatures = geoData.features.filter(f => {
             const fName = String(f.properties?.NAME_1 || '').toLowerCase();
             return fName === stateStr || fName.includes(stateStr) || stateStr.includes(fName);
          });
          
          setGeoJsonData({ ...geoData, features: filteredFeatures });
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load district map data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadGeoJson();
    return () => { isMounted = false; };
  }, [zoomedState]);

  const geoJsonBounds = useMemo(() => {
    if (!geoJsonData || geoJsonData.features.length === 0) return null;
    try {
      const leafletGeoJson = L.geoJSON(geoJsonData);
      return leafletGeoJson.getBounds();
    } catch (e) {
      return null;
    }
  }, [geoJsonData]);

  const styleFeature = useCallback(
    (feature) => {
      const dtName = String(feature.properties?.NAME_2 || '');
      const stName = String(feature.properties?.NAME_1 || '');
      const data = generateDistrictData(dtName, stName);
      
      const isSelected = selectedDistrict?.constituencyName === dtName;

      let metricValue = null;
      switch (activeMetric) {
        case 'utilization': metricValue = data.utilization; break;
        case 'completionRate': metricValue = data.completionRate; break;
        case 'delayedProjects': metricValue = data.delayedWorks; break;
        case 'averageRiskScore': metricValue = data.averageRiskScore; break;
        case 'expenditure': metricValue = data.expenditure; break;
        case 'totalProjects': metricValue = data.totalProjects; break;
      }

      return {
        fillColor: getConstituencyColor(metricValue, activeMetric),
        fillOpacity: isSelected ? 1 : 0.85,
        weight: isSelected ? 2.5 : 0.8,
        color: isSelected ? '#1E293B' : '#FFFFFF',
      };
    },
    [activeMetric, selectedDistrict]
  );

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
        const dtName = String(feature.properties?.NAME_2 || '');
        const stName = String(feature.properties?.NAME_1 || '');
        const data = generateDistrictData(dtName, stName);
        
        const layerTarget = e.target;
        layerTarget.setStyle({ fillOpacity: 1, weight: 1.5, color: '#475569' });
        layerTarget.bringToFront();

        const tooltipContent = ReactDOMServer.renderToString(
          <ConstituencyTooltip feature={feature} data={data} metric={activeMetric} isState={false} />
        );
        layerTarget.bindTooltip(tooltipContent, {
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
        const dtName = String(feature.properties?.NAME_2 || '');
        const stName = String(feature.properties?.NAME_1 || '');
        const data = generateDistrictData(dtName, stName);
        onSelectDistrict(data);
      },
    });
  };

  const handleResetView = () => {
    setResetCount((c) => c + 1);
    onSelectDistrict(null);
  };

  if (loading && !geoJsonData) {
    return <MapLoadingSkeleton message={`Loading ${zoomedState.state} map data...`} />;
  }

  if (error || !geoJsonData || geoJsonData.features.length === 0) {
    return (
      <div className="relative w-full h-[580px] bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <ErrorState title="GeoJSON Loading Failed" message={error || `No district boundaries found for ${zoomedState.state}.`} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[580px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-1000 zoom-in-[0.98]">
      <div className="absolute top-4 left-4 z-[1000]">
        <Button onClick={onBack} variant="outline" size="sm" className="bg-white shadow-xs border-slate-200 text-slate-700 hover:bg-slate-50 pointer-events-auto">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

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

export default DistrictMap;
