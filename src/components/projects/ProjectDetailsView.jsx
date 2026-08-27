import {
  X,
  MapPin,
  AlertTriangle,
  FileText,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getStatusBadgeClass, getRiskColorClass } from '../../utils/projectAnalytics';

export const ProjectDetailsView = ({ project, onClose }) => {
  if (!project) return null;

  const p = project;
  const statusBadge = getStatusBadgeClass(p.status);
  const riskBadge = getRiskColorClass(p.riskScore);

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800">
                {p.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${riskBadge.bg}`}>
                Risk: {p.riskScore}/100 ({p.riskLevel})
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white pt-1">
              {p.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {p.district}, {p.state} &bull; Constituency: {p.constituencyName} &bull; MP: {p.mpName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* 1. BASIC INFORMATION */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <FileText className="w-4 h-4" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Project Name</span>
                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Project ID</span>
                <p className="font-mono font-bold text-blue-700">{p.id}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">State &amp; District</span>
                <p className="font-bold text-slate-900">{p.district}, {p.state}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Constituency</span>
                <p className="font-bold text-slate-900">{p.constituencyName} ({p.constituencyId})</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Member of Parliament</span>
                <p className="font-bold text-slate-900">{p.mpName} ({p.house})</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Project Sector Type</span>
                <p className="font-bold text-slate-900">{p.projectType}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Implementing Agency</span>
                <p className="font-bold text-slate-900">{p.implementingAgency}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Contractor</span>
                <p className="font-bold text-slate-900">{p.contractor}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Financial Year</span>
                <p className="font-mono font-bold text-slate-900">{p.financialYear}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Description</span>
              <p className="text-slate-700 font-medium leading-relaxed">{p.description}</p>
            </div>
          </div>

          {/* 2. FINANCIAL INFORMATION */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Financial Information</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <span className="text-blue-600 text-[10px] uppercase font-extrabold block">Estimated Cost</span>
                <span className="text-base font-mono font-black text-blue-950">{formatCurrency(p.estimatedCost)}</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <span className="text-emerald-600 text-[10px] uppercase font-extrabold block">Sanctioned Amount</span>
                <span className="text-base font-mono font-black text-emerald-950">{formatCurrency(p.sanctionedAmount)}</span>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <span className="text-indigo-600 text-[10px] uppercase font-extrabold block">Expenditure Spent</span>
                <span className="text-base font-mono font-black text-indigo-950">{formatCurrency(p.expenditure)}</span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-amber-600 text-[10px] uppercase font-extrabold block">Unutilized Funds</span>
                <span className="text-base font-mono font-black text-amber-950">{formatCurrency(p.unutilizedAmount)}</span>
              </div>
            </div>
          </div>

          {/* 3. PHYSICAL VS FINANCIAL PROGRESS COMPARISON */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span>Physical vs Financial Progress Comparison</span>
              <span className="font-mono text-blue-600">{p.progress}% Physical / {p.financialProgress}% Financial</span>
            </h3>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Physical Progress</span>
                  <span className="font-mono text-slate-900 font-bold">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${Math.min(100, p.progress)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Financial Progress (Disbursement)</span>
                  <span className="font-mono text-emerald-700 font-bold">{p.financialProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(100, p.financialProgress)}%` }}
                  />
                </div>
              </div>
            </div>

            {p.paymentProgressMismatch && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Progress Mismatch Warning:</strong> Financial disbursement ({p.financialProgress}%) significantly exceeds physical milestone progress ({p.progress}%).
                </span>
              </div>
            )}
          </div>

          {/* 4. TIME INFORMATION & TIMELINE */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Time Information &amp; Schedule</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Start / Sanction Date</span>
                <span className="font-mono font-bold text-slate-900">{p.startDate}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected Completion</span>
                <span className="font-mono font-bold text-slate-900">{p.expectedCompletionDate}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Target Completion</span>
                <span className="font-mono font-bold text-slate-900">{p.actualExpectedCompletion}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Delay Status</span>
                <span className={`font-mono font-bold ${p.daysDelayed > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {p.daysDelayed > 0 ? `⚠️ +${p.daysDelayed} Days Delayed` : 'On Schedule'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. RISK INFORMATION & DETECTED ANOMALIES */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>AI Risk Assessment &amp; Anomaly Detection</span>
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${riskBadge.bg}`}>
                Risk Score: {p.riskScore} / 100 ({p.riskLevel})
              </span>

              {p.paymentProgressMismatch && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
                  ⚠️ Payment-Progress Mismatch
                </span>
              )}

              {p.costOverrun && (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
                  ⚠️ Cost Overrun Detected
                </span>
              )}

              {p.duplicateRisk && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold">
                  ⚠️ Possible Duplicate Work
                </span>
              )}

              {p.daysDelayed > 30 && (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
                  ⚠️ Severe Execution Slippage
                </span>
              )}
            </div>
          </div>

          {/* 6. GEOTAGGED PROJECT PHOTOS */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Geotagged Evidence Photographs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {p.photos?.map((url, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video group">
                  <img src={url} alt={`Site evidence ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                    Geotagged #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. GEOGRAPHIC LOCATION */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">Geographic Coordinates:</span>
              <span className="font-mono text-slate-600">{p.latitude?.toFixed(4)}° N, {p.longitude?.toFixed(4)}° E</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">{p.district}, {p.state}</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <Button onClick={onClose} variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl">
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
};
