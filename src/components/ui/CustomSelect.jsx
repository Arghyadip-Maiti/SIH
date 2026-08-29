import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ value, onChange, options, defaultLabel, className = '', placement = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || { label: defaultLabel, value: '' };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-[34px] text-xs font-bold bg-transparent flex items-center gap-1.5 text-slate-700 hover:text-slate-900 focus:outline-none transition-all px-1"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-900 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute ${placement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} right-0 w-full min-w-[140px] bg-white border border-slate-200 rounded-lg shadow-lg z-[1000] max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                value === opt.value
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
