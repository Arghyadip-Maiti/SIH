export const mockRiskData = [
  {
    projectId: "MP-BR-205-412",
    riskScore: 93,
    riskLevel: "CRITICAL",
    riskFactors: {
      costAnomaly: 38,
      delay: 28,
      paymentProgressMismatch: 15,
      duplicateProbability: 10,
      other: 9,
    },
    predictions: {
      delayProbability: 0.78,
      predictedDelayDays: 61,
      costOverrunProbability: 0.81,
    },
    explanations: [
      "Project cost is significantly higher than similar regional projects.",
      "Payment released is much higher than physical progress verified on site.",
      "Project is likely to miss its current revised completion deadline by over 2 months."
    ]
  },
  {
    projectId: "MP-AS-334-112",
    riskScore: 96,
    riskLevel: "CRITICAL",
    riskFactors: {
      costAnomaly: 20,
      delay: 45,
      paymentProgressMismatch: 20,
      duplicateProbability: 5,
      other: 6,
    },
    predictions: {
      delayProbability: 0.94,
      predictedDelayDays: 549,
      costOverrunProbability: 0.75,
    },
    explanations: [
      "Severe timeline overrun with 0% progress reported in last 3 quarters.",
      "Geographical flood zone vulnerability causing recurring structural damage.",
      "Implementing agency has 3 other delayed works in Kamrup district."
    ]
  },
  {
    projectId: "MP-WB-601-883",
    riskScore: 91,
    riskLevel: "CRITICAL",
    riskFactors: {
      costAnomaly: 55,
      delay: 20,
      paymentProgressMismatch: 15,
      duplicateProbability: 5,
      other: 5,
    },
    predictions: {
      delayProbability: 0.82,
      predictedDelayDays: 270,
      costOverrunProbability: 0.89,
    },
    explanations: [
      "Cost per kilometer exceeds state standard benchmark by 64%.",
      "Financial expenditure is 90.7% while physical progress is only 38%.",
      "High anomaly score flagged by AI Computer Vision photo inspection model."
    ]
  },
  {
    projectId: "MP-AP-778-904",
    riskScore: 88,
    riskLevel: "CRITICAL",
    riskFactors: {
      costAnomaly: 15,
      delay: 35,
      paymentProgressMismatch: 20,
      duplicateProbability: 25,
      other: 5,
    },
    predictions: {
      delayProbability: 0.85,
      predictedDelayDays: 450,
      costOverrunProbability: 0.60,
    },
    explanations: [
      "Spatial GIS matching detected 92% similarity with nearby State Road Infra work.",
      "Physical progress stalled at 55% despite 96.3% fund disbursement.",
      "Agency delayed submission of utilization certificates."
    ]
  },
  {
    projectId: "MP-RJ-503-221",
    riskScore: 85,
    riskLevel: "CRITICAL",
    riskFactors: {
      costAnomaly: 25,
      delay: 40,
      paymentProgressMismatch: 20,
      duplicateProbability: 5,
      other: 10,
    },
    predictions: {
      delayProbability: 0.88,
      predictedDelayDays: 228,
      costOverrunProbability: 0.68,
    },
    explanations: [
      "120 consecutive days without physical progress updates.",
      "Completion date pushed twice without prior competent authority approval.",
      "Fund utilization mismatch flagged."
    ]
  }
];
