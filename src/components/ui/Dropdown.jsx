import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger || (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none"
          >
            <span>Options</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-48 rounded-lg bg-white  border border-slate-200 py-1 focus:outline-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              {item.icon && <item.icon className="w-4 h-4 text-slate-500" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
