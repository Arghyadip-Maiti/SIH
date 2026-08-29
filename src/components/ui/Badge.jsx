export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border border-transparent';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-slate-100 text-slate-800 border-slate-300',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-slate-100 text-slate-800 border-slate-300',
    sky: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </span>
  );
};
