import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendPercentage,
  subtitle,
  iconBgColor = 'bg-slate-100 text-slate-700',
  className = '',
}) => {
  const isPositiveTrend = trend === 'up' || (typeof trendPercentage === 'number' && trendPercentage >= 0);

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="text-2xl font-bold text-slate-900 mt-1.5 font-sans tracking-tight">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBgColor} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trendPercentage !== undefined || subtitle) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
          {trendPercentage !== undefined && (
            <span
              className={`inline-flex items-center font-semibold ${
                isPositiveTrend ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              )}
              {isPositiveTrend ? '↑' : '↓'} {Math.abs(trendPercentage)}%
            </span>
          )}
          {subtitle && <span className="text-slate-400 font-normal ml-auto">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
