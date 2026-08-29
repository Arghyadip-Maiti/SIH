export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    blue: 'bg-slate-800',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-600',
    indigo: 'bg-slate-800',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-600 font-medium">
          <span>Progress</span>
          <span className="font-mono">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colors[color] || 'bg-slate-800'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
