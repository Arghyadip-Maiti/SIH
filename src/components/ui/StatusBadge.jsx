import { getStatusBadgeStyle, getStatusLabel } from '../../utils/statusUtils';

export const StatusBadge = ({ status, className = '' }) => {
  const style = getStatusBadgeStyle(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{label}</span>
    </span>
  );
};
