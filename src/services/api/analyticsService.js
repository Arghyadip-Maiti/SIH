import axiosClient from './axiosClient';
import { mockProjects } from '../../data/mockProjects';
import {
  filterProjects,
  calculateAnalyticsKPIs,
  calculateExpenditureTrend,
  calculateUtilizationTrend,
  calculateImplementationTrend,
  calculateStatusDistribution,
  calculateRiskTrend,
  calculateDelayAnalytics,
  calculateCostAnalysis,
  calculateProjectTypeDistribution,
  calculateStateRankings,
  calculateDistrictRankings,
  calculateMPRankings,
  calculateAgencyPerformance,
  getAgencyComparisonData,
  calculatePerformanceMatrix,
  calculateYoYComparison,
  generateAnalyticsInsights,
  calculateFutureOutlook,
  calculateCompletionForecast,
  calculateBottleneckAnalysis,
  calculateFinancialOutlook,
  calculateCostPressureAnalysis,
  calculateGeographicAnalytics,
  calculateStatePerformanceOutlook,
  calculateMpPerformanceOutlook,
  calculateAgencyPerformanceOutlook,
  calculatePatternDiscovery,
  calculateFutureHotspots,
  calculateRecommendations,
  calculateWhatIfSimulation,
} from '../../utils/analyticsEngine';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

import { overviewService } from './overviewService';

export const analyticsService = {
  async getOverviewAnalytics(filters = {}) {
    return overviewService.getOverviewAnalytics(filters);
  },

  async getFullAnalytics(filters = {}) {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 50));
      const filtered = filterProjects(mockProjects, filters);
      const kpis = calculateAnalyticsKPIs(filtered);
      const expenditureTrend = calculateExpenditureTrend(filtered, filters.granularity || 'Monthly', filters.metric || 'expenditure');
      const utilizationTrend = calculateUtilizationTrend(filtered);
      const implementationTrend = calculateImplementationTrend(filtered);
      const statusDistribution = calculateStatusDistribution(filtered);
      const riskTrend = calculateRiskTrend(filtered);
      const delayAnalytics = calculateDelayAnalytics(filtered);
      const costAnalysis = calculateCostAnalysis(filtered);
      const sectorDistribution = calculateProjectTypeDistribution(filtered);
      const stateRankings = calculateStateRankings(filtered);
      const districtRankings = calculateDistrictRankings(filtered);
      const mpRankings = calculateMPRankings(filtered);
      const agencyPerformance = calculateAgencyPerformance(filtered);
      const agencyComparison = getAgencyComparisonData(
        agencyPerformance,
        filters.agencyA || agencyPerformance[0]?.agency,
        filters.agencyB || agencyPerformance[1]?.agency
      );
      const performanceMatrix = calculatePerformanceMatrix(filtered, filters.matrixEntity || 'State');
      const yoyComparison = calculateYoYComparison(filtered);
      const insights = generateAnalyticsInsights(filtered, kpis);

      // Strategic Planning & Forecast Calculations
      const futureOutlook = calculateFutureOutlook(filtered);
      const completionForecast = calculateCompletionForecast(filtered);
      const bottleneckAnalysis = calculateBottleneckAnalysis(filtered);
      const financialOutlook = calculateFinancialOutlook(filtered);
      const costPressureAnalysis = calculateCostPressureAnalysis(filtered);
      const geographicAnalytics = calculateGeographicAnalytics(filtered, filters.mapMetric || 'utilization');
      const stateOutlook = calculateStatePerformanceOutlook(filtered);
      const mpOutlook = calculateMpPerformanceOutlook(filtered);
      const agencyOutlook = calculateAgencyPerformanceOutlook(filtered);
      const patternDiscovery = calculatePatternDiscovery(filtered);
      const futureHotspots = calculateFutureHotspots(filtered);
      const recommendations = calculateRecommendations(filtered);
      const whatIfSimulation = calculateWhatIfSimulation(filtered, filters.scenarioParams || {});

      return {
        success: true,
        data: {
          filteredProjects: filtered,
          totalCount: filtered.length,
          kpis,
          expenditureTrend,
          utilizationTrend,
          implementationTrend,
          statusDistribution,
          riskTrend,
          delayAnalytics,
          costAnalysis,
          sectorDistribution,
          stateRankings,
          districtRankings,
          mpRankings,
          agencyPerformance,
          agencyComparison,
          performanceMatrix,
          yoyComparison,
          insights,
          futureOutlook,
          completionForecast,
          bottleneckAnalysis,
          financialOutlook,
          costPressureAnalysis,
          geographicAnalytics,
          stateOutlook,
          mpOutlook,
          agencyOutlook,
          patternDiscovery,
          futureHotspots,
          recommendations,
          whatIfSimulation,
        },
      };
    }

    const response = await axiosClient.get('/analytics/dashboard', { params: filters });
    return response.data;
  },

  async getProjectAnalytics(filters = {}) {
    const res = await this.getFullAnalytics(filters);
    return { success: true, data: res.data?.sectorDistribution || [] };
  },

  async getFinancialAnalytics(filters = {}) {
    const res = await this.getFullAnalytics(filters);
    return { success: true, data: res.data?.expenditureTrend || [] };
  },

  async getStateAnalytics(filters = {}) {
    const res = await this.getFullAnalytics(filters);
    return { success: true, data: res.data?.stateRankings || [] };
  },

  async getDistrictAnalytics(state) {
    const res = await this.getFullAnalytics({ state });
    return { success: true, data: res.data?.districtRankings?.allDistricts || [] };
  },

  async getAgencyAnalytics(filters = {}) {
    const res = await this.getFullAnalytics(filters);
    return { success: true, data: res.data?.agencyPerformance || [] };
  },

  async simulateScenario(filters = {}, scenarioParams = {}) {
    if (USE_MOCK) {
      const filtered = filterProjects(mockProjects, filters);
      return { success: true, data: calculateWhatIfSimulation(filtered, scenarioParams) };
    }
    const response = await axiosClient.post('/analytics/simulate', { filters, scenarioParams });
    return response.data;
  },
};
