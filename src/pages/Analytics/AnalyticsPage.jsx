import { useAnalyticsDashboard } from '../../hooks/useAnalyticsDashboard';
import { AnalyticsHeader } from '../../components/analytics/AnalyticsHeader';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { FutureOutlookHero } from '../../components/analytics/FutureOutlookHero';
import { ProjectCompletionForecast } from '../../components/analytics/ProjectCompletionForecast';
import { DelayBottleneckAnalysis } from '../../components/analytics/DelayBottleneckAnalysis';
import { CostPressureAnalysis } from '../../components/analytics/CostPressureAnalysis';
import { GeographicIntelligenceMap } from '../../components/analytics/GeographicIntelligenceMap';
import { AgencyOutlookSection } from '../../components/analytics/AgencyOutlookSection';
import { WhatIfScenarioSimulator } from '../../components/analytics/WhatIfScenarioSimulator';
import { AlertCircle, RefreshCw, Filter } from 'lucide-react';

export const AnalyticsPage = () => {
  const {
    filters,
    granularity,
    scenarioParams,
    analyticsData,
    loading,
    refreshing,
    error,
    lastUpdated,
    setGranularity,
    setScenarioParams,
    handleFilterChange,
    applyCrossFilter,
    resetFilters,
    refreshData,
  } = useAnalyticsDashboard();

  if (error) {
    return (
      <div className="p-8 text-center bg-white border border-rose-200 rounded-3xl my-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-black text-slate-900">Unable to load analytics</h3>
        <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto mt-1 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* PAGE HEADER */}
      <AnalyticsHeader
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={refreshData}
      />

      {/* 4. GLOBAL FILTERS */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        activeCount={analyticsData?.totalCount || 0}
      />

      {/* SKELETON LOADER STATE */}
      {loading && !analyticsData ? (
        <div className="space-y-6">
          <div className="h-96 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
            <div className="h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
          </div>
        </div>
      ) : analyticsData?.totalCount === 0 ? (
        /* EMPTY STATE FOR FILTERS */
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center my-8">
          <Filter className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800">No analytics available for the selected filters</h3>
          <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Try adjusting your state, district, MP, or sector filter combinations to view data.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* STORYTELLING FLOW LAYOUT */
        <>
          {/* STEP 1: WHAT HAPPENED & WHAT IS HAPPENING NEXT? */}
          {/* 6. 🔮 FUTURE OUTLOOK HERO */}
          <FutureOutlookHero data={analyticsData?.futureOutlook} />

          {/* STEP 2: WHY IS IT HAPPENING? */}

          {/* 9. 🏗️ HISTORIC COMPARISON */}
          <ProjectCompletionForecast data={analyticsData?.completionForecast} />

          {/* 10. ⏱️ AVERAGE DELAY & BOTTLENECK ANALYSIS */}
          <DelayBottleneckAnalysis data={analyticsData?.bottleneckAnalysis} />

          {/* 12. COST PRESSURE ANALYSIS */}
          <CostPressureAnalysis data={analyticsData?.costPressureAnalysis} />

          {/* STEP 3: WHERE WILL IT HAPPEN? */}
          {/* 13 & 14. 🗺️ GEOGRAPHIC INTELLIGENCE (INDIA MAP & SIDE PANEL) */}
          <GeographicIntelligenceMap
            analyticsData={analyticsData}
            filters={filters}
            onApplyFilter={applyCrossFilter}
          />

          {/* 17. AGENCY INTEL */}
          <AgencyOutlookSection data={analyticsData?.agencyOutlook} />

          {/* STEP 4: WHAT SHOULD WE DO? */}
          {/* 21. 🧪 WHAT-IF SCENARIO ANALYSIS */}
          <WhatIfScenarioSimulator
            simulationData={analyticsData?.whatIfSimulation}
            scenarioParams={scenarioParams}
            onParamsChange={setScenarioParams}
          />
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
