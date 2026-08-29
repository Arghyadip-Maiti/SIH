import { useState, useEffect } from 'react';
import { useOverview } from '../../hooks/useOverview';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';

import { OverviewHeader } from './components/OverviewHeader';
import { OverviewFilterBar } from './components/OverviewFilterBar';
import { MainKPISets } from './components/MainKPISets';
import { FinancialOverviewSection } from './components/FinancialOverviewSection';
import { ProjectStatusSection } from './components/ProjectStatusSection';
import { SectorExpenditureSection } from './components/SectorExpenditureSection';
import { IndiaMapSection } from './components/IndiaMapSection';
import { StatePerformanceSection } from './components/StatePerformanceSection';
import { ExpenditureTrendSection } from './components/ExpenditureTrendSection';
import { HighLevelAttentionSection } from './components/HighLevelAttentionSection';
import { Card } from '../../components/ui/Card';

export const OverviewPage = () => {
  const {
    filters,
    overviewData,
    loading,
    refreshing,
    error,
    lastUpdated,
    kpis,
    statusDistribution,
    sectorDistribution,
    statePerformance,
    topDistricts,
    constituencyPerformance,
    expenditureTrend,
    worksCompletedTrend,
    houseExpenditure,
    highLevelAttention,
    aiInsights,
    handleFilterChange,
    resetFilters,
    refreshData,
  } = useOverview();

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && overviewData) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000); // Wait for the fade out transition
      return () => clearTimeout(timer);
    } else if (loading && !overviewData) {
      setShowSkeleton(true);
      setIsFadingOut(false);
    }
  }, [loading, overviewData]);


  if (error && !overviewData) {
    return (
      <ErrorState
        title="Unable to load Overview analytics"
        message={error}
        onRetry={refreshData}
      />
    );
  }

  return (
    <div className="relative min-h-full">
      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div 
          className={`absolute inset-0 z-50 transition-opacity duration-1000 bg-white ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <LoadingState message="Loading MPLADS Command Center metrics..." />
        </div>
      )}

      {/* Real Content */}
      {overviewData && (
        <div 
          className={`space-y-6 pb-12 transition-opacity duration-1000 ${
            isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
      {/* 1. Page Header */}
      <OverviewHeader
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={refreshData}
      />

      {/* 2. Global Filter Bar (Automatic Filter Application on Selection) */}
      <OverviewFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* 3. Main KPI Cards (8 Key Metrics) */}
      <MainKPISets kpis={kpis} />

            {/* Combined Charts Box */}
      <Card header={<h3 className="text-base font-bold text-slate-900">Key Metrics Overview</h3>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="py-2 md:py-0 md:pr-4">
            <FinancialOverviewSection kpis={kpis} />
          </div>
          <div className="py-6 md:py-0 md:px-4">
            <ProjectStatusSection
              statusDistribution={statusDistribution}
              totalWorks={kpis.totalWorks || 124583}
            />
          </div>
          <div className="py-6 md:py-0 md:pl-4">
            <SectorExpenditureSection sectorDistribution={sectorDistribution} />
          </div>
        </div>
      </Card>

      {/* 6. India Map & Geographic Distribution (Temporarily hidden per request, code preserved intact) */}
      <IndiaMapSection filters={filters} statePerformance={statePerformance} />

      {/* 7. State & Regional Performance */}
      <StatePerformanceSection
        statePerformance={statePerformance}
        topDistricts={topDistricts}
        filters={filters}
      />

      {/* 8. Expenditure & Works Trends */}
      <ExpenditureTrendSection
        expenditureTrend={expenditureTrend}
        worksCompletedTrend={worksCompletedTrend}
        houseExpenditure={houseExpenditure}
      />

      

      {/* 10. High Level Attention Items & AI Insights */}
      <HighLevelAttentionSection
        highLevelAttention={highLevelAttention}
        aiInsights={aiInsights}
      />
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
