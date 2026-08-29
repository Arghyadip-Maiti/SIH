const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/components/IndiaMapSection.jsx', 'utf8');

// Add CustomSelect component definition inside the file (or outside the export)
const customSelectCode = `
import { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, defaultLabel }) => {
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
    <div className="relative min-w-[180px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[34px] text-xs font-medium bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 flex items-center justify-between text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all "
      >
        <span className="truncate pr-2">{selectedOption.label}</span>
        <ChevronDown className={\`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 w-full min-w-[180px] mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={\`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors \${
                value === opt.value
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }\`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
`;

if (!content.includes('const CustomSelect')) {
  content = content.replace("import { Button } from '../../../components/ui/Button';", "import { Button } from '../../../components/ui/Button';\n" + customSelectCode);
}
// Note: useState is already imported in IndiaMapSection.jsx

// Find the native select and remove it from the left
const oldSelectBlock = `              <div className="ml-2 relative sm:block">
                <select
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
                >
                  {METRIC_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>`;

content = content.replace(oldSelectBlock, "");

// Add the CustomSelect on the right side
const oldRightSide = `{zoomedState && (
            <Button onClick={handleBackToIndia} variant="outline" size="sm" className="hidden sm:flex">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to India Map
            </Button>
          )}`;

const newRightSide = `<div className="flex items-center gap-3">
            <CustomSelect
              value={activeMetric}
              onChange={setActiveMetric}
              options={METRIC_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
              defaultLabel="Select Metric"
            />
            {zoomedState && (
              <Button onClick={handleBackToIndia} variant="outline" size="sm" className="hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to India Map
              </Button>
            )}
          </div>`;

if (content.includes(oldRightSide)) {
  content = content.replace(oldRightSide, newRightSide);
}

fs.writeFileSync('src/pages/Overview/components/IndiaMapSection.jsx', content);
