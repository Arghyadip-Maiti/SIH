import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const AIRiskPage = () => {
  return (
    <div>
      <PageHeader
        title="AI Risk Monitor & Anomaly Detection"
        subtitle="Machine learning anomaly detection, predictive risk scores, timeline overrun probabilities, and financial mismatch alerts."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">AI Risk Monitor scoring table & ML predictions matrix will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default AIRiskPage;
