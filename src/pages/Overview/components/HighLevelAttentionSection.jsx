import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { AlertTriangle, Clock, Copy, AlertCircle, Building2, Sparkles } from 'lucide-react';

export const HighLevelAttentionSection = ({
  highLevelAttention = [],
  aiInsights = [],
}) => {
  const navigate = useNavigate();

  const getAlertIcon = (iconName) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'Copy':
        return <Copy className="w-4 h-4 text-amber-600" />;
      case 'AlertCircle':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Building2 className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. High Level Attention Items */}
      <Card header={<h3 className="text-base font-bold text-slate-900">High Level Attention Required</h3>}>
        <div className="space-y-2.5 text-xs">
          {highLevelAttention.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/ai-risk')}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors cursor-pointer"
            >
              <div className="p-1.5 rounded-md bg-white border border-slate-200 shrink-0">
                {getAlertIcon(item.icon)}
              </div>
              <div className="flex-1 text-slate-700 font-medium">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold mr-2 border ${getBadgeStyle(item.type)}`}>
                  {item.count}
                </span>
                <span>{item.message}</span>
              </div>
              <span className="text-blue-600 font-semibold text-[11px] shrink-0">Review →</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. AI Insights Card */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">AI-Generated Overview Insights</h3>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          {aiInsights.map((ins) => (
            <div key={ins.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{ins.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{ins.timestamp}</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{ins.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
