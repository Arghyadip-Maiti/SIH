import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const AnalyticsPage = () => {
  return (
    <div>
      <PageHeader
        title="Analytics & Comparative Trends"
        subtitle="Sectoral distribution, state-wise performance heatmaps, financial disbursement trends, and agency performance analytics."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">Recharts analytics graphs and map visualization tools will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
