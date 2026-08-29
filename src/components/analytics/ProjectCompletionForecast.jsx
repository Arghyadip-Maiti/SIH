import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ProjectCompletionForecast = ({ data }) => {
  if (!data) return null;

  const {
    currentRatePct,
    expectedRatePct,
    predictedCompletedCount,
    expectedCompletedCount,
    shortfallCount,
    isBelowTarget,
    trajectoryData,
    statusMessage,
  } = data;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Project Completion Outlook
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Historical Completion → Current Completion Rate → Predicted Completion Trajectory
            </p>
          </div>
        </div>

        {/* Status Trajectory Indicator */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
          isBelowTarget ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {isBelowTarget ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span className="text-xs font-extrabold">{statusMessage}</span>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Completion Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{currentRatePct}%</div>
          <span className="text-[11px] font-semibold text-slate-500">Active Fiscal Period</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected Target Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{expectedRatePct}%</div>
          <span className="text-[11px] font-semibold text-slate-500">Fiscal Milestone Target</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Predicted Completed Works</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{predictedCompletedCount}</div>
          <span className="text-[11px] font-semibold text-slate-500">End-of-period Projection</span>
        </div>

        <div className={`border p-4 rounded-2xl ${isBelowTarget ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-200'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Expected Shortfall</span>
          <div className={`text-2xl font-black mt-1 ${isBelowTarget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {shortfallCount > 0 ? `-${shortfallCount} Works` : '0 Works'}
          </div>
          <span className="text-[11px] font-semibold text-slate-600">Gap to Target Baseline</span>
        </div>
      </div>

      {/* Completion Trajectory Chart */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Trajectory Comparison: Current Trajectory (↗) vs Expected Trajectory (─)
          </h4>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualTraj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expectedTraj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="actual" name="Current Trajectory" stroke="#0284C7" strokeWidth={3} fill="url(#actualTraj)" />
              <Area type="monotone" dataKey="expected" name="Expected Target Trajectory" stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" fill="url(#expectedTraj)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionForecast;
