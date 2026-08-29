export const FilterBar = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white p-3.5 rounded-xl border border-slate-200/80  flex flex-wrap items-center gap-3 mb-6 ${className}`}
    >
      {children}
    </div>
  );
};
