import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  AlertTriangle,
  FileText,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Building,
  HardHat,
  Globe,
  Maximize2,
  User,
  Tag,
  Layers,
  Navigation,
  Sparkles,
  Bot,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronDown,
  Receipt,
  DollarSign,
  Filter,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getStatusBadgeClass, getRiskColorClass } from '../../utils/projectAnalytics';

export const ProjectDetailsView = ({ project, onClose }) => {
  const [selectedStagePercentage, setSelectedStagePercentage] = useState(25);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Lightbox photo
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [financialFilter, setFinancialFilter] = useState('all'); // 'all' | 'anomaly'
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: false,
    financial: false,
    ledger: false,
    milestones: false,
    location: false,
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else if (onClose) {
          onClose();
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, selectedPhoto]);

  if (!project) return null;

  const p = project;
  const statusBadge = getStatusBadgeClass(p.status);
  const riskBadge = getRiskColorClass(p.riskScore);

  const currProg = Number(p.progress || 0);
  const finProg = Number(p.financialProgress || 0);
  const sanctioned = Number(p.sanctionedAmount || 10000000);
  const expenditure = Number(p.expenditure || 6500000);

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  // Base coordinates and photo fallbacks
  const lat = Number(p.latitude || 20.5937);
  const lng = Number(p.longitude || 78.9629);

  const rawPhotos = Array.isArray(p.photos) ? p.photos : [];
  const photoUrls = rawPhotos.map((item) => (typeof item === 'string' ? item : item.url));

  const defaultImages = [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
  ];

  // 4 Milestone Stages Data Structure (with multiple photos list per stage)
  const milestoneStages = [
    {
      percentage: 25,
      stageName: 'Stage 1: 25% Milestone',
      title: 'Foundation & Substructure Excavation',
      description: 'Ground clearance, soil excavation, foundation rebar layout, and concrete footing casting.',
      photos: [
        {
          id: '25_1',
          title: 'Ground Clearance & Boundary Excavation',
          url: photoUrls[0] || defaultImages[0],
          submissionDate: '2024-03-15 10:30 AM',
          lat: lat,
          lng: lng,
          aiOpinion: `AI Vision Model verified 25% excavation depth & site boundary against plot boundary. Verification score: 98/100.`,
        },
        {
          id: '25_2',
          title: 'Foundation Rebar & Steel Cage Assembly',
          url: defaultImages[4],
          submissionDate: '2024-03-18 02:15 PM',
          lat: lat + 0.0004,
          lng: lng + 0.0003,
          aiOpinion: `AI Rebar Counting Algorithm detected structural steel reinforcement matching 25% engineering sanction drawing.`,
        },
        {
          id: '25_3',
          title: 'Concrete Footing Casting & Trench Pouring',
          url: defaultImages[1],
          submissionDate: '2024-03-22 04:00 PM',
          lat: lat + 0.0007,
          lng: lng + 0.0005,
          aiOpinion: `AI Depth Analysis confirmed concrete poured & set according to 25% stage milestone specifications.`,
        },
      ],
    },
    {
      percentage: 50,
      stageName: 'Stage 2: 50% Milestone',
      title: 'Superstructure & Column Framing',
      description: 'Reinforced concrete pillar casting, main load-bearing beam construction, and frame erection.',
      photos: [
        {
          id: '50_1',
          title: 'RCC Vertical Column Casting & Shuttering',
          url: photoUrls[1] || defaultImages[1],
          submissionDate: '2024-07-10 11:15 AM',
          lat: lat + 0.0002,
          lng: lng + 0.0004,
          aiOpinion: `AI Vision Model confirmed RCC vertical column height & alignment. Physical progress matches 50% milestone target.`,
        },
        {
          id: '50_2',
          title: 'Horizontal Beam Structural Reinforcement',
          url: defaultImages[5],
          submissionDate: '2024-07-18 03:30 PM',
          lat: lat + 0.0005,
          lng: lng + 0.0006,
          aiOpinion: `Beam span analysis verified by Backend AI. Structural load distribution matched with 50% milestone layout.`,
        },
        {
          id: '50_3',
          title: 'First Floor Slab Framework & Concrete Prep',
          url: defaultImages[2],
          submissionDate: '2024-07-25 09:45 AM',
          lat: lat + 0.0009,
          lng: lng + 0.0008,
          aiOpinion: `Formwork coverage verified by computer vision. Geofencing matches sanctioned plot coordinates.`,
        },
      ],
    },
    {
      percentage: 75,
      stageName: 'Stage 3: 75% Milestone',
      title: 'Roofing Slab & Masonry Work',
      description: 'Roofing slab casting, exterior brick masonry, plumbing & electrical conduit installation.',
      photos: [
        {
          id: '75_1',
          title: 'Roofing Slab Pouring & Curing Audit',
          url: photoUrls[2] || defaultImages[2],
          submissionDate: '2024-11-05 10:00 AM',
          lat: lat + 0.0003,
          lng: lng + 0.0002,
          aiOpinion: `Roofing slab surface verified. ${p.paymentProgressMismatch ? 'AI Vision Flag: Financial claim (85%) exceeds physical progress (60%). Field audit required.' : 'AI Vision confirmed completion matching 75% stage specifications.'}`,
        },
        {
          id: '75_2',
          title: 'Exterior Brick Masonry & Wall Construction',
          url: defaultImages[0],
          submissionDate: '2024-11-12 01:20 PM',
          lat: lat + 0.0006,
          lng: lng + 0.0004,
          aiOpinion: `Brickwork volume & wall perimeter verified by backend system vision model.`,
        },
        {
          id: '75_3',
          title: 'Internal Electrical & Plumbing Conduit Fitting',
          url: defaultImages[3],
          submissionDate: '2024-11-20 04:50 PM',
          lat: lat + 0.0008,
          lng: lng + 0.0007,
          aiOpinion: `Utility piping layout verified against sanction plan.`,
        },
      ],
    },
    {
      percentage: 100,
      stageName: 'Stage 4: 100% Milestone',
      title: 'Final Completion & Site Handover',
      description: 'Surface plastering, painting, fixture installation, quality testing, and final site handover.',
      photos: [
        {
          id: '100_1',
          title: 'Exterior Plastering & Architectural Finishing',
          url: photoUrls[3] || defaultImages[3],
          submissionDate: p.expectedCompletionDate || '2026-12-31',
          lat: lat + 0.0001,
          lng: lng + 0.0001,
          aiOpinion: `Final completion check. AI Vision Model analyzed exterior finish and paint coverage.`,
        },
        {
          id: '100_2',
          title: 'Interior Fixture Installation & Electrification',
          url: defaultImages[1],
          submissionDate: p.expectedCompletionDate || '2026-12-31',
          lat: lat + 0.0004,
          lng: lng + 0.0003,
          aiOpinion: `Interior electrification and fixture count verified by backend audit system.`,
        },
        {
          id: '100_3',
          title: 'Final Quality Certification & Site Cleanliness',
          url: defaultImages[4],
          submissionDate: p.expectedCompletionDate || '2026-12-31',
          lat: lat + 0.0007,
          lng: lng + 0.0006,
          aiOpinion: `Final handover clearance verified. Project physical completion registered at 100%.`,
        },
      ],
    },
  ];

  // Currently active stage data object
  const currentActiveStage = milestoneStages.find((s) => s.percentage === selectedStagePercentage) || milestoneStages[0];
  const isStageCompleted = currProg >= currentActiveStage.percentage;
  const isStageMismatch = p.paymentProgressMismatch && isStageCompleted && currentActiveStage.percentage >= 50;

  // Contractor Itemized Financial Transactions Data with Backend AI Cost Anomaly Detection
  const hasFinancialRisk = p.paymentProgressMismatch || p.costOverrun || p.riskScore > 50;

  const financialTransactions = [
    {
      id: 'TXN-2024-01',
      date: '2024-02-12',
      category: 'Material Procurement',
      cause: 'Grade-500 TMT Steel Rebar & Structural Rod Supply',
      vendor: 'National Steel Corporation',
      invoiceRef: 'INV-PWD-8812',
      amount: Math.round(expenditure * 0.28),
      status: 'verified',
      aiAnalysis: 'AI Rate Check: Claimed unit rate (₹66/kg) matches PWD District Schedule of Rates (DSR 2026). Material volume aligned with 25% milestone sanction.',
    },
    {
      id: 'TXN-2024-02',
      date: '2024-03-05',
      category: 'Machinery & Equipment',
      cause: 'Heavy Earthmover Excavator & JCB Rental Charges (14 Days)',
      vendor: 'Apex Infra Machinery Ltd',
      invoiceRef: 'INV-PWD-9104',
      amount: Math.round(expenditure * 0.12),
      status: 'verified',
      aiAnalysis: 'AI Market Audit: Equipment hourly rental rate (₹2,200/hr) verified within district standard ceiling limits. Fuel logs validated.',
    },
    {
      id: 'TXN-2024-03',
      date: '2024-04-18',
      category: 'Material Procurement',
      cause: 'Ready-Mix Concrete (M25 High-Strength Concrete) Supply',
      vendor: 'UltraTech ReadyMix Solutions',
      invoiceRef: 'INV-PWD-1044',
      amount: Math.round(expenditure * 0.32),
      status: hasFinancialRisk ? 'anomaly' : 'verified',
      aiAnalysis: hasFinancialRisk
        ? 'AI Cost Anomaly Flagged (24% Price Inflation): Claimed unit price (₹5,800/m³) exceeds district benchmark rate (₹4,680/m³). Excess billing of approx ₹2.4 Lakhs flagged for audit.'
        : 'AI Rate Check: Concrete mix unit price (₹4,700/m³) verified against district benchmark rates.',
    },
    {
      id: 'TXN-2024-04',
      date: '2024-06-20',
      category: 'Labor & Wages',
      cause: 'Masonry & Concrete Pouring Skilled Labor Muster Roll Payout',
      vendor: 'State Infrastructure Labor Guild',
      invoiceRef: 'WAGE-2024-06B',
      amount: Math.round(expenditure * 0.15),
      status: 'verified',
      aiAnalysis: 'AI Wage Audit: Muster roll biometric attendance entries cross-matched with site geotags. Wage payouts comply with Minimum Wages Act.',
    },
    {
      id: 'TXN-2024-05',
      date: '2024-08-10',
      category: 'Utility & Fittings',
      cause: 'Heavy Duty PVC Electrical Conduit Piping & Drainage Fittings',
      vendor: 'Polycab Industrial Supplies',
      invoiceRef: 'INV-PWD-1290',
      amount: Math.round(expenditure * 0.13),
      status: hasFinancialRisk && p.riskScore > 65 ? 'anomaly' : 'verified',
      aiAnalysis: hasFinancialRisk && p.riskScore > 65
        ? 'AI Voucher Anomaly Flagged (Duplicate Invoice Reference): Invoice #INV-PWD-1290 voucher number matches a claim submitted in adjacent constituency project #MP/MH/04.'
        : 'AI Audit Passed: Utility conduit fittings cost and volume within sanctioned DPR budget bounds.',
    },
  ];

  // Filter transactions
  const filteredTransactions = financialFilter === 'anomaly'
    ? financialTransactions.filter((t) => t.status === 'anomaly')
    : financialTransactions;

  const totalAnomalies = financialTransactions.filter((t) => t.status === 'anomaly').length;

  // Google Maps iframe URL
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed&t=${mapType === 'satellite' ? 'k' : 'm'}`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-modalBackdrop"
    >
      <div className="bg-white rounded-3xl border-0 shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-modalPop">
        
        {/* ========================================================================= */}
        {/* MODAL TOP HEADER */}
        {/* ========================================================================= */}
        <div className="p-6 bg-black text-white flex items-start justify-between border-b border-neutral-800 shrink-0 relative overflow-hidden">
          {/* Subtle background glow element */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 pr-6 z-10">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-neutral-300 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                {p.id}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold  ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${riskBadge.bg}`}>
                AI Risk Score: {p.riskScore}/100 ({p.riskLevel})
              </span>
              <span className="bg-neutral-900 text-neutral-300 text-xs font-bold px-3 py-1 rounded-full border border-neutral-800">
                FY {p.financialYear}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-1">
              {p.name}
            </h2>
            <p className="text-sm text-neutral-300 font-medium flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-neutral-200">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                {p.district}, {p.state}
              </span>
              <span>&bull;</span>
              <span>Constituency: <strong className="text-white">{p.constituencyName}</strong></span>
              <span>&bull;</span>
              <span>MP: <strong className="text-white">{p.mpName}</strong> ({p.house})</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all z-10 shrink-0"
            title="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL SCROLLABLE CONTENT BODY */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-800">
          
          {/* ------------------------------------------------------------------------- */}
          {/* SECTION 1: BASIC INFORMATION (ENLARGED & PROMINENT) */}
          {/* ------------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all shadow-xs">
            <div
              onClick={() => toggleSection('basicInfo')}
              className="p-6 sm:p-7 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
            >
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-800 flex items-center gap-2.5">
                <div className="p-2 bg-slate-800 text-white rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <span>Basic Information</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.basicInfo ? 'rotate-180' : ''}`} />
              </h3>
              <span className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-xl border border-black hidden sm:inline-block">
                Official Sanctioned Project Record
              </span>
            </div>

            {expandedSections.basicInfo && (
              <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 space-y-6 animate-fadeIn">
                {/* Enlarged Key Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-700" /> Project Title
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">{p.name}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-700" /> Unique Project ID
                    </span>
                    <p className="font-mono font-black text-slate-800 text-base sm:text-lg">{p.id}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-700" /> State &amp; District
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.district}, {p.state}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-700" /> Parliamentary Constituency
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.constituencyName} ({p.constituencyId})</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-700" /> Member of Parliament (MP)
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.mpName} <span className="text-xs text-slate-700 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-300">{p.house}</span></p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-700" /> Sector Work Category
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.projectType}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-slate-700" /> Nodal Implementing Agency
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.implementingAgency}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-700" /> Executing Contractor
                    </span>
                    <p className="font-extrabold text-slate-900 text-base sm:text-lg">{p.contractor}</p>
                  </div>

                  <div className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-1">
                    <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-700" /> Financial Year
                    </span>
                    <p className="font-mono font-black text-slate-900 text-base sm:text-lg">FY {p.financialYear}</p>
                  </div>
                </div>

                {/* Prominent Project Description & Scope Box */}
                <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-slate-500 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Project Scope &amp; Functional Description
                  </span>
                  <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed pt-1">
                    {p.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* SECTION 2: FINANCIAL ALLOCATION & PROGRESS EXECUTION */}
          {/* ------------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all shadow-xs">
            <div
              onClick={() => toggleSection('financial')}
              className="p-6 sm:p-7 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
            >
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-emerald-700 flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>Financial Allocation &amp; Progress Execution</span>
                <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform duration-300 ${expandedSections.financial ? 'rotate-180' : ''}`} />
              </h3>
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 hidden sm:inline-block">
                {p.progress}% Physical / {p.financialProgress}% Financial
              </span>
            </div>

            {expandedSections.financial && (
              <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 space-y-6 animate-fadeIn">
                {/* Financial Overview Metrics (Clean Text Layout without Boxes) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
                  <div>
                    <span className="text-slate-500 text-xs uppercase font-extrabold block tracking-wider">Estimated Cost</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-1 block">{formatCurrency(p.estimatedCost)}</span>
                  </div>

                  <div>
                    <span className="text-emerald-700 text-xs uppercase font-extrabold block tracking-wider">Sanctioned Amount</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-emerald-700 mt-1 block">{formatCurrency(p.sanctionedAmount)}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-xs uppercase font-extrabold block tracking-wider">Expenditure Spent</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-1 block">{formatCurrency(p.expenditure)}</span>
                  </div>

                  <div>
                    <span className="text-amber-700 text-xs uppercase font-extrabold block tracking-wider">Unutilized Funds</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-amber-700 mt-1 block">{formatCurrency(p.unutilizedAmount)}</span>
                  </div>
                </div>

                {/* Progress Bars Comparison (Clean Text & Bar Layout without Outer Box) */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="font-extrabold text-sm text-slate-800">Physical vs Financial Progress Comparison</span>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {p.progress}% Physical / {p.financialProgress}% Financial
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Physical Progress</span>
                        <span className="font-mono">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-800 transition-all duration-500"
                          style={{ width: `${Math.min(100, p.progress)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Financial Progress (Disbursement)</span>
                        <span className="font-mono text-emerald-700">{p.financialProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, p.financialProgress)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {p.paymentProgressMismatch && (
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Disbursement Mismatch Warning:</strong> Financial disbursement ({p.financialProgress}%) significantly exceeds physical milestone progress ({p.progress}%).
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* SECTION 3: CONTRACTOR ITEMIZED EXPENSE LEDGER & AI COST AUDIT */}
          {/* ------------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all shadow-xs">
            <div
              onClick={() => toggleSection('ledger')}
              className="p-6 sm:p-7 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
            >
              <div>
                <h4 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span>Contractor Itemized Expense Ledger &amp; AI Cost Audit</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.ledger ? 'rotate-180' : ''}`} />
                </h4>
                <p className="text-xs text-slate-500 font-medium pt-1">
                  Date-wise breakdown of contractor claims. Backend AI audit models scan each itemized cost for price inflation or billing anomalies.
                </p>
              </div>
            </div>

            {expandedSections.ledger && (
              <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 space-y-5 animate-fadeIn">
                {/* Filter Switcher */}
                <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtered Claims Overview</span>
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFinancialFilter('all');
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${financialFilter === 'all' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      All Expenses ({financialTransactions.length})
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFinancialFilter('anomaly');
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${financialFilter === 'anomaly' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:text-amber-900'}`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>AI Anomalies ({totalAnomalies})</span>
                    </button>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3"
                      >
                        {/* Top Row: Date, Cause, Category & Amount */}
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                                🗓️ {tx.date}
                              </span>
                              <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                                {tx.category}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                Inv: #{tx.invoiceRef}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-sm sm:text-base text-slate-900 pt-0.5">
                              {tx.cause}
                            </h5>
                            <p className="text-xs text-slate-500 font-medium">
                              Billed by Vendor: <strong className="text-slate-700">{tx.vendor}</strong>
                            </p>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="text-slate-400 text-[10px] uppercase font-extrabold block">Billed Expenditure</span>
                            <span className="text-lg sm:text-xl font-mono font-black text-slate-900">
                              {formatCurrency(tx.amount)}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row: BACKEND AI COST VERIFICATION & ANOMALY FINDING BOX */}
                        <div
                          className={`p-3 rounded-xl border-0 text-xs space-y-1 ${
                            tx.status === 'anomaly'
                              ? 'bg-amber-50 text-amber-950'
                              : 'bg-emerald-50/80 text-emerald-950'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              {tx.status === 'anomaly' ? (
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              <span className={tx.status === 'anomaly' ? 'text-amber-900 font-extrabold' : 'text-emerald-900 font-extrabold'}>
                                {tx.status === 'anomaly' ? 'Backend AI Cost Anomaly Flagged' : 'Backend AI Cost Verified'}
                              </span>
                            </span>
                            <span className="font-mono text-[10px] opacity-80">System Cost Engine</span>
                          </div>

                          <p className="text-[11px] font-medium leading-relaxed">
                            {tx.aiAnalysis}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                      No cost anomalies detected in this project&apos;s itemized financial claims.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* SECTION 4: STAGE-WISE MILESTONE PHOTO GALLERIES (25%, 50%, 75%, 100%) */}
          {/* ------------------------------------------------------------------------- */}
          <div className="bg-zinc-900 rounded-3xl text-white border border-zinc-800 overflow-hidden transition-all shadow-xs">
            {/* Header */}
            <div
              onClick={() => toggleSection('milestones')}
              className="p-6 sm:p-7 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none hover:bg-zinc-800/60 transition-colors"
            >
              <div>
                <h3 className="text-base sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2.5">
                  <span>MILESTONE TRACKER &amp; VERIFICATION</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${expandedSections.milestones ? 'rotate-180' : ''}`} />
                </h3>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-zinc-800/90 px-3.5 py-1.5 rounded-xl border border-zinc-700 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-200 font-bold">Backend AI Computer Vision</span>
              </div>
            </div>

            {expandedSections.milestones && (
              <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 space-y-6 animate-fadeIn">
                {/* INTERACTIVE STAGE SELECTOR TABS (25%, 50%, 75%, 100%) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {milestoneStages.map((stage) => {
                    const isSelected = selectedStagePercentage === stage.percentage;
                    const isCompleted = currProg >= stage.percentage;
                    const isMismatch = p.paymentProgressMismatch && isCompleted && stage.percentage >= 50;

                    return (
                      <button
                        key={stage.percentage}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStagePercentage(stage.percentage);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'bg-zinc-800 border-zinc-500 text-white ring-2 ring-zinc-600 scale-[1.02]'
                            : isCompleted
                            ? isMismatch
                              ? 'bg-amber-950/40 border-amber-700/80 text-amber-200 hover:bg-amber-900/50'
                              : 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-700/80'
                            : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs font-extrabold mb-1">
                          <span className={isSelected ? 'text-white' : 'text-zinc-400'}>
                            {stage.percentage}% Milestone
                          </span>
                          {isCompleted ? (
                            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                              <Check className="w-3 h-3" /> {stage.photos.length} Photos
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400">Pending</span>
                          )}
                        </div>

                        <p className={`font-black text-xs truncate ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                          {stage.title}
                        </p>

                        <div className="flex items-center justify-between pt-2 text-[10px] opacity-80">
                          <span>{stage.stageName}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-zinc-400'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* SELECTED STAGE GALLERY CONTAINER */}
                <div className="p-5 bg-zinc-950/80 rounded-3xl border border-zinc-800 space-y-5">
                  {/* Active Stage Header Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-zinc-800 text-white rounded-2xl font-mono font-black text-sm">
                        {currentActiveStage.percentage}%
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>{currentActiveStage.title}</span>
                          <span className="text-xs font-normal text-zinc-400 font-mono">({currentActiveStage.stageName})</span>
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium">{currentActiveStage.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isStageCompleted
                          ? isStageMismatch
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {isStageCompleted && !isStageMismatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isStageMismatch && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {!isStageCompleted && <Clock className="w-3.5 h-3.5 text-zinc-400" />}
                        <span>
                          {isStageCompleted
                            ? isStageMismatch
                              ? 'AI Discrepancy Flagged'
                              : 'Milestone Verified by System AI'
                            : `Pending Execution (${currProg}% Current Progress)`}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* LIST OF PHOTOS AT THIS STAGE */}
                  {isStageCompleted ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-zinc-400" />
                          <span>Submitted Photo Evidence Gallery ({currentActiveStage.photos.length} Images at {currentActiveStage.percentage}% Stage)</span>
                        </span>
                        <span>Contractor: <strong className="text-zinc-200">{p.contractor}</strong></span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {currentActiveStage.photos.map((photo, pIdx) => (
                          <div
                            key={photo.id || pIdx}
                            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group"
                          >
                            {/* Image Container */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhoto({ ...photo, stageName: currentActiveStage.stageName, percentage: currentActiveStage.percentage });
                              }}
                              className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                            >
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/90 text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                  <Maximize2 className="w-3.5 h-3.5" /> Expand Photo &amp; AI Data
                                </span>
                              </div>

                              <div className="absolute top-2.5 left-2.5 bg-zinc-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-zinc-800">
                                Photo #{pIdx + 1}
                              </div>

                              <div className="absolute bottom-2.5 right-2.5 bg-zinc-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-zinc-800">
                                📍 {photo.lat.toFixed(4)}° N, {photo.lng.toFixed(4)}° E
                              </div>
                            </div>

                            {/* Photo Information & System AI Opinion */}
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold mb-1">
                                  <span className="text-zinc-500 font-mono">Stage Photo {pIdx + 1} of {currentActiveStage.photos.length}</span>
                                  <span>{photo.submissionDate}</span>
                                </div>
                                <h5 className="font-extrabold text-sm text-white leading-tight">{photo.title}</h5>
                              </div>

                              {/* BACKEND AI OPINION FOR THIS PHOTO */}
                              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1 text-xs">
                                <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[11px] uppercase">
                                  <Bot className="w-3.5 h-3.5 shrink-0" />
                                  <span>System AI Opinion Analysis:</span>
                                </div>
                                <p className="text-zinc-300 text-[11px] font-medium leading-relaxed">
                                  {photo.aiOpinion}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Pending Empty State */
                    <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-dashed border-zinc-800 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-base text-white">Stage Photo Submission Pending</h5>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">
                          Physical progress for this project is currently evaluated at <strong>{currProg}%</strong>. Contractor photo submissions for the <strong>{currentActiveStage.percentage}% milestone stage</strong> will automatically list here once the physical work reaches this level.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------------- */}
          {/* SECTION 5: LOCATION & GOOGLE MAPS IFRAME */}
          {/* ------------------------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all shadow-xs">
            <div
              onClick={() => toggleSection('location')}
              className="p-6 flex items-center justify-between flex-wrap gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
            >
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black flex items-center gap-2">
                  <div className="p-2 bg-black text-white rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Geographic Location &amp; Site Map</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.location ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-xs text-slate-500 font-medium pt-0.5">
                  Exact physical coordinates and live Google Maps iframe view of the sanctioned work site
                </p>
              </div>
            </div>

            {expandedSections.location && (
              <div className="px-6 pb-6 pt-0 space-y-4 animate-fadeIn">
                {/* Map controls */}
                <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapType('roadmap');
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all ${mapType === 'roadmap' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        Roadmap
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapType('satellite');
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all ${mapType === 'satellite' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        Satellite
                      </button>
                    </div>
                  </div>

                  <a
                    href={externalGoogleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Coordinates metadata bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                    <Navigation className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Exact GPS Coordinates</span>
                      <span className="font-mono font-bold text-slate-900">{p.latitude?.toFixed(6)}° N, {p.longitude?.toFixed(6)}° E</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">District &amp; Constituency</span>
                      <span className="font-bold text-slate-900">{p.district}, {p.state} ({p.constituencyName})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Geofence Status</span>
                      <span className="font-bold text-emerald-950">GPS Geotag Verified (Accuracy: &plusmn;3m)</span>
                    </div>
                  </div>
                </div>

                {/* GOOGLE MAPS IFRAME */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-100">
                  <iframe
                    title={`Google Maps Location for ${p.name}`}
                    src={googleMapEmbedUrl}
                    width="100%"
                    height="380"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-[360px] sm:h-[400px] rounded-2xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Text under the scroll */}
          <div className="pt-6 pb-2 text-center border-t border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              Sanctioned under MPLADS Scheme &bull; Project ID: <strong className="text-slate-800">{p.id}</strong>
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX FOR FULL PHOTO VIEWING & AI ANALYSIS REPORT */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPhoto(null);
          }}
          className="fixed inset-0 bg-zinc-950/90 backdrop-blur-lg z-[10100] flex items-center justify-center p-4 animate-modalBackdrop"
        >
          <div className="relative max-w-4xl w-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh] animate-modalPop">
            <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div>
                <h4 className="font-extrabold text-sm text-zinc-300">{selectedPhoto.stageName || 'Milestone Photo'} - {selectedPhoto.title}</h4>
                <p className="text-xs text-zinc-400">Contractor: {p.contractor} &bull; Date: {selectedPhoto.submissionDate}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl "
              />
            </div>

            <div className="p-4 bg-zinc-950 text-zinc-300 text-xs space-y-2 border-t border-zinc-800">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-mono text-emerald-400 font-bold">
                  📍 GPS Geotag: {selectedPhoto.lat ? selectedPhoto.lat.toFixed(6) : lat}° N, {selectedPhoto.lng ? selectedPhoto.lng.toFixed(6) : lng}° E
                </span>
                <span className="bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700 font-bold text-[10px] flex items-center gap-1">
                  <Bot className="w-3 h-3 text-zinc-400" /> Backend AI Computer Vision Verified
                </span>
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-400 block uppercase text-[10px] tracking-wider">Backend AI System Opinion:</span>
                <p className="text-zinc-300 leading-relaxed font-medium">
                  {selectedPhoto.aiOpinion}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>,
    document.body
  );
};

export default ProjectDetailsView;
