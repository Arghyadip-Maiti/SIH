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
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-800',
      };
    case 'ONGOING':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-800',
      };
    case 'STARTING':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-800',
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
