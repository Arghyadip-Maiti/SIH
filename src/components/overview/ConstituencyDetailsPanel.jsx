import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Percent,
  User,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { MASTER_MP_RECORDS } from '../../utils/projectAnalytics';
import { mockProjects } from '../../data/mockProjects';

const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
];

const getMPAvatar = (mpName = '') => {
  const isFemale = mpName.startsWith('Smt.') || mpName.startsWith('Ms.');
  const list = isFemale ? FEMALE_AVATARS : MALE_AVATARS;
  let hash = 0;
  for (let i = 0; i < mpName.length; i++) {
    hash = mpName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return list[Math.abs(hash) % list.length];
};

const normalizeState = (name = '') => {
  let s = String(name || '').toLowerCase().trim();
  if (s === 'orissa' || s === 'odisha') return 'odisha';
  if (s === 'uttaranchal' || s === 'uttarakhand') return 'uttarakhand';
  if (s.includes('jammu')) return 'jammu & kashmir';
  if (s.includes('delhi')) return 'delhi';
  if (s.includes('pondicherry') || s.includes('puducherry')) return 'puducherry';
  if (s.includes('andaman')) return 'andaman & nicobar';
  return s;
};

const normalizeName = (str = '') => {
  return String(str || '')
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // remove (SC), (ST), etc.
    .replace(/[^a-z0-9]/g, '')     // remove non-alphanumeric
    .trim();
};

// Fund Utilization: High is good (Green), Low is bad (Red)
const getUtilizationBarColor = (val) => {
  const num = Number(val || 0);
  if (num >= 70) return 'bg-emerald-500'; // 70-100% -> Green (Good utilization)
  if (num >= 50) return 'bg-amber-500';   // 50-69% -> Yellow / Amber (Moderate)
  if (num >= 35) return 'bg-orange-500';  // 35-49% -> Orange (Low)
  return 'bg-rose-500';                   // < 35% -> Red (Critical low)
};

// AI Risk Score: Low is good (Green), High is bad (Red)
const getRiskBarColor = (val) => {
  const num = Number(val || 0);
  if (num <= 30) return 'bg-emerald-500'; // 0-30 -> Green (Low Risk)
  if (num <= 60) return 'bg-amber-500';   // 31-60 -> Yellow / Amber (Medium Risk)
  if (num <= 80) return 'bg-orange-500';  // 61-80 -> Orange (High Risk)
  return 'bg-rose-500';                   // > 80 -> Red (Critical Risk)
};

// Helper: find the MP record for a constituency (STRICTLY LOK SABHA)
const findMPForConstituency = (constituencyName, stateName) => {
  if (!constituencyName) return null;
  const cNorm = normalizeName(constituencyName);
  const sNorm = normalizeState(stateName);

  // STRICTLY filter for Lok Sabha MPs only
  const lokSabhaMPs = MASTER_MP_RECORDS.filter(
    (mp) => (mp.house || '').toLowerCase() === 'lok sabha'
  );

  // 1. Exact normalized constituency match in the same state
  let found = lokSabhaMPs.find((mp) => {
    const mpC = normalizeName(mp.constituency);
    const mpS = normalizeState(mp.state);
    const stateMatches = !sNorm || mpS === sNorm;
    return stateMatches && mpC === cNorm;
  });

  // 2. Prefix / substring match within the same state (e.g. Khadoor Sahib vs Khadur Sahib)
  if (!found) {
    found = lokSabhaMPs.find((mp) => {
      const mpC = normalizeName(mp.constituency);
      const mpS = normalizeState(mp.state);
      const stateMatches = !sNorm || mpS === sNorm;
      return (
        stateMatches &&
        (mpC.includes(cNorm) ||
          cNorm.includes(mpC) ||
          (mpC.length >= 4 && cNorm.length >= 4 && mpC.slice(0, 4) === cNorm.slice(0, 4)))
      );
    });
  }

  // 3. Fallback across all states if state was not provided
  if (!found && !sNorm) {
    found = lokSabhaMPs.find((mp) => {
      const mpC = normalizeName(mp.constituency);
      return mpC === cNorm || mpC.includes(cNorm) || cNorm.includes(mpC);
    });
  }

  return found || null;
};

// Helper: retrieve project names undertaken by the MP
const getMPProjectNames = (mpRecord) => {
  if (!mpRecord) return [];
  const targetId = mpRecord.mpId;
  const targetName = (mpRecord.mpName || '').toLowerCase().trim();
  const targetConst = (mpRecord.constituency || '').toLowerCase().trim();

  const matched = mockProjects.filter(
    (p) =>
      p.mpId === targetId ||
      (p.mpName || '').toLowerCase().trim() === targetName ||
      (p.constituencyName || '').toLowerCase().trim() === targetConst
  );

  if (matched.length > 0) {
    return matched.map((p) => p.name || p.projectName);
  }

  // Canonical fallback project names for the constituency
  const c = mpRecord.constituency;
  return [
    `Solar Street Lighting & Infrastructure - ${c} Ward 4`,
    `Drinking Water Pipeline & RO Plant - ${c} Sector 2`,
    `Community Health Center Upgrade - ${c} Block 1`,
    `Government High School Smart Classrooms - ${c}`,
    `Rural Link Road & Drainage Construction - ${c} South`,
  ];
};

export const ConstituencyDetailsPanel = ({ selectedConstituency, viewMode }) => {
  const navigate = useNavigate();

  // Look up the MP for this constituency when in lok sabha mode
  const mpRecord = useMemo(() => {
    if (viewMode !== 'loksabha' || !selectedConstituency) return null;
    return findMPForConstituency(selectedConstituency.constituencyName, selectedConstituency.state);
  }, [viewMode, selectedConstituency]);

  const mpAvatarUrl = useMemo(() => {
    if (!mpRecord) return MALE_AVATARS[0];
    return getMPAvatar(mpRecord.mpName);
  }, [mpRecord]);

  const mpEmail = mpRecord
    ? `${mpRecord.mpName.toLowerCase().replace(/[^a-z]/g, '')}@sansad.nic.in`
    : null;

  const projectNames = useMemo(() => {
    if (viewMode !== 'loksabha' || !mpRecord) return [];
    return getMPProjectNames(mpRecord);
  }, [viewMode, mpRecord]);

  if (!selectedConstituency) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-500 min-h-[580px] flex flex-col items-center justify-center animate-fadeIn">
        <h4 className="text-base font-bold text-slate-800">
          {viewMode === 'loksabha' ? 'No Lok Sabha Constituency Selected' : 'No Constituency Selected'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          {viewMode === 'loksabha'
            ? 'Click any Lok Sabha constituency on the map to inspect Member of Parliament profile and performance metrics.'
            : 'Click any state or district on the map to inspect complete financial, project status, risk, and performance metrics.'}
        </p>
      </div>
    );
  }

  const d = selectedConstituency;

  // ── LOK SABHA VIEW: CENTERED PORTRAIT PHOTO + DETAILS + TWO BARS + SANCTIONED WORKS FULL SPACE ──
  if (viewMode === 'loksabha') {
    if (!mpRecord) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-500 min-h-[580px] flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
            <User className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800 capitalize">
            {d.constituencyName.toLowerCase()}
          </h4>
          <p className="text-xs font-semibold text-slate-400 capitalize mt-0.5">
            {d.state.toLowerCase()}
          </p>
          <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
            No Lok Sabha Member of Parliament profile is currently linked to this constituency.
          </p>
        </div>
      );
    }

    const utilization = mpRecord.utilization ?? d.utilization ?? 75;
    const riskScore = mpRecord.averageRiskScore ?? d.averageRiskScore ?? 25;

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 min-h-[580px] h-[580px] flex flex-col animate-fadeIn">
        {/* TOP SECTION: CENTERED PORTRAIT AVATAR + DETAILS BENEATH IT */}
        <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
          {/* Portrait Window Profile Picture (matching Projects section card) */}
          <div className="relative w-20 h-28 rounded-[18px] overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 shrink-0">
            <img
              src={mpAvatarUrl}
              alt={mpRecord.mpName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* MP Name + Clickable Redirection Icon beside it */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
              {mpRecord.mpName}
            </h3>
            <button
              onClick={() => navigate(`/mp/${encodeURIComponent(mpRecord.mpId)}`)}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={`View ${mpRecord.mpName}'s Profile`}
              aria-label={`View ${mpRecord.mpName}'s Profile`}
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Constituency, State, House & MP ID (NO BOXES) */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-slate-500">
              {mpRecord.constituency}, {mpRecord.state} • {mpRecord.house}
            </p>
            <p className="font-mono text-xs font-bold text-slate-600">
              MP ID: {mpRecord.mpId}
            </p>
          </div>

          {/* Official Email */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{mpEmail}</span>
          </div>
        </div>

        {/* TWO METRIC PROGRESS BARS */}
        <div className="space-y-2.5 pt-3 shrink-0">
          {/* Bar 1: Fund Utilization */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Fund Utilization</span>
              <span className="font-mono text-slate-900 text-xs font-extrabold">
                {utilization}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getUtilizationBarColor(utilization)}`}
                style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
              />
            </div>
          </div>

          {/* Bar 2: AI Risk Score */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">AI Risk Score</span>
              <span className="font-mono text-slate-900 text-xs font-extrabold">
                {riskScore} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getRiskBarColor(riskScore)}`}
                style={{ width: `${Math.min(100, Math.max(0, riskScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* UNDERTAKEN / SANCTIONED WORKS LIST (EXPANDED TO FULLY UTILIZE REMAINING SPACE) */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Sanctioned Works ({projectNames.length})
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 pr-1.5 scrollbar-thin">
            {projectNames.map((pName, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-800 flex items-center gap-2.5 border border-slate-200/70 transition-colors shadow-2xs shrink-0"
                title={pName}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="truncate">{pName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STANDARD REGION DETAILS VIEW (FOR STATE & DISTRICT VIEWS) ──
  const formatCr = (amount) => `₹${(amount / 10000000).toFixed(1)} Cr`;
  const unutilized = Math.max(0, d.sanctionedAmount - d.expenditure);

  const getRiskBadge = (score) => {
    if (score <= 30) {
      return { label: 'LOW RISK', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
    if (score <= 60) {
      return { label: 'MEDIUM RISK', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    }
    if (score <= 80) {
      return { label: 'HIGH RISK', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
    }
    return { label: 'CRITICAL RISK', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  };

  const riskBadge = getRiskBadge(d.averageRiskScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 h-[580px] overflow-y-auto space-y-5 animate-fadeIn">
      {/* 1. BASIC INFORMATION SECTION */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mb-1.5 inline-block">
          Region Details
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize leading-none">
          {d.constituencyName.toLowerCase()}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mt-1 capitalize">
          {d.state.toLowerCase()}
        </p>
      </div>

      {/* 2. FINANCIAL SECTION */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
          <span>Financial</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-700 uppercase block">Sanctioned</span>
            <span className="text-base font-mono font-extrabold text-slate-950">{formatCr(d.sanctionedAmount)}</span>
          </div>

          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[10px] font-semibold text-emerald-600 uppercase block">Spent</span>
            <span className="text-base font-mono font-extrabold text-emerald-950">{formatCr(d.expenditure)}</span>
          </div>

          <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <span className="text-[10px] font-semibold text-amber-600 uppercase block">Unutilized</span>
            <span className="text-base font-mono font-extrabold text-amber-950">{formatCr(unutilized)}</span>
          </div>

          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-700 uppercase block">Utilization</span>
            <span className="text-base font-mono font-extrabold text-indigo-950">{d.utilization}%</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span>Utilization Progress</span>
            <span className="font-mono text-slate-700 font-extrabold">{d.utilization}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-800 transition-all duration-500"
              style={{ width: `${Math.min(100, d.utilization)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. PROJECTS SECTION */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-700" />
          <span>Projects ({d.totalProjects} Total)</span>
        </h4>

        <div className="w-full bg-slate-200 rounded-full h-3 flex overflow-hidden p-0.5">
          <div
            style={{ width: `${(d.completedProjects / d.totalProjects) * 100}%` }}
            className="bg-emerald-500 h-full rounded-l-full"
            title={`Completed: ${d.completedProjects}`}
          />
          <div
            style={{ width: `${(d.nearCompletionProjects / d.totalProjects) * 100}%` }}
            className="bg-amber-400 h-full"
            title={`Near Completion: ${d.nearCompletionProjects}`}
          />
          <div
            style={{ width: `${(d.ongoingProjects / d.totalProjects) * 100}%` }}
            className="bg-slate-700 h-full"
            title={`Ongoing: ${d.ongoingProjects}`}
          />
          <div
            style={{ width: `${(d.startingProjects / d.totalProjects) * 100}%` }}
            className="bg-slate-400 h-full"
            title={`Starting: ${d.startingProjects}`}
          />
          <div
            style={{ width: `${(d.delayedProjects / d.totalProjects) * 100}%` }}
            className="bg-rose-500 h-full rounded-r-full"
            title={`Delayed: ${d.delayedProjects}`}
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="p-1.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-emerald-700 block">Completed</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.completedProjects}</span>
          </div>
          <div className="p-1.5 bg-amber-50/70 border border-amber-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-amber-700 block">Near Comp.</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.nearCompletionProjects}</span>
          </div>
          <div className="p-1.5 bg-slate-100/70 border border-slate-300/60 rounded-lg">
            <span className="text-[10px] font-bold text-slate-800 block">Ongoing</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.ongoingProjects}</span>
          </div>
          <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-lg">
            <span className="text-[10px] font-bold text-slate-600 block">Starting</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{d.startingProjects}</span>
          </div>
          <div className="p-1.5 bg-rose-50/70 border border-rose-200/60 rounded-lg col-span-2">
            <span className="text-[10px] font-bold text-rose-700 block">Delayed</span>
            <span className="font-mono font-extrabold text-rose-900 text-sm">{d.delayedProjects}</span>
          </div>
        </div>
      </div>

      {/* 4. RISK SECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Risk Overview</span>
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${riskBadge.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
            {riskBadge.label}
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Average Risk Score</span>
          <span className="text-base font-mono font-extrabold text-slate-900">
            {d.averageRiskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
          <div className="p-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-semibold">
            <span className="block font-bold">Critical</span>
            <span className="font-mono text-sm font-extrabold">{d.criticalProjects}</span>
          </div>
          <div className="p-1.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg font-semibold">
            <span className="block font-bold">High</span>
            <span className="font-mono text-sm font-extrabold">{d.highRiskProjects}</span>
          </div>
          <div className="p-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold">
            <span className="block font-bold">Medium</span>
            <span className="font-mono text-sm font-extrabold">{d.mediumRiskProjects}</span>
          </div>
          <div className="p-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
            <span className="block font-bold">Low</span>
            <span className="font-mono text-sm font-extrabold">{d.lowRiskProjects}</span>
          </div>
        </div>
      </div>

      {/* 5. PERFORMANCE SECTION */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-slate-700" />
          <span>Performance Indicators</span>
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">Completion</span>
            <span className="font-mono font-extrabold text-slate-900">{d.completionRate}%</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">On-Time</span>
            <span className="font-mono font-extrabold text-slate-900">{d.onTimeCompletion}%</span>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-[10px] text-slate-500 font-semibold block">Avg Delay</span>
            <span className="font-mono font-extrabold text-slate-900">{d.averageDelay} d</span>
          </div>
        </div>
      </div>
    </div>
  );
};
