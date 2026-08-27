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
import { HouseExpenditureSection } from './components/HouseExpenditureSection';
import { HighLevelAttentionSection } from './components/HighLevelAttentionSection';

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

  if (loading && !overviewData) {
    return <LoadingState message="Loading MPLADS Command Center metrics..." />;
  }

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
    <div className="space-y-6 pb-12 animate-fadeIn">
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

      {/* 4. Financial Overview & Flow */}
      <FinancialOverviewSection kpis={kpis} />

      {/* 5. Project Status Overview & Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProjectStatusSection
          statusDistribution={statusDistribution}
          totalWorks={kpis.totalWorks || 124583}
        />
        <SectorExpenditureSection sectorDistribution={sectorDistribution} />
      </div>

      {/* 6. India Map & Geographic Distribution (Temporarily hidden per request, code preserved intact) */}
      <IndiaMapSection filters={filters} />

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
      />

      {/* 9. House-wise Expenditure Breakdown */}
      <HouseExpenditureSection houseExpenditure={houseExpenditure} />

      {/* 10. High Level Attention Items & AI Insights */}
      <HighLevelAttentionSection
        highLevelAttention={highLevelAttention}
        aiInsights={aiInsights}
      />
    </div>
  );
};

export default OverviewPage;
