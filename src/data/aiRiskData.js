import { mockProjects } from './mockProjects';
import { MASTER_MP_RECORDS } from '../utils/projectAnalytics';

/**
 * Normalizer & AI Risk Enrichment Module.
 * Transforms raw mockProjects into backend-style AI Risk objects
 * matching real API payloads.
 */

export const getRiskLevelFromScore = (score) => {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
};

export const getPrimaryAnomaly = (p) => {
  const score = p.riskScore || 0;
  if (p.paymentProgressMismatch || (p.financialProgress - p.physicalProgress > 20)) {
    return 'Financial';
  }
  if (p.duplicateRisk) {
    return 'Duplicate Photo';
  }
  if (p.daysDelayed > 60) {
    return 'Timeline / Delay';
  }
  if (score >= 70 && p.suspicious) {
    return 'Photo';
  }
  if (p.costOverrun) {
    return 'Financial';
  }
  if (score >= 50) {
    return 'Location';
  }
  return 'None';
};

export const getAnomalyTypes = (p) => {
  const anomalies = [];
  const score = p.riskScore || 0;
  const finMismatch = p.paymentProgressMismatch || (p.financialProgress - p.physicalProgress > 20) || p.costOverrun;
  
  if (finMismatch) anomalies.push('Financial');
  if (p.duplicateRisk) anomalies.push('Duplicate Photo');
  if (p.suspicious || score >= 65) anomalies.push('Photo');
  if (p.daysDelayed > 30) anomalies.push('Timeline / Delay');
  if (score >= 75) anomalies.push('Location');
  if (p.paymentProgressMismatch) anomalies.push('Payment-Progress Mismatch');
  
  if (anomalies.length > 2) {
    anomalies.unshift('Multiple Anomalies');
  }
  if (anomalies.length === 0) {
    anomalies.push('None');
  }

  return Array.from(new Set(anomalies));
};

export const enrichProjectWithAIRisk = (p) => {
  if (!p) return null;

  const id = p.id || p.projectId || 'MP/UNKNOWN';
  const name = p.name || p.projectName || 'MPLADS Infrastructure Work';
  const sanctioned = Number(p.sanctionedAmount || 0);
  const expenditure = Number(p.expenditure || 0);
  const physicalProg = Number(p.progress || p.physicalProgress || 0);
  const financialProg = Number(p.financialProgress || (sanctioned > 0 ? (expenditure / sanctioned) * 100 : 0));
  
  const riskScore = Number(p.riskScore || 0);
  const riskLevel = p.riskLevel || getRiskLevelFromScore(riskScore);
  const primaryAnomaly = getPrimaryAnomaly(p);
  const anomalyTypes = getAnomalyTypes(p);

  const paymentReleased = Math.round(sanctioned * (financialProg / 100));
  const expectedProgress = Math.min(100, Math.max(physicalProg, physicalProg + (p.daysDelayed > 0 ? Math.round(p.daysDelayed * 0.3) : 10)));
  const daysDelayed = Number(p.daysDelayed || 0);

  // Financial Analysis Sub-schema
  const claimedAmount = expenditure;
  const verifiedExpenditure = Math.round(expenditure * (riskScore >= 70 ? 0.72 : 0.95));
  const devPct = riskScore >= 70 ? 35 : riskScore >= 50 ? 18 : 4;
  
  const financialAnalysis = {
    sanctionedAmount: sanctioned,
    totalClaimed: claimedAmount,
    verifiedExpenditure: verifiedExpenditure,
    paymentReleased: paymentReleased,
    deviationPercentage: devPct,
    anomaly: devPct >= 25 ? 'COST ANOMALY' : devPct >= 15 ? 'MODERATE DEVIATION' : 'VERIFIED',
    confidence: riskScore >= 70 ? 87 : 94,
    explanation: devPct >= 25
      ? `The submitted expenditure is approximately ${devPct}% above the expected baseline for comparable projects in ${p.district || 'this region'}.`
      : 'Expenditure aligns within normal benchmark parameters for this stage of execution.',
    stages: [
      {
        stage: 'Foundation & Groundwork',
        claimedAmount: Math.round(sanctioned * 0.25),
        expectedRange: `₹${(sanctioned * 0.18 / 100000).toFixed(1)}L – ₹${(sanctioned * 0.22 / 100000).toFixed(1)}L`,
        deviationPercentage: devPct >= 25 ? devPct : 4,
        status: devPct >= 25 ? 'COST ANOMALY' : 'VERIFIED',
        confidence: 87,
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        submissionDate: '2026-03-12',
      },
      {
        stage: 'Superstructure Works',
        claimedAmount: Math.round(sanctioned * 0.35),
        expectedRange: `₹${(sanctioned * 0.30 / 100000).toFixed(1)}L – ₹${(sanctioned * 0.35 / 100000).toFixed(1)}L`,
        deviationPercentage: 5,
        status: 'VERIFIED',
        confidence: 93,
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        submissionDate: '2026-05-20',
      },
      {
        stage: 'Finishing & Utilities',
        claimedAmount: Math.round(sanctioned * 0.20),
        expectedRange: `₹${(sanctioned * 0.18 / 100000).toFixed(1)}L – ₹${(sanctioned * 0.22 / 100000).toFixed(1)}L`,
        deviationPercentage: 2,
        status: 'VERIFIED',
        confidence: 91,
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        submissionDate: '2026-07-15',
      },
    ],
  };

  // Photo Analysis Sub-schema
  const lat = Number(p.latitude || 20.5937);
  const lng = Number(p.longitude || 78.9629);
  const isDup = Boolean(p.duplicateRisk || riskScore >= 75);
  const isLocMismatch = Boolean(riskScore >= 70);

  const photoAnalysis = {
    overallStatus: isDup && isLocMismatch
      ? 'Duplicate Photo & Location Mismatch Suspected'
      : isDup
      ? 'Duplicate Photo Suspected'
      : isLocMismatch
      ? 'Location Mismatch Flagged'
      : 'Photo Verification Clear',
    manipulationProbability: riskScore >= 80 ? 18 : riskScore >= 60 ? 9 : 2,
    metadataConsistency: 'Consistent',
    structureDetected: true,
    stages: [
      {
        stage: '25% Progress',
        verificationStatus: 'VERIFIED',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        timestamp: '2026-02-10 10:42 AM',
        timestampAnomaly: false,
        expectedLat: lat,
        expectedLng: lng,
        photoLat: lat + 0.0002,
        photoLng: lng + 0.0003,
        distanceKm: 0.04,
        locationMismatch: false,
        duplicate: false,
        similarityPercentage: 12,
        confidence: 96,
      },
      {
        stage: '50% Progress',
        verificationStatus: isDup ? 'DUPLICATE SUSPECTED' : 'VERIFIED',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        timestamp: '2026-04-18 11:15 AM',
        timestampAnomaly: false,
        expectedLat: lat,
        expectedLng: lng,
        photoLat: lat,
        photoLng: lng,
        distanceKm: 0.0,
        locationMismatch: false,
        duplicate: isDup,
        matchedStage: '25% completion photo',
        similarityPercentage: isDup ? 94 : 22,
        confidence: 94,
      },
      {
        stage: '75% Progress',
        verificationStatus: isLocMismatch ? 'LOCATION MISMATCH' : physicalProg >= 75 ? 'VERIFIED' : 'AWAITING SUBMISSION',
        imageUrl: physicalProg >= 75 ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80' : null,
        timestamp: physicalProg >= 75 ? '2026-06-22 03:30 PM' : null,
        timestampAnomaly: false,
        expectedLat: lat,
        expectedLng: lng,
        photoLat: lat + 0.042,
        photoLng: lng + 0.035,
        distanceKm: isLocMismatch ? 4.8 : 0.08,
        locationMismatch: isLocMismatch,
        duplicate: false,
        similarityPercentage: 18,
        confidence: 89,
      },
      {
        stage: '100% Progress',
        verificationStatus: physicalProg === 100 ? 'VERIFIED' : 'AWAITING SUBMISSION',
        imageUrl: physicalProg === 100 ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' : null,
        timestamp: physicalProg === 100 ? '2026-08-15 02:10 PM' : null,
        timestampAnomaly: false,
        expectedLat: lat,
        expectedLng: lng,
        photoLat: lat,
        photoLng: lng,
        distanceKm: 0.05,
        locationMismatch: false,
        duplicate: false,
        similarityPercentage: 10,
        confidence: 95,
      },
    ],
  };

  // Delay & Predictive Sub-schemas
  const delayProbability = daysDelayed > 60 ? 88 : daysDelayed > 0 ? 65 : 18;
  const costOverrunProbability = p.costOverrun ? 78 : riskScore >= 70 ? 61 : 12;

  const delayAnalysis = {
    expectedProgress,
    actualProgress: physicalProg,
    delayDays: daysDelayed,
    delayProbability,
    expectedCompletionDate: p.expectedCompletionDate || '2026-09-30',
    predictedCompletionDate: daysDelayed > 0 ? '2026-11-18' : p.expectedCompletionDate || '2026-09-30',
    explanation: daysDelayed > 0
      ? `Physical progress is ${expectedProgress - physicalProg} percentage points below expected target trajectory.`
      : 'Project physical progress aligns with schedule plan.',
  };

  const prediction = {
    delayProbability,
    predictedDelayDays: daysDelayed > 0 ? daysDelayed + 25 : 0,
    costOverrunProbability,
    estimatedFinalCost: p.costOverrun ? Math.round(sanctioned * 1.15) : sanctioned,
    currentSanctioned: sanctioned,
    predictionExplanation: 'Progress rate has decelerated over recent cycles while financial claims exceed physical milestones.',
  };

  // Risk Factor Breakdown (adds up to ~100%)
  const riskFactors = {
    financialScore: riskScore >= 70 ? 42 : 25,
    photoScore: isDup ? 27 : 15,
    locationScore: isLocMismatch ? 14 : 5,
    delayScore: daysDelayed > 0 ? 22 : 10,
    otherScore: 5,
    paymentProgressMismatch: Boolean(financialProg - physicalProg > 15),
  };

  // AI Investigation Summary bullets
  const investigationSummary = [];
  if (devPct >= 20) {
    investigationSummary.push(`Foundation expenditure is approximately ${devPct}% above regional baseline range.`);
  }
  if (isDup) {
    investigationSummary.push(`50% completion photograph exhibits 94% similarity with a previous stage submission.`);
  }
  if (isLocMismatch) {
    investigationSummary.push(`Photo GPS metadata indicates a 4.8 km deviation from the registered project site.`);
  }
  if (daysDelayed > 0) {
    investigationSummary.push(`Current execution pace indicates a ${delayProbability}% probability of completion delay.`);
  }
  if (financialProg - physicalProg > 15) {
    investigationSummary.push(`Financial disbursement (${financialProg}%) exceeds physical progress (${physicalProg}%) by ${financialProg - physicalProg} percentage points.`);
  }
  if (investigationSummary.length === 0) {
    investigationSummary.push('All physical, financial, and spatial milestones remain within normal compliance thresholds.');
  }

  return {
    ...p,
    id,
    projectId: id,
    name,
    projectName: name,
    state: p.state || 'Bihar',
    district: p.district || 'Gaya',
    constituency: p.constituencyName || p.district || 'Gaya',
    mp: p.mpName || p.mp || 'Shri Rajesh Kumar',
    mpId: p.mpId || 'MP-BR-01',
    mpName: p.mpName || p.mp || 'Shri Rajesh Kumar',
    house: p.house || 'Lok Sabha',
    projectType: p.projectType || 'Community Infrastructure',
    implementingAgency: p.implementingAgency || 'Public Works Department (PWD)',
    contractor: p.contractor || 'ABC Infrastructure Pvt Ltd',
    sanctionedAmount: sanctioned,
    amountSpent: expenditure,
    expenditure: expenditure,
    paymentReleased: paymentReleased,
    physicalProgress: physicalProg,
    expectedProgress: expectedProgress,
    startDate: p.startDate || '2024-01-20',
    expectedCompletionDate: p.expectedCompletionDate || '2026-09-30',
    predictedCompletionDate: delayAnalysis.predictedCompletionDate,
    riskScore: riskScore,
    riskLevel: riskLevel,
    primaryAnomaly: primaryAnomaly,
    anomalyTypes: anomalyTypes,
    financialAnalysis: financialAnalysis,
    photoAnalysis: photoAnalysis,
    delayAnalysis: delayAnalysis,
    prediction: prediction,
    riskFactors: riskFactors,
    investigationSummary: investigationSummary,
  };
};

/**
 * Canonical enriched active projects list (Single Source of Truth)
 */
export const getEnrichedRiskProjects = () => {
  const baseEnriched = mockProjects
    .map(enrichProjectWithAIRisk)
    .filter((p) => p && (p.riskScore >= 31 || p.suspicious || p.daysDelayed > 0 || p.costOverrun || p.paymentProgressMismatch || p.duplicateRisk));

  // Map existing mpIds/mpNames
  const existingMpKeys = new Set();
  baseEnriched.forEach((p) => {
    if (p.mpId) existingMpKeys.add(p.mpId);
    if (p.mpName) existingMpKeys.add(p.mpName);
  });

  // Ensure every MP in MASTER_MP_RECORDS (73 MPs) has active project representation
  const additionalProjects = [];
  MASTER_MP_RECORDS.forEach((rec, idx) => {
    if (!existingMpKeys.has(rec.mpId) && !existingMpKeys.has(rec.mpName)) {
      const stateAbbr = (rec.state || 'IN').substring(0, 2).toUpperCase();
      const pId = `MP/${stateAbbr}/${100 + idx}/${200 + idx}`;
      const mockRaw = {
        id: pId,
        projectId: pId,
        name: `${idx % 2 === 0 ? 'Community Infrastructure' : 'Drinking Water Pipeline'} - ${rec.constituency}`,
        state: rec.state,
        district: rec.constituency,
        constituencyName: rec.constituency,
        mpName: rec.mpName,
        mpId: rec.mpId,
        house: rec.house,
        projectType: idx % 2 === 0 ? 'Community Infrastructure' : 'Drinking Water Supply',
        implementingAgency: idx % 3 === 0 ? 'Public Works Department (PWD)' : 'Jal Nigam State Division',
        sanctionedAmount: 2500000 + (idx * 350000),
        expenditure: 1200000 + (idx * 150000),
        physicalProgress: 25 + (idx % 40),
        financialProgress: 45 + (idx % 35),
        riskScore: 35 + ((idx * 7) % 55),
        daysDelayed: (idx % 3 === 0) ? 45 : 0,
        costOverrun: idx % 4 === 0,
        paymentProgressMismatch: idx % 2 === 0,
        suspicious: idx % 5 === 0,
      };
      additionalProjects.push(enrichProjectWithAIRisk(mockRaw));
    }
  });

  return [...baseEnriched, ...additionalProjects];
};
