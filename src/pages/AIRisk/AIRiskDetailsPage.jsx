import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const AIRiskDetailsPage = () => {
  const { projectId } = useParams();

  return (
    <div>
      <PageHeader
        title={`AI Risk Diagnostics: ${projectId || 'N/A'}`}
        subtitle="Explainable AI (XAI) breakdown of risk factors, computer vision photo anomalies, and predicted delay days."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">AI Risk Explainability (XAI) diagnostics for {projectId} will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default AIRiskDetailsPage;
