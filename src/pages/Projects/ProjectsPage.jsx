import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const ProjectsPage = () => {
  return (
    <div>
      <PageHeader
        title="MPLADS Projects Directory"
        subtitle="Search, filter, and monitor sanctioned works, financial expenditure, physical progress, and status across all constituencies."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">Projects directory components & filter views will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default ProjectsPage;
