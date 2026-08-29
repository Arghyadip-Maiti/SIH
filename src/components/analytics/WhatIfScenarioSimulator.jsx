import { useState } from 'react';
import { Sliders, Sparkles, RefreshCw, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';

export const WhatIfScenarioSimulator = ({
  simulationData,
  scenarioParams = { monitoringIncrease: 10, expenditureEfficiency: 5 },
  onParamsChange,
}) => {
  const [monitoring, setMonitoring] = useState(scenarioParams.monitoringIncrease || 10);
  const [efficiency, setEfficiency] = useState(scenarioParams.expenditureEfficiency || 5);

  const handleMonitoringSlider = (val) => {
    setMonitoring(val);
    if (onParamsChange) {
      onParamsChange({ monitoringIncrease: val, expenditureEfficiency: efficiency });
    }
  };

  const handleEfficiencySlider = (val) => {
    setEfficiency(val);
    if (onParamsChange) {
      onParamsChange({ monitoringIncrease: monitoring, expenditureEfficiency: val });
    }
  };

  const handleResetSimulator = () => {
    setMonitoring(10);
    setEfficiency(5);
    if (onParamsChange) {
      onParamsChange({ monitoringIncrease: 10, expenditureEfficiency: 5 });
    }
  };

  if (!simulationData) return null;

  const { baseline, simulated, improvements } = simulationData;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              What-If Administrative Scenario Simulator
            </h3>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              Simulate policy intervention parameters to calculate real-time impact on project completion, delay reduction, and utilization
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSimulator}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Slider 1: Monitoring Frequency */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Increase Monitoring Frequency
            </label>
            <span className="text-sm font-black text-indigo-400">+{monitoring}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={monitoring}
            onChange={(e) => handleMonitoringSlider(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-[11px] font-semibold text-slate-400 mt-2 block">
            Deploying extra technical inspection teams & bi-weekly physical audits
          </span>
        </div>

        {/* Slider 2: Expenditure Efficiency */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Increase Expenditure Efficiency
            </label>
            <span className="text-sm font-black text-emerald-400">+{efficiency}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={efficiency}
            onChange={(e) => handleEfficiencySlider(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[11px] font-semibold text-slate-400 mt-2 block">
            Streamlining vendor invoice clearance & direct fund release workflows
          </span>
        </div>
      </div>

      {/* Recalculated Projected Impact Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Completion */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Completion Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-400 line-through">{baseline?.completionRatePct}%</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
            <span className="text-2xl font-black text-indigo-300">{simulated?.completionRatePct}%</span>
          </div>
          <span className="text-xs font-bold text-indigo-400 mt-2 block">
            +{improvements?.compGainPct}% Net Completion Increase
          </span>
        </div>

        {/* Metric 2: Delay Reduction */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Average Delay</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-400 line-through">{baseline?.delayDays} Days</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-black text-emerald-300">{simulated?.delayDays} Days</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-2 block">
            -{improvements?.delayReductionDays} Days Average Schedule Reduction
          </span>
        </div>

        {/* Metric 3: Utilization Improvement */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Fund Utilization</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-400 line-through">{baseline?.utilizationPct}%</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-black text-blue-300">{simulated?.utilizationPct}%</span>
          </div>
          <span className="text-xs font-bold text-blue-400 mt-2 block">
            +{improvements?.utilGainPct}% Utilization Gain
          </span>
        </div>
      </div>
    </div>
  );
};

export default WhatIfScenarioSimulator;
