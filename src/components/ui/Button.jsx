export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-500 ',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400',
    outline: 'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 ',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
};
