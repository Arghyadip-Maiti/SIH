import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  return (
    <div>
      <PageHeader
        title={`Project Details: ${projectId || 'N/A'}`}
        subtitle="Detailed breakdown of project progress, financial disbursements, geotagged evidence, and implementing agency information."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">Detailed project breakdown components for {projectId} will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default ProjectDetailsPage;
