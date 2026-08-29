import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { calculateMPPerformance, getStatusBadgeClass, getRiskColorClass } from '../../utils/projectAnalytics';
import {
  ArrowLeft,
  Award,
  TrendingUp,
  MapPin,
  FolderKanban,
  ExternalLink,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Landmark,
  Gauge,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProjectDetailsView } from '../../components/projects/ProjectDetailsView';
import { MPSkeletonPreloader } from '../../components/ui/SkeletonPreloader';

const DUMMY_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
];

const INDEX_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// =========================================================================
// ENLARGED CLASSY MATTE SPEEDOMETER GAUGE WITH 0-10-20...100 INDEXING
// =========================================================================
const SpeedometerGauge = ({ value = 0, label = 'Metric', max = 100, unit = '%', isRisk = false }) => {
  const [animatedVal, setAnimatedVal] = useState(0);
  const targetNumeric = Math.min(max, Math.max(0, Number(value || 0)));

  // Smooth pointer sweep from 0 to target value on mount/change
  useEffect(() => {
    setAnimatedVal(0);
    const timer = setTimeout(() => {
      setAnimatedVal(targetNumeric);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetNumeric]);

  const percentage = (animatedVal / max) * 100;
  // Needle rotation angle: 0% -> -90deg, 50% -> 0deg, 100% -> +90deg
  const needleAngle = (percentage / 100) * 180 - 90;

  // Classy matte non-glowing needle accent color
  const needleColor = isRisk
    ? targetNumeric <= 30
      ? '#10B981' // Green (Low Risk)
      : targetNumeric <= 60
      ? '#D97706' // Yellow (Medium Risk)
      : '#E11D48' // Red (High Risk)
    : targetNumeric <= 40
    ? '#E11D48' // Red (Poor Utilization)
    : targetNumeric <= 70
    ? '#D97706' // Yellow (Moderate Utilization)
    : '#10B981'; // Green (High Utilization)

  return (
    <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10  relative group min-w-[240px] sm:min-w-[270px]">
      {/* Classy Title Header */}
      <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-1 flex items-center gap-1.5 font-sans">
        <Gauge className="w-4 h-4 text-slate-500" />
        <span>{label}</span>
      </div>

      {/* Enlarged Speedometer Canvas SVG */}
      <div className="relative w-64 sm:w-72 h-36 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 240 145" className="w-full h-full">
          <defs>
            {/* Fund Utilization: RED -> YELLOW -> GREEN */}
            <linearGradient id="util-matte-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Risk Score: GREEN -> YELLOW -> RED */}
            <linearGradient id="risk-matte-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>

          {/* Minimal Thin Background Arc Track (Radius 85) */}
          <path
            d="M 35 115 A 85 85 0 0 1 205 115"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Minimal Thin Active Arc Track */}
          <path
            d="M 35 115 A 85 85 0 0 1 205 115"
            fill="none"
            stroke={isRisk ? "url(#risk-matte-grad)" : "url(#util-matte-grad)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="267"
            strokeDashoffset={267 - (267 * percentage) / 100}
            className="transition-all duration-1000 ease-out"
          />

          {/* Index Ticks & Labels from 0 to 100 (Steps of 10) */}
          <g className="font-sans text-[7.5px] fill-slate-400 font-semibold tracking-tighter">
            {INDEX_TICKS.map((tVal) => {
              const angleDeg = 180 - (tVal / 100) * 180;
              const rad = (angleDeg * Math.PI) / 180;

              // Tick line inner/outer
              const x1 = 120 + 75 * Math.cos(rad);
              const y1 = 115 - 75 * Math.sin(rad);
              const x2 = 120 + 82 * Math.cos(rad);
              const y2 = 115 - 82 * Math.sin(rad);

              // Text label
              const lx = 120 + 97 * Math.cos(rad);
              const ly = 115 - 97 * Math.sin(rad);

              // Label text: NO % sign for Risk Score!
              const labelText = isRisk ? `${tVal}` : (tVal === 0 || tVal === 100 ? `${tVal}%` : `${tVal}`);

              return (
                <g key={tVal}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <text x={lx} y={ly + 3} textAnchor="middle">
                    {labelText}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Classy Matte Needle Pointer */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '120px 115px',
              transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Tapered Pointer Line */}
            <line
              x1="120"
              y1="115"
              x2="120"
              y2="34"
              stroke={needleColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Center Cap */}
            <circle cx="120" cy="115" r="5" fill="#0F172A" stroke={needleColor} strokeWidth="2" />
          </g>
        </svg>

        {/* Digital Value Readout Box */}
        <div className="absolute bottom-1 text-center">
          <span className="text-2xl font-mono font-black text-white tracking-tight">
            {Math.round(animatedVal)}{isRisk ? '' : unit}
          </span>
          {isRisk && <span className="text-xs font-mono font-bold text-slate-400 ml-1">/ 100</span>}
        </div>
      </div>
    </div>
  );
};

export const MPDetailsPage = () => {
  const { mpId } = useParams();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && projects.length > 0) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (loading && projects.length === 0) {
      setShowSkeleton(true);
      setIsFadingOut(false);
    }
  }, [loading, projects.length]);

  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    window.history.pushState({ projectModalOpen: true }, '', `#project-${encodeURIComponent(proj.id)}`);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project-')) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProject]);

  // Scroll to top on page load or mpId change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [mpId]);

  const decodedMpId = decodeURIComponent(mpId || '');

  // Calculate master MP performance dataset
  const allMPs = useMemo(() => calculateMPPerformance(projects), [projects]);

  // Find target MP record
  const mpRecord = useMemo(() => {
    if (!decodedMpId) return allMPs[0];
    return (
      allMPs.find((m) => m.mpId === decodedMpId || m.mpName === decodedMpId || (m.mpName || '').toLowerCase() === decodedMpId.toLowerCase()) ||
      allMPs[0]
    );
  }, [allMPs, decodedMpId]);

  // Filter projects sanctioned under this MP
  const mpProjects = useMemo(() => {
    if (!mpRecord) return [];
    const targetName = (mpRecord.mpName || '').toLowerCase();
    const targetId = mpRecord.mpId;

    const matched = projects.filter(
      (p) =>
        p.mpId === targetId ||
        (p.mpName || '').toLowerCase() === targetName ||
        (p.mp || '').toLowerCase() === targetName
    );

    // Fallback if matched array is small
    if (matched.length > 0) return matched;
    return projects.slice(0, 8);
  }, [projects, mpRecord]);

  if (!mpRecord && !loading) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">Member of Parliament Record Not Found</h2>
        <Button onClick={() => navigate('/projects')} variant="primary">
          Return to Projects Master
        </Button>
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const avatarUrl = mpRecord ? DUMMY_AVATARS[Math.abs(mpRecord.mpName.length) % DUMMY_AVATARS.length] : DUMMY_AVATARS[0];

  return (
    <div className="relative min-h-full">
      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div 
          className={`absolute inset-0 z-50 transition-opacity duration-1000 bg-white ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <MPSkeletonPreloader message={`Loading MP Performance Profile & Analytics for ${decodedMpId || 'MP'}...`} />
        </div>
      )}

      {/* Real Content */}
      {mpRecord && (
        <div 
          className={`space-y-7 pb-16 transition-opacity duration-1000 ${
            isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* ------------------------------------------------------------------------- */}
          {/* TOP NAVIGATION & HEADER BAR */}
          {/* ------------------------------------------------------------------------- */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="p-1 text-slate-700 hover:text-black transition-transform hover:-translate-x-0.5 cursor-pointer inline-flex items-center justify-center focus:outline-none"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span className="font-mono bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-300">
                MP ID: {mpRecord.mpId}
              </span>
            </div>
          </div>

      {/* ------------------------------------------------------------------------- */}
      {/* MP HERO PROFILE BANNER CARD WITH CLASSY MATTE SPEEDOMETER GAUGES */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800  relative overflow-hidden space-y-6">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
          {/* Left Side: MP Profile Details */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* MP Avatar Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-slate-600  shrink-0 bg-slate-800">
              <img src={avatarUrl} alt={mpRecord.mpName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-800/90 text-white font-mono text-xs font-black px-3 py-1 rounded-lg border border-slate-500/40">
                  {mpRecord.house}
                </span>
                <span className="bg-emerald-950 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> MPLADS Sanctioned MP
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                  Term: 2024 - 2029
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white pt-1">
                {mpRecord.mpName}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Constituency: <strong className="text-white">{mpRecord.constituency}</strong>
                </span>
                <span>&bull;</span>
                <span>State: <strong className="text-white">{mpRecord.state}</strong></span>
              </p>
            </div>
          </div>

          {/* Right Side: ENLARGED CLASSY MATTE SPEEDOMETER GAUGES */}
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            {/* Speedometer 1: Fund Utilization */}
            <SpeedometerGauge
              label="Fund Utilization"
              value={mpRecord.utilization}
              unit="%"
              isRisk={false}
            />

            {/* Speedometer 2: AI Risk Score */}
            <SpeedometerGauge
              label="AI Risk Score"
              value={mpRecord.averageRiskScore}
              unit="/100"
              isRisk={true}
            />
          </div>
        </div>

        {/* Nodal Contact & Administration Bar */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 relative z-10">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Parliament Nodal Division: <strong>Ministry of Statistics &amp; Programme Implementation (MoSPI)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Official Email: <strong>{mpRecord.mpName.toLowerCase().replace(/[^a-z]/g, '')}@sansad.nic.in</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Nodal Office: <strong>District Nodal Officer Cell, {mpRecord.constituency}</strong></span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 1: FINANCIAL & UTILIZATION KPI CARDS */}
      {/* ------------------------------------------------------------------------- */}
      <div className="space-y-4">
        <h3 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
          <div className="p-1.5 bg-slate-800 text-white rounded-lg ">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span>MPLADS Financial Allocation &amp; Expenditure Performance</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl  space-y-1">
            <span className="text-slate-500 text-xs uppercase font-extrabold block">Total Sanctioned Fund</span>
            <span className="text-2xl font-mono font-black text-slate-900">{formatCurrency(mpRecord.sanctionedAmount)}</span>
            <span className="text-[11px] text-slate-400 font-semibold block">₹25.00 Cr Sanction Ceiling</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl  space-y-1">
            <span className="text-slate-500 text-xs uppercase font-extrabold block">Expenditure Incurred</span>
            <span className="text-2xl font-mono font-black text-emerald-700">{formatCurrency(mpRecord.expenditure)}</span>
            <span className="text-[11px] text-slate-400 font-semibold block">Disbursed Field Payouts</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl  space-y-1">
            <span className="text-slate-500 text-xs uppercase font-extrabold block">Unutilized Balance</span>
            <span className="text-2xl font-mono font-black text-amber-700">{formatCurrency(mpRecord.sanctionedAmount - mpRecord.expenditure)}</span>
            <span className="text-[11px] text-slate-400 font-semibold block">Available for New Sanctions</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl  space-y-1">
            <span className="text-slate-500 text-xs uppercase font-extrabold block">Sanctioned Works</span>
            <span className="text-2xl font-mono font-black text-slate-800">{mpRecord.totalProjects} Works</span>
            <span className="text-[11px] text-slate-400 font-semibold block">{mpRecord.completedProjects} Works Completed</span>
          </div>
        </div>

        {/* Works Progress Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <span className="text-slate-500 text-xs uppercase font-extrabold block">Total Works</span>
            <span className="text-xl font-mono font-black text-slate-900">{mpRecord.totalProjects}</span>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-950">
            <span className="text-xs uppercase font-extrabold block text-emerald-700">Completed Works</span>
            <span className="text-xl font-mono font-black">{mpRecord.completedProjects}</span>
          </div>
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl text-center text-slate-950">
            <span className="text-xs uppercase font-extrabold block text-slate-800">Ongoing Works</span>
            <span className="text-xl font-mono font-black">{mpRecord.ongoingProjects}</span>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-950">
            <span className="text-xs uppercase font-extrabold block text-rose-700">Delayed Works</span>
            <span className="text-xl font-mono font-black">{mpRecord.delayedProjects}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 2: SANCTIONED WORKS DIRECTORY FOR THIS MP */}
      {/* ------------------------------------------------------------------------- */}
      <div className="space-y-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 ">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 text-white rounded-xl ">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span>Sanctioned Infrastructure Works ({mpProjects.length} Projects Loaded)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium pt-1">
              Detailed registry of MPLADS works sanctioned by {mpRecord.mpName} in {mpRecord.constituency}
            </p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 ">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                <th className="p-3.5">Project ID &amp; Name</th>
                <th className="p-3.5">Sector</th>
                <th className="p-3.5">Sanctioned Amount</th>
                <th className="p-3.5">Spent</th>
                <th className="p-3.5">Physical %</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">AI Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 font-medium text-slate-800">
              {mpProjects.map((proj) => {
                const sBadge = getStatusBadgeClass(proj.status);
                const rBadge = getRiskColorClass(proj.riskScore);
                return (
                  <tr
                    key={proj.id}
                    onClick={() => handleSelectProject(proj)}
                    className="hover:bg-slate-100/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 space-y-0.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px] block">{proj.id}</span>
                      <span className="font-extrabold text-slate-900 text-sm block group-hover:text-slate-700 transition-colors">
                        {proj.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">{proj.district}, {proj.state}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold text-[11px]">
                        {proj.projectType}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {formatCurrency(proj.sanctionedAmount)}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      {formatCurrency(proj.expenditure)}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1 w-24">
                        <span className="font-mono font-bold text-slate-900">{proj.progress}%</span>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-slate-800 rounded-full" style={{ width: `${Math.min(100, proj.progress)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${sBadge.bg}`}>
                        {sBadge.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border ${rBadge.bg}`}>
                        {proj.riskScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* SECTION 3: BACKEND AI CONSTITUENCY AUDIT & COMPLIANCE REPORT */}
      {/* ------------------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800  space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-white rounded-xl ">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg">Backend AI Constituency Audit Report</h4>
              <p className="text-xs text-slate-300 font-medium">Automated risk assessment for {mpRecord.constituency} constituency</p>
            </div>
          </div>
          <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700">
            System Compliance Audit Active
          </span>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-2 leading-relaxed">
          <p className="font-medium text-slate-200">
            <strong>AI Audit Findings:</strong> Financial fund utilization rate for Member of Parliament <strong>{mpRecord.mpName}</strong> is verified at <strong>{mpRecord.utilization}%</strong>. Physical milestone progress across {mpRecord.totalProjects} sanctioned works reflects an average AI risk score of <strong>{mpRecord.averageRiskScore}/100</strong>.
          </p>
          {mpRecord.delayedProjects > 0 ? (
            <p className="text-amber-300 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>System Notice: {mpRecord.delayedProjects} ongoing infrastructure works currently flag execution delay risks. Recommended for nodal officer field inspection.</span>
            </p>
          ) : (
            <p className="text-emerald-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>All sanctioned works in {mpRecord.constituency} are executing according to approved schedule. No critical anomalies detected.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )}

  {/* Selected Project Modal View */}
  {selectedProject && (
    <ProjectDetailsView
      project={selectedProject}
      onClose={handleCloseProject}
    />
  )}
</div>
);
};

export default MPDetailsPage;
