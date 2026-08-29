import {
  Wallet,
  Landmark,
  CircleDollarSign,
  Percent,
  FolderKanban,
  CheckCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { KPICard } from '../../../components/common/KPICard';
import { formatCurrency } from '../../../utils/formatCurrency';

export const MainKPISets = ({ kpis = {} }) => {
  const allocatedDisplay = formatCurrency(kpis.totalAllocated || 200000000000, true);
  const releasedDisplay = formatCurrency(kpis.totalReleasedAmount || 183200000000, true);
  const expenditureDisplay = formatCurrency(kpis.totalExpenditure || 158420000000, true);
  const utilizationDisplay = `${(kpis.utilizationPercentage || 77.2).toFixed(1)}%`;
  const totalWorksDisplay = (kpis.totalWorks || 124583).toLocaleString('en-IN');
  const completedWorksDisplay = (kpis.completedWorks || 78456).toLocaleString('en-IN');
  const delayedWorksDisplay = (kpis.delayedWorks || 8765).toLocaleString('en-IN');
  const highRiskWorksDisplay = ((kpis.criticalRiskCount || 187) + (kpis.highRiskCount || 1247)).toLocaleString('en-IN');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Funds Allocated */}
      <KPICard
        title="Total Funds Allocated"
        value={allocatedDisplay}
        icon={Wallet}
        iconBgColor="bg-purple-100 text-purple-700"
        trend="up"
        trendPercentage={kpis.allocatedTrend || 6.4}
        subtitle="vs 2025-26"
      />

      {/* 2. Total Funds Released */}
      <KPICard
        title="Total Funds Released"
        value={releasedDisplay}
        icon={Landmark}
        iconBgColor="bg-teal-100 text-teal-700"
        trend="up"
        trendPercentage={kpis.releasedTrend || 7.8}
        subtitle="vs 2025-26"
      />

      {/* 3. Total Expenditure */}
      <KPICard
        title="Total Expenditure"
        value={expenditureDisplay}
        icon={CircleDollarSign}
        iconBgColor="bg-slate-200 text-slate-800"
        trend="up"
        trendPercentage={kpis.expenditureTrend || 8.2}
        subtitle="vs 2025-26"
      />

      {/* 4. Utilization Percentage */}
      <KPICard
        title="Utilization Percentage"
        value={utilizationDisplay}
        icon={Percent}
        iconBgColor="bg-slate-200 text-slate-800"
        trend="up"
        trendPercentage={kpis.utilizationTrend || 5.6}
        subtitle="vs 2025-26"
      />

      {/* 5. Total Works */}
      <KPICard
        title="Total Works"
        value={totalWorksDisplay}
        icon={FolderKanban}
        iconBgColor="bg-slate-200 text-slate-800"
        trend="up"
        trendPercentage={kpis.worksTrend || 5.1}
        subtitle="vs 2025-26"
      />

      {/* 6. Completed Works */}
      <KPICard
        title="Completed Works"
        value={completedWorksDisplay}
        icon={CheckCircle}
        iconBgColor="bg-emerald-100 text-emerald-700"
        trend="up"
        trendPercentage={kpis.completedTrend || 6.3}
        subtitle="vs 2025-26"
      />

      {/* 7. Delayed Works */}
      <KPICard
        title="Delayed Works"
        value={delayedWorksDisplay}
        icon={Clock}
        iconBgColor="bg-rose-100 text-rose-700"
        trend="down"
        trendPercentage={Math.abs(kpis.delayedTrend || 2.3)}
        subtitle="vs 2025-26"
      />

      {/* 8. High Risk Works */}
      <KPICard
        title="High-Risk Works"
        value={highRiskWorksDisplay}
        icon={ShieldAlert}
        iconBgColor="bg-red-100 text-red-700"
        subtitle={`${kpis.criticalRiskCount || 187} Critical`}
      />
    </div>
  );
};
