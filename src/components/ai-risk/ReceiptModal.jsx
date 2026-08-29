import { createPortal } from 'react-dom';
import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, stageData = {} }) => {
  if (!isOpen || !stageData) return null;

  const {
    stage = 'Foundation Works',
    claimedAmount = 420000,
    expectedRange = '₹2.8L – ₹3.4L',
    deviationPercentage = 35,
    status = 'COST ANOMALY',
    confidence = 87,
    receiptUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    submissionDate = '2026-03-12',
  } = stageData;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-modalBackdrop"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border-0 animate-modalPop">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              Voucher & Receipt Document — {stage}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-3/2 flex items-center justify-center border border-slate-200">
            <img
              src={receiptUrl}
              alt="Receipt Voucher Document"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-slate-700">
              Submission Date: {submissionDate}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                Claimed Disbursement Amount
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                ₹{(claimedAmount / 100000).toFixed(2)} Lakhs
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                Regional Benchmark Range
              </span>
              <span className="text-base font-extrabold text-slate-700 font-mono">
                {expectedRange}
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  AI Cost Deviation Evaluation
                </span>
                <span className={`text-xs font-extrabold ${deviationPercentage >= 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {deviationPercentage >= 0 ? `+${deviationPercentage}% Deviation` : `${deviationPercentage}% Deviation`} ({status})
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                  Confidence Score
                </span>
                <span className="text-xs font-bold font-mono text-slate-800">
                  {confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Receipt Document
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
