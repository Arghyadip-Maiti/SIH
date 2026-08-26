export const RISK_LEVELS = {
  LOW: { key: 'LOW', label: 'Low Risk', minScore: 0, maxScore: 30, color: 'emerald' },
  MEDIUM: { key: 'MEDIUM', label: 'Medium Risk', minScore: 31, maxScore: 60, color: 'amber' },
  HIGH: { key: 'HIGH', label: 'High Risk', minScore: 61, maxScore: 80, color: 'orange' },
  CRITICAL: { key: 'CRITICAL', label: 'Critical Risk', minScore: 81, maxScore: 100, color: 'red' },
};

export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 100,
};
