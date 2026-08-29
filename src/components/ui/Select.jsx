export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  className = '',
  disabled = false,
  error,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-slate-50 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
};
