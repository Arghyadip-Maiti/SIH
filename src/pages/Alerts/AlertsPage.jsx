import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const AlertsPage = () => {
  return (
    <div>
      <PageHeader
        title="System & AI Risk Alerts"
        subtitle="Real-time automated notification center for critical risk thresholds, duplicate works, and timeline slippage."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">Alert feed and severity management components will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default AlertsPage;
