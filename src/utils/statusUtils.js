import { PROJECT_STATUS } from '../constants/projectStatus';

export const getProjectStatus = (progress, isDelayed = false) => {
  if (isDelayed) return 'DELAYED';
  const prog = Number(progress);
  if (prog >= 100) return 'COMPLETED';
  if (prog >= 80) return 'NEAR_COMPLETION';
  if (prog >= 30) return 'ONGOING';
  return 'STARTING';
};

export const getStatusBadgeStyle = (statusKey) => {
  switch (statusKey) {
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-600',
      };
    case 'NEAR_COMPLETION':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-600',
      };
    case 'ONGOING':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-600',
      };
    case 'STARTING':
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-600',
      };
    case 'DELAYED':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-600',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
      };
  }
};

export const getStatusLabel = (statusKey) => {
  return PROJECT_STATUS[statusKey]?.label || statusKey;
};
