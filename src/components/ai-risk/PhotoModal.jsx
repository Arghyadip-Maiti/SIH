import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Camera, ShieldAlert } from 'lucide-react';

export const PhotoModal = ({ isOpen, onClose, photoData = {} }) => {
  if (!isOpen || !photoData) return null;

  const {
    stage = '25% Progress',
    imageUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    verificationStatus = 'VERIFIED',
    timestamp = '2026-02-10 10:42 AM',
    photoLat = 24.7958,
    photoLng = 85.0005,
    distanceKm = 0.04,
    similarityPercentage = 12,
    matchedStage = null,
  } = photoData;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-modalBackdrop"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border-0 animate-modalPop">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              Site Evidence Photograph — {stage}
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
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={stage}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-slate-400 text-xs font-semibold">
                No Photograph Submitted Yet for {stage}
              </div>
            )}

            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-slate-700">
              Status: {verificationStatus}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                Timestamp Verification
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-700" />
                <span>{timestamp || 'Not recorded'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                GPS Location & Distance
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 font-mono">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>{photoLat}, {photoLng} ({distanceKm} km away)</span>
              </div>
            </div>

            {similarityPercentage > 20 && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Image Similarity Score: {similarityPercentage}%</span>
                </div>
                {matchedStage && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    High visual feature overlap matched with {matchedStage}. Potential duplicate submission flagged for review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
