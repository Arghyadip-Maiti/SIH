import React from 'react';

// Single KPI Card Skeleton with Matched Icon Box
export const KPICardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5  relative overflow-hidden animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2.5 flex-1 pr-3">
          {/* Title line skeleton */}
          <div className="h-3.5 w-28 bg-slate-200 rounded-md skeleton-shimmer" />
          {/* Value block skeleton */}
          <div className="h-7 w-36 bg-slate-200 rounded-lg skeleton-shimmer mt-2" />
        </div>
        {/* Matched Icon Box Skeleton */}
        <div className="w-10 h-10 rounded-xl bg-slate-200/90 shrink-0 flex items-center justify-center skeleton-shimmer">
          <div className="w-5 h-5 rounded-md bg-slate-300/80" />
        </div>
      </div>

      {/* Subtitle / Trend footer skeleton */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-200 rounded-md skeleton-shimmer" />
        <div className="h-3 w-16 bg-slate-200 rounded-md skeleton-shimmer ml-auto" />
      </div>
    </div>
  );
};

// Filter Bar Skeleton
export const FilterBarSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5  animate-pulse flex flex-wrap items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-200 skeleton-shimmer shrink-0" />
      <div className="h-9 w-40 bg-slate-200 rounded-xl skeleton-shimmer" />
      <div className="h-9 w-36 bg-slate-200 rounded-xl skeleton-shimmer" />
      <div className="h-9 w-36 bg-slate-200 rounded-xl skeleton-shimmer" />
      <div className="h-9 w-28 bg-slate-200 rounded-xl skeleton-shimmer ml-auto" />
    </div>
  );
};

// Chart Cards Section Skeleton
export const ChartSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5  animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-44 bg-slate-200 rounded-md skeleton-shimmer" />
              <div className="h-3 w-64 bg-slate-200 rounded-md skeleton-shimmer" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg skeleton-shimmer" />
          </div>

          {/* Chart Area Graphic Placeholder */}
          <div className="h-64 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 p-4 flex items-end justify-between gap-3">
            {[40, 65, 30, 85, 55, 70, 45, 90, 60, 75].map((heightPct, barIdx) => (
              <div
                key={barIdx}
                className="w-full bg-slate-200/80 rounded-t-md skeleton-shimmer"
                style={{ height: `${heightPct}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Table Section Skeleton
export const TableSectionSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5  animate-pulse space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="h-5 w-48 bg-slate-200 rounded-md skeleton-shimmer" />
        <div className="h-8 w-32 bg-slate-200 rounded-lg skeleton-shimmer" />
      </div>
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((rowIdx) => (
          <div key={rowIdx} className="h-12 bg-slate-50 rounded-xl px-4 flex items-center justify-between">
            <div className="h-4 w-40 bg-slate-200 rounded-md skeleton-shimmer" />
            <div className="h-4 w-28 bg-slate-200 rounded-md skeleton-shimmer" />
            <div className="h-4 w-24 bg-slate-200 rounded-md skeleton-shimmer hidden sm:block" />
            <div className="h-7 w-20 bg-slate-200 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Full Page Skeleton Preloader
export const SkeletonPreloader = ({ message }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-[1800px] w-full mx-auto">
      {/* Optional Overlay Banner if message provided */}
      {message && (
        <div className="bg-slate-100/80 border border-slate-300/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 flex items-center gap-2 ">
          <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-slate-200 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-80 bg-slate-200 rounded-md skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-slate-200 rounded-lg skeleton-shimmer" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* 2. Filter Bar Skeleton */}
      <FilterBarSkeleton />

      {/* 3. Matched 8 KPI Box Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* 4. Chart Section Skeleton */}
      <ChartSectionSkeleton />

      {/* 5. Table Section Skeleton */}
      <TableSectionSkeleton />
    </div>
  );
};

export default SkeletonPreloader;
