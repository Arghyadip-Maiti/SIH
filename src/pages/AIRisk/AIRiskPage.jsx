import { useAiRiskData } from '../../hooks/useAiRiskData';
import { AIRiskHeader } from '../../components/ai-risk/AIRiskHeader';
import { AIRiskFilterBar } from '../../components/ai-risk/AIRiskFilterBar';
import { RiskKpiCards } from '../../components/ai-risk/RiskKpiCards';
import { ProjectsRequiringAttentionTable } from '../../components/ai-risk/ProjectsRequiringAttentionTable';
import { RiskDistributionSection } from '../../components/ai-risk/RiskDistributionSection';
import { AnomalyDistributionSection } from '../../components/ai-risk/AnomalyDistributionSection';
import { StateRiskOverviewSection } from '../../components/ai-risk/StateRiskOverviewSection';
import { AgencyRiskOverviewSection } from '../../components/ai-risk/AgencyRiskOverviewSection';
import { MPRiskOverviewSection } from '../../components/ai-risk/MPRiskOverviewSection';

export const AIRiskPage = () => {
  const {
    filters,
    projectsData,
    loading,
    error,
    lastAnalysisTime,
    kpis,
    riskDistribution,
    anomalyDistribution,
    stateRiskOverview,
    agencyRiskOverview,
    mpRiskOverview,
    handleFilterChange,
    applyCrossFilter,
    resetFilters,
  } = useAiRiskData();

  if (loading && projectsData.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-sm font-extrabold text-slate-800">
          Running AI Risk & Anomaly Diagnostics...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating financial claims, photo evidence, spatial distance, and execution progress for active MPLADS works.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-800">
        <h3 className="text-base font-extrabold">Failed to load AI Risk Monitor</h3>
        <p className="text-xs mt-1 text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with System Active indicator & Counts */}
      <AIRiskHeader
        totalActiveProjects={kpis.totalActiveProjects}
        lastAnalysisTime={lastAnalysisTime}
      />

      {/* 2. Filter Bar (No FY filter, No Risk Level filter, No MP filter) */}
      <AIRiskFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* 3. Risk KPI Cards (Cumulative metrics for risky projects) */}
      <RiskKpiCards kpis={kpis} />

      {/* 4. Projects Requiring Attention Table (Main Section) */}
      <ProjectsRequiringAttentionTable
        projects={projectsData}
      />

      {/* 5. Risk Distribution & Anomaly Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionSection data={riskDistribution} />
        <AnomalyDistributionSection data={anomalyDistribution} />
      </div>

      {/* 6. State Risk Overview */}
      <StateRiskOverviewSection data={stateRiskOverview} />

      {/* 7. Implementing Agency Risk & MP Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AgencyRiskOverviewSection
            data={agencyRiskOverview}
            selectedAgency={filters.agency}
            onAgencySelect={(agName) => applyCrossFilter('agency', agName)}
            onResetAgency={() => handleFilterChange('agency', 'All Agencies')}
          />
        </div>
        <div className="lg:col-span-5">
          <MPRiskOverviewSection
            data={mpRiskOverview}
            selectedMp={filters.search}
            onMpSelect={(mpName) => applyCrossFilter('search', mpName)}
            onResetMp={() => handleFilterChange('search', '')}
          />
        </div>
      </div>
    </div>
  );
};

export default AIRiskPage;
