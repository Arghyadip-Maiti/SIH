import { useAnalyticsDashboard } from '../../hooks/useAnalyticsDashboard';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';
import { FutureOutlookHero } from '../../components/analytics/FutureOutlookHero';
import { AiInsightsSection } from '../../components/analytics/AiInsightsSection';
import { InteractiveTrendVisualizer } from '../../components/analytics/InteractiveTrendVisualizer';
import { ProjectCompletionForecast } from '../../components/analytics/ProjectCompletionForecast';
import { DelayBottleneckAnalysis } from '../../components/analytics/DelayBottleneckAnalysis';
import { FinancialOutlookSection } from '../../components/analytics/FinancialOutlookSection';
import { CostPressureAnalysis } from '../../components/analytics/CostPressureAnalysis';
import { GeographicIntelligenceMap } from '../../components/analytics/GeographicIntelligenceMap';
import { StateOutlookSection } from '../../components/analytics/StateOutlookSection';
import { MpOutlookSection } from '../../components/analytics/MpOutlookSection';
import { AgencyOutlookSection } from '../../components/analytics/AgencyOutlookSection';
import { PatternDiscoverySection } from '../../components/analytics/PatternDiscoverySection';
import { FutureHotspotsSection } from '../../components/analytics/FutureHotspotsSection';
import { DecisionRecommendationsSection } from '../../components/analytics/DecisionRecommendationsSection';
import { WhatIfScenarioSimulator } from '../../components/analytics/WhatIfScenarioSimulator';
import { AlertCircle, RefreshCw, BarChart2, Filter } from 'lucide-react';

export const AnalyticsPage = () => {
  const {
    filters,
    granularity,
    scenarioParams,
    analyticsData,
    loading,
    error,
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
      {/* 5. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100 inline-flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Strategic Planning Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Analytics & Trends
          </h1>
          <h2 className="text-sm font-extrabold text-blue-700 mt-1">
            MPLADS Decision Intelligence
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Analyze historical patterns, understand current trends, forecast future outcomes and identify areas requiring administrative attention.
          </p>
        </div>
      </div>

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

          {/* 7. 🧠 AI-GENERATED INSIGHTS */}
          <AiInsightsSection insights={analyticsData?.insights} kpis={analyticsData?.kpis} />

          {/* STEP 2: WHY IS IT HAPPENING? */}
          {/* 8. 📈 TREND ANALYSIS */}
          <InteractiveTrendVisualizer
            analyticsData={analyticsData}
            granularity={granularity}
            onGranularityChange={setGranularity}
          />

          {/* 9. 🏗️ PROJECT COMPLETION FORECAST */}
          <ProjectCompletionForecast data={analyticsData?.completionForecast} />

          {/* 10. ⏱️ DELAY & BOTTLENECK ANALYSIS */}
          <DelayBottleneckAnalysis data={analyticsData?.bottleneckAnalysis} />

          {/* 11 & 12. FINANCIAL OUTLOOK & COST PRESSURE ANALYSIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialOutlookSection data={analyticsData?.financialOutlook} />
            <CostPressureAnalysis data={analyticsData?.costPressureAnalysis} />
          </div>

          {/* STEP 3: WHERE WILL IT HAPPEN? */}
          {/* 13 & 14. 🗺️ GEOGRAPHIC INTELLIGENCE (INDIA MAP & SIDE PANEL) */}
          <GeographicIntelligenceMap
            analyticsData={analyticsData}
            filters={filters}
            onApplyFilter={applyCrossFilter}
          />

          {/* 15. 🏛️ STATE OUTLOOK */}
          <StateOutlookSection data={analyticsData?.stateOutlook} />

          {/* 16 & 17. MP OUTLOOK & AGENCY INTEL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MpOutlookSection data={analyticsData?.mpOutlook} />
            <AgencyOutlookSection data={analyticsData?.agencyOutlook} />
          </div>

          {/* 18. 🔎 PATTERN DISCOVERY */}
          <PatternDiscoverySection data={analyticsData?.patternDiscovery} />

          {/* 19. ⚠️ FUTURE HOTSPOTS */}
          <FutureHotspotsSection
            data={analyticsData?.futureHotspots}
            onApplyFilter={applyCrossFilter}
          />

          {/* STEP 4: WHAT SHOULD WE DO? */}
          {/* 20. 🎯 DECISION RECOMMENDATIONS */}
          <DecisionRecommendationsSection data={analyticsData?.recommendations} />

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
