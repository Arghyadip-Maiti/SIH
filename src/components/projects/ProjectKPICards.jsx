import {
  FolderKanban,
  Coins,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../ui/Card';

export const ProjectKPICards = ({ kpis = {} }) => {
  const formatCr = (amount) => {
    if (!amount) return '₹0 Cr';
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  };

  const cards = [
    {
      title: 'TOTAL PROJECTS',
      value: kpis.totalProjects?.toLocaleString('en-IN') || '0',
      subtitle: 'Sanctioned works',
      icon: FolderKanban,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
    },
    {
      title: 'SANCTIONED AMOUNT',
      value: formatCr(kpis.totalSanctionedAmount),
      subtitle: 'Total allocation',
      icon: Coins,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'EXPENDITURE',
      value: formatCr(kpis.totalExpenditure),
      subtitle: `${kpis.utilizationPercentage || 0}% Utilized`,
      icon: TrendingUp,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
    },
    {
      title: 'COMPLETED PROJECTS',
      value: kpis.completedCount?.toLocaleString('en-IN') || '0',
      subtitle: `${kpis.totalProjects ? ((kpis.completedCount / kpis.totalProjects) * 100).toFixed(1) : 0}% of total`,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'ONGOING PROJECTS',
      value: kpis.ongoingCount?.toLocaleString('en-IN') || '0',
      subtitle: 'In execution stage',
      icon: Clock,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
    },
    {
      title: 'NEAR COMPLETION',
      value: kpis.nearCompletionCount?.toLocaleString('en-IN') || '0',
      subtitle: '80% - 99% progress',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'DELAYED PROJECTS',
      value: kpis.delayedCount?.toLocaleString('en-IN') || '0',
      subtitle: `Avg delay: ${kpis.avgDelayDays || 0} days`,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      title: 'AVERAGE PROJECT RISK',
      value: `${kpis.avgRiskScore || 0} / 100`,
      subtitle: `${kpis.criticalRiskCount || 0} Critical risk items`,
      icon: ShieldAlert,
      color: kpis.avgRiskScore >= 60 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-slate-700 bg-slate-50 border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 hover: transition-">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  {card.title}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
                  {card.value}
                </span>
                <span className="text-xs font-medium text-slate-500 block mt-1">
                  {card.subtitle}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
