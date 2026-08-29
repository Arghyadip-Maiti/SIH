import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const ToastNotification = ({ message, onClose, durationMs = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [message, onClose, durationMs]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <span className="text-xs font-bold text-slate-100">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ToastNotification;
