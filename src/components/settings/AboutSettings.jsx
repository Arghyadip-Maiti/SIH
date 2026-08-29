import { useState } from 'react';
import { Info, ExternalLink, ShieldCheck, FileText, HelpCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const AboutSettings = () => {
  const [modalType, setModalType] = useState(null);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">About MPLADS Monitoring Platform</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              System metadata, platform version, official purpose, and policy resources
            </p>
          </div>
        </div>

        <span className="text-xs font-extrabold bg-slate-100 text-slate-800 px-3 py-1 rounded-xl border border-slate-200">
          v1.0.0
        </span>
      </div>

      <div className="space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Name</span>
            <span className="text-xs font-black text-slate-900 mt-1 block">
              MPLADS AI-Powered Monitoring & Analytics Platform
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Governing Authority</span>
            <span className="text-xs font-black text-slate-900 mt-1 block">
              Ministry of Statistics & Programme Implementation (MoSPI)
            </span>
          </div>
        </div>

        {/* Purpose Overview Box */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Official System Purpose</span>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Centralized monitoring and analysis of MPLADS projects, financial activity and project risks. Designed to empower government administrators with predictive decision intelligence, automated risk detection, and transparent scheme implementation tracking.
          </p>
        </div>

        {/* Policy & Support Resources Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs font-extrabold">
          <button
            onClick={() => setModalType('privacy')}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setModalType('terms')}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setModalType('help')}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        title={
          modalType === 'privacy'
            ? 'Official Privacy Policy'
            : modalType === 'terms'
            ? 'Terms of Administrative Use'
            : 'Help & Technical Support'
        }
      >
        <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
          {modalType === 'privacy' && (
            <p>
              All data processed on the MPLADS AI Monitoring Platform is governed by official Government of India cybersecurity protocols and data protection guidelines. Access is strictly audited and restricted to authorized administrative personnel.
            </p>
          )}

          {modalType === 'terms' && (
            <p>
              This administrative dashboard is intended exclusively for authorized officers of the Ministry of Statistics & Programme Implementation and nodal district authorities. Unauthorized distribution or credentials sharing is strictly prohibited under national IT guidelines.
            </p>
          )}

          {modalType === 'help' && (
            <div className="space-y-2">
              <p>
                For technical assistance, system bugs, or user access provisioning inquiries, please contact the MoSPI IT Support Desk:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                Email: support-mplads@gov.in<br />
                Toll-Free Helpline: 1800-11-XXXX
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setModalType(null)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AboutSettings;
