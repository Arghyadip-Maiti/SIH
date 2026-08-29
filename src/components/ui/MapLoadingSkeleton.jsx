import React from 'react';
import { Map } from 'lucide-react';

export const MapLoadingSkeleton = ({ message = "Loading map data..." }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center animate-pulse overflow-hidden relative">
      {/* Abstract Map shapes in the background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-slate-300">
          <path fill="currentColor" d="M10,20 Q30,10 40,30 T60,50 T80,40 L90,80 L20,90 Z" className="animate-pulse" />
          <path fill="currentColor" d="M30,50 Q45,30 65,50 T90,70 L70,95 L40,85 Z" className="animate-pulse" style={{ animationDelay: '0.5s'}} />
        </svg>
      </div>
      
      {/* Loader UI */}
      <div className="z-10 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
          <Map className="w-6 h-6 animate-pulse" />
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/50">
          {message}
        </div>
      </div>
    </div>
  );
};
