export const Card = ({
  children,
  className = '',
  header,
  footer,
  noPadding = false,
  noHeaderBorder = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80  overflow-hidden transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:' : ''
      } ${className}`}
    >
      {header && (
        <div className={`px-5 py-4 flex items-center justify-between ${noHeaderBorder ? '' : 'border-b border-slate-100'}`}>
          {header}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
};
