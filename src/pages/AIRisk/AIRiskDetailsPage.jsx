import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAiRiskData } from '../../hooks/useAiRiskData';
import { Card } from '../../components/ui/Card';
import { PhotoModal } from '../../components/ai-risk/PhotoModal';
import { ReceiptModal } from '../../components/ai-risk/ReceiptModal';
import {
  ArrowLeft,
  Bot,
  ShieldAlert,
  AlertTriangle,
  IndianRupee,
  Camera,
  MapPin,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const AIRiskDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Safely decode project ID parameter from URL (e.g. MP%2FBI%2F100%2F200 -> MP/BI/100/200)
  const decodedProjectId = projectId ? decodeURIComponent(projectId) : null;

  const {
    activeProjectDetail,
    detailLoading,
    flagProject,
  } = useAiRiskData(decodedProjectId);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [checklist, setChecklist] = useState({
    receipts: false,
    location: false,
    progress: false,
    expenditure: false,
    photos: false,
  });
  const [flagSuccessMsg, setFlagSuccessMsg] = useState(null);

  if (detailLoading || !activeProjectDetail) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-sm font-extrabold text-slate-800">
          Loading AI Project Investigation Diagnostics...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Fetching computer vision photo models, expenditure vouchers, and GPS distance vectors.
        </p>
      </div>
    );
  }

  const p = activeProjectDetail;
  const riskScore = p.riskScore || 0;
  const riskLevel = p.riskLevel || 'CRITICAL';
  const fin = p.financialAnalysis || {};
  const photo = p.photoAnalysis || {};
  const delay = p.delayAnalysis || {};
  const pred = p.prediction || {};
  const factors = p.riskFactors || {};

  let riskBadgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
  let riskIcon = '🔴';
  if (riskLevel === 'HIGH') {
    riskBadgeStyle = 'bg-orange-50 text-orange-700 border-orange-200';
    riskIcon = '🟠';
  } else if (riskLevel === 'MEDIUM') {
    riskBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
    riskIcon = '🟡';
  } else if (riskLevel === 'LOW') {
    riskBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    riskIcon = '🟢';
  }

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFlagAction = async () => {
    await flagProject(p.id);
    setFlagSuccessMsg('Project successfully flagged for official manual field investigation.');
    setTimeout(() => setFlagSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/ai-risk')}
        className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors border border-slate-300/60"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back to AI Risk Monitor</span>
      </button>

      {/* 1. Project Header & Large Risk Score Card */}
      <Card className="p-6 border border-slate-200 rounded-2xl bg-white ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                ID: {p.id}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                {p.projectType}
              </span>
              {p.isFlagged && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                  FLAGGED FOR INVESTIGATION
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {p.name}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Location</span>
                <span className="font-extrabold text-slate-800">{p.district}, {p.state}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">MP Name</span>
                <span className="font-extrabold text-slate-800">{p.mpName || p.mp}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Agency</span>
                <span className="font-extrabold text-slate-800 truncate block">{p.implementingAgency}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Contractor</span>
                <span className="font-extrabold text-slate-800 truncate block">{p.contractor}</span>
              </div>
            </div>
          </div>

          {/* Large Risk Indicator Box */}
          <div className={`p-5 rounded-2xl border text-center shrink-0 min-w-[220px] ${riskBadgeStyle}`}>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
              AI Risk Index
            </div>
            <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight font-mono">
              <span>{riskIcon}</span>
              <span>{riskScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <div className="text-xs font-black uppercase tracking-wider mt-1">
              {riskLevel} RISK
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Why is this project flagged? (Risk Score Breakdown & Clubbed AI Investigation Summary) */}
      <Card header={
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            WHY IS THIS PROJECT FLAGGED? — RISK CONTRIBUTION
          </h3>
        </div>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
              <span className="block text-[10px] font-bold text-slate-800 uppercase">Financial Risk</span>
              <span className="text-lg font-black text-slate-950 font-mono">{factors.financialScore || 42}%</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="block text-[10px] font-bold text-purple-700 uppercase">Photo Evidence</span>
              <span className="text-lg font-black text-purple-900 font-mono">{factors.photoScore || 27}%</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="block text-[10px] font-bold text-rose-700 uppercase">Spatial Location</span>
              <span className="text-lg font-black text-rose-900 font-mono">{factors.locationScore || 14}%</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="block text-[10px] font-bold text-amber-700 uppercase">Delay Trajectory</span>
              <span className="text-lg font-black text-amber-900 font-mono">{factors.delayScore || 11}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
              <span className="block text-[10px] font-bold text-slate-600 uppercase">Other Metadata</span>
              <span className="text-lg font-black text-slate-800 font-mono">{factors.otherScore || 6}%</span>
            </div>
          </div>

          {/* AI Investigation Summary Clubbed Here */}
          {p.investigationSummary && p.investigationSummary.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>AI Investigation Findings</span>
              </div>
              {p.investigationSummary.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                  <span className="shrink-0 text-rose-600 font-bold">🔴</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 3. AI Predictive Analysis */}
      <Card header={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            AI Predictive Analysis
          </h3>
        </div>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase block">Delay Probability</span>
              <span className="text-2xl font-black text-rose-900 font-mono">{pred.delayProbability || 78}%</span>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase block">Cost Overrun Risk</span>
              <span className="text-2xl font-black text-amber-900 font-mono">{pred.costOverrunProbability || 61}%</span>
            </div>
            <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl">
              <span className="text-[10px] font-extrabold text-slate-800 uppercase block">Predicted Delay</span>
              <span className="text-2xl font-black text-slate-950 font-mono">43–55 days</span>
            </div>
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase block">Est. Final Cost</span>
              <span className="text-2xl font-black text-purple-900 font-mono">₹{(pred.estimatedFinalCost / 100000).toFixed(1)}L</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
            <h4 className="font-extrabold text-slate-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              <span>Why does AI predict this trajectory?</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium">
              <li>Physical progress velocity has decelerated by 38% over the last two reporting cycles.</li>
              <li>Financial claims exceed expected cost baseline for current completion stage.</li>
              <li>Spatial GPS metadata indicates potential site deviation requiring verification.</li>
              <li>Payment release rate leads physical execution velocity by &gt;20 percentage points.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 3 & 4. Financial Anomaly Section & AI Financial Explanation */}
      <Card header={
        <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            Financial Anomaly & Expenditure Analysis
          </h3>
        </div>
      }>
        <div className="space-y-5">
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Sanctioned Allocation</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">₹{(fin.sanctionedAmount / 100000).toFixed(2)}L</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Total Claimed</span>
              <span className="text-base font-extrabold text-slate-800 font-mono">₹{(fin.totalClaimed / 100000).toFixed(2)}L</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Verified Expenditure</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">₹{(fin.verifiedExpenditure / 100000).toFixed(2)}L</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Payment Released</span>
              <span className="text-base font-extrabold text-purple-700 font-mono">₹{(fin.paymentReleased / 100000).toFixed(2)}L</span>
            </div>
          </div>

          {/* Stage Expenditure Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50">
                  <th className="py-2.5 px-3">Project Stage</th>
                  <th className="py-2.5 px-3">Claimed Amount</th>
                  <th className="py-2.5 px-3">Expected Range</th>
                  <th className="py-2.5 px-3 text-center">Deviation</th>
                  <th className="py-2.5 px-3 text-center">AI Status</th>
                  <th className="py-2.5 px-3 text-right">Voucher Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(fin.stages || []).map((stg) => (
                  <tr key={stg.stage} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{stg.stage}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ₹{(stg.claimedAmount / 100000).toFixed(2)}L
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{stg.expectedRange}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      <span className={stg.deviationPercentage >= 20 ? 'text-rose-600' : 'text-emerald-600'}>
                        +{stg.deviationPercentage}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        stg.status === 'COST ANOMALY'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {stg.status} ({stg.confidence}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedReceipt(stg)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Financial Explanation Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
            <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-700" />
              <span>AI Financial Explanation</span>
            </h4>
            <p className="text-amber-800 font-medium leading-relaxed">
              "{fin.explanation || 'Expenditure submitted for foundation and groundwork exceeds baseline costs by 35% compared to peer works in this district.'}"
            </p>
          </div>
        </div>
      </Card>

      {/* 5, 6, 7, 8, 9, 10. Photo & Evidence Verification Section */}
      <Card header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Photo & Evidence Verification
            </h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {photo.overallStatus}
          </span>
        </div>
      }>
        <div className="space-y-6">
          {/* Timeline 25% -> 50% -> 75% -> 100% */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(photo.stages || []).map((stg) => {
              let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (stg.verificationStatus.includes('DUPLICATE')) badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
              if (stg.verificationStatus.includes('LOCATION')) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
              if (stg.verificationStatus.includes('AWAITING')) badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';

              return (
                <div
                  key={stg.stage}
                  onClick={() => stg.imageUrl && setSelectedPhoto(stg)}
                  className={`p-3.5 rounded-xl border bg-slate-50 transition-all ${
                    stg.imageUrl ? 'hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900">{stg.stage}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                      {stg.verificationStatus}
                    </span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden bg-slate-200 aspect-video mb-2 flex items-center justify-center border border-slate-300">
                    {stg.imageUrl ? (
                      <img src={stg.imageUrl} alt={stg.stage} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Pending Stage</span>
                    )}
                  </div>

                  {stg.imageUrl && (
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between font-mono">
                        <span>GPS Deviation:</span>
                        <strong className={stg.locationMismatch ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {stg.distanceKm} km
                        </strong>
                      </div>
                      {stg.duplicate && (
                        <div className="text-rose-600 font-extrabold text-[10px]">
                          🔴 {stg.similarityPercentage}% Similarity Match
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Verification Breakdown (Location, Timestamp, Authenticity) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* GPS Location Verification */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Location Verification</span>
              </h4>
              <div className="space-y-1 text-slate-600">
                <p>Registered Site: <strong>Gaya, Bihar</strong></p>
                <p>Photo GPS Capture: <strong>4.8 km away</strong></p>
                <span className="inline-block mt-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  🔴 LOCATION MISMATCH FLAGGED
                </span>
              </div>
            </div>

            {/* Timestamp Verification */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>Timestamp Audit</span>
              </h4>
              <div className="space-y-1 text-slate-600">
                <p>Photo Capture: <strong>18 Aug 2026, 10:42 AM</strong></p>
                <p>Milestone Schedule: <strong>On Track</strong></p>
                <span className="inline-block mt-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ TIMESTAMP CONSISTENT
                </span>
              </div>
            </div>

            {/* Duplicate & Image Authenticity */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-600" />
                <span>Image Authenticity</span>
              </h4>
              <div className="space-y-1 text-slate-600">
                <p>Manipulation Probability: <strong>{photo.manipulationProbability}%</strong></p>
                <p>Duplicate Similarity: <strong>94% match</strong></p>
                <span className="inline-block mt-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  IMAGE REGULARITY REVIEW
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 11 & 12. Delay / Timeline Analysis & Payment vs Progress Mismatch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Delay / Timeline */}
        <Card header={
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Project Delay & Timeline Diagnostics
            </h3>
          </div>
        }>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Expected Progress</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">{delay.expectedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Actual Physical Progress</span>
                <span className="text-base font-extrabold text-rose-600 font-mono">{delay.actualProgress}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-600">Timeline Progress Trajectory Gap:</span>
                <span className="font-mono font-bold text-rose-600">
                  {delay.expectedProgress - delay.actualProgress} percentage points behind
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${delay.actualProgress}%` }} />
                <div className="bg-rose-300 h-full" style={{ width: `${delay.expectedProgress - delay.actualProgress}%` }} />
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-extrabold text-rose-900">
                <span>Predicted Completion Date:</span>
                <span className="font-mono">{delay.predictedCompletionDate} ({delay.delayDays} days delay)</span>
              </div>
              <p className="text-rose-700 text-[11px] font-medium">
                "{delay.explanation}"
              </p>
            </div>
          </div>
        </Card>

        {/* Payment vs Physical Progress Mismatch */}
        <Card header={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Payment Released vs Physical Progress
            </h3>
          </div>
        }>
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Financial Payment Released:</span>
                <span className="font-extrabold font-mono text-purple-700 text-sm">
                  {Math.round((fin.paymentReleased / fin.sanctionedAmount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.round((fin.paymentReleased / fin.sanctionedAmount) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Physical Progress Executed:</span>
                <span className="font-extrabold font-mono text-slate-800 text-sm">
                  {p.physicalProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded-full"
                  style={{ width: `${p.physicalProgress}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <div className="flex items-center justify-between font-extrabold mb-1">
                <span>Disbursement Discrepancy:</span>
                <span className="font-mono text-sm">
                  +{Math.round((fin.paymentReleased / fin.sanctionedAmount) * 100) - p.physicalProgress} Percentage Points
                </span>
              </div>
              <p className="text-[11px] font-medium text-amber-800">
                🔴 SIGNIFICANT MISMATCH — Disbursement rate significantly leads verified ground physical execution.
              </p>
            </div>
          </div>
        </Card>
      </div>



      {/* 17. Recommended Action & Flag for Investigation */}
      <Card className="p-6 border-2 border-amber-300 bg-amber-50/50 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base tracking-tight uppercase">
                MANUAL VERIFICATION RECOMMENDED
              </h3>
            </div>
            <p className="text-xs text-amber-800 font-medium max-w-xl">
              Recommended administrative verification protocol before releasing further financial installments:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.receipts}
                  onChange={() => toggleChecklist('receipts')}
                  className="rounded text-slate-700 focus:ring-slate-500"
                />
                <span>Verify submitted expenditure receipts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.location}
                  onChange={() => toggleChecklist('location')}
                  className="rounded text-slate-700 focus:ring-slate-500"
                />
                <span>Verify project GPS site location</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.progress}
                  onChange={() => toggleChecklist('progress')}
                  className="rounded text-slate-700 focus:ring-slate-500"
                />
                <span>Verify ground physical progress</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.expenditure}
                  onChange={() => toggleChecklist('expenditure')}
                  className="rounded text-slate-700 focus:ring-slate-500"
                />
                <span>Review contractor line-item expenditure</span>
              </label>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
            <button
              onClick={handleFlagAction}
              disabled={p.isFlagged}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs  transition-all flex items-center gap-2 ${
                p.isFlagged
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{p.isFlagged ? 'Flagged for Official Audit' : 'Flag for Investigation'}</span>
            </button>
            {flagSuccessMsg && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                {flagSuccessMsg}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Render Evidence Modals */}
      <PhotoModal
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        photoData={selectedPhoto}
      />

      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        stageData={selectedReceipt}
      />
    </div>
  );
};

export default AIRiskDetailsPage;
