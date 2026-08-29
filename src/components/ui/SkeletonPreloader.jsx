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

// Project Filter Grid Skeleton (Matching ProjectFilterBar 6 cols x 2 rows)
export const ProjectFilterBarSkeleton = () => {
  return (
    <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-6 items-end animate-pulse">
      <div className="flex flex-col justify-between h-full row-span-2 gap-4">
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-200 rounded skeleton-shimmer" />
          <div className="h-[34px] w-full bg-slate-200 rounded-lg skeleton-shimmer" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-16 bg-slate-200 rounded skeleton-shimmer" />
          <div className="h-[34px] w-full bg-slate-200 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3 w-20 bg-slate-200 rounded skeleton-shimmer" />
          <div className="h-[34px] w-full bg-slate-200 rounded-lg skeleton-shimmer" />
        </div>
      ))}
      <div>
        <div className="h-[34px] w-24 bg-slate-200 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

// Projects Page Specific Skeleton Preloader
export const ProjectsSkeletonPreloader = ({ message = 'Loading MPLADS projects dataset & analytics...' }) => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-[1800px] w-full mx-auto">
      {/* Optional Overlay Banner if message provided */}
      {message && (
        <div className="bg-slate-100/80 border border-slate-300/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 rounded-lg skeleton-shimmer" />
          <div className="h-3.5 w-80 bg-slate-200 rounded-md skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-slate-200 rounded-lg skeleton-shimmer" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg skeleton-shimmer" />
        </div>
      </div>

      {/* 2. Project Filter Grid Skeleton */}
      <ProjectFilterBarSkeleton />

      {/* 3. Matched 8 KPI Box Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* 4. Visualizations Skeleton */}
      <ChartSectionSkeleton />

      {/* 5. Sector and Performance Skeleton */}
      <ChartSectionSkeleton />

      {/* 6. Projects Master Data Table Skeleton */}
      <TableSectionSkeleton />
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

// Member of Parliament (MP) Profile Specific Skeleton Preloader
export const MPSkeletonPreloader = ({ message = 'Loading MP performance profile & analytics...' }) => {
  return (
    <div className="space-y-7 pb-16 animate-fadeIn max-w-[1800px] w-full mx-auto">
      {/* Optional Overlay Banner */}
      {message && (
        <div className="bg-slate-100/80 border border-slate-300/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping" />
          <span>{message}</span>
        </div>
      )}

      {/* Top Header & Back button skeleton */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="w-6 h-6 bg-slate-200 rounded-md skeleton-shimmer" />
        <div className="h-8 w-44 bg-slate-200 rounded-lg skeleton-shimmer" />
      </div>

      {/* MP Hero Banner Card Skeleton */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-pulse">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-4 border-slate-700 skeleton-shimmer shrink-0" />
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-slate-800 rounded-lg skeleton-shimmer" />
                <div className="h-6 w-36 bg-slate-800 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-8 w-60 bg-slate-800 rounded-lg skeleton-shimmer" />
              <div className="h-4 w-72 bg-slate-800 rounded-md skeleton-shimmer" />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="w-64 h-36 bg-slate-800/80 rounded-3xl skeleton-shimmer" />
            <div className="w-64 h-36 bg-slate-800/80 rounded-3xl skeleton-shimmer" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-4 bg-slate-800 rounded skeleton-shimmer" />
          <div className="h-4 bg-slate-800 rounded skeleton-shimmer" />
          <div className="h-4 bg-slate-800 rounded skeleton-shimmer" />
        </div>
      </div>

      {/* Financial Allocation & Expenditure KPI Cards Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-80 bg-slate-200 rounded-md skeleton-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 animate-pulse">
              <div className="h-3 w-28 bg-slate-200 rounded skeleton-shimmer" />
              <div className="h-7 w-36 bg-slate-200 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-32 bg-slate-200 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 animate-pulse">
              <div className="h-3 w-20 bg-slate-200 rounded mx-auto skeleton-shimmer" />
              <div className="h-6 w-16 bg-slate-200 rounded-md mx-auto skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Sanctioned Works Table Skeleton */}
      <TableSectionSkeleton />

      {/* Backend AI Constituency Audit Report Skeleton */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="h-6 w-64 bg-slate-800 rounded skeleton-shimmer" />
          <div className="h-6 w-44 bg-slate-800 rounded-full skeleton-shimmer" />
        </div>
        <div className="h-20 bg-slate-950 rounded-2xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export default SkeletonPreloader;
