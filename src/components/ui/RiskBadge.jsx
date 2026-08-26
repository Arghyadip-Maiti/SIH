import { getRiskColorClass, getRiskLevel, getRiskLabel } from '../../utils/riskUtils';

export const RiskBadge = ({ score, showScore = true, className = '' }) => {
  const level = typeof score === 'number' ? getRiskLevel(score) : score;
  const colors = getRiskColorClass(score);
  const label = getRiskLabel(score);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${colors.badgeBg} ${colors.text} ${colors.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      <span>{label}</span>
      {showScore && typeof score === 'number' && (
        <span className="font-mono ml-0.5 font-bold">({score})</span>
      )}
    </span>
  );
};
