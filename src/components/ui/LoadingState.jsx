import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading MPLADS data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[240px]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};
