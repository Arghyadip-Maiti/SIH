export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full text-sm bg-white border border-slate-300 rounded-lg py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400 ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};
