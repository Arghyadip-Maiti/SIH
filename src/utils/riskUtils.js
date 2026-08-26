import { RISK_LEVELS } from '../constants/riskLevels';

/**
 * Returns risk level string (LOW, MEDIUM, HIGH, CRITICAL) for a score 0-100
 */
export const getRiskLevel = (score) => {
  const numScore = Number(score);
  if (numScore >= 81) return 'CRITICAL';
  if (numScore >= 61) return 'HIGH';
  if (numScore >= 31) return 'MEDIUM';
  return 'LOW';
};

export const getRiskLabel = (score) => {
  const level = typeof score === 'number' ? getRiskLevel(score) : score;
  return RISK_LEVELS[level]?.label || 'Low Risk';
};

export const getRiskColorClass = (score) => {
  const level = typeof score === 'number' ? getRiskLevel(score) : score;
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800/50',
        badgeBg: 'bg-red-100 dark:bg-red-900/40',
        dot: 'bg-red-600',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800/50',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/40',
        dot: 'bg-orange-600',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/50',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
        dot: 'bg-amber-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/50',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
        dot: 'bg-emerald-600',
      };
  }
};
