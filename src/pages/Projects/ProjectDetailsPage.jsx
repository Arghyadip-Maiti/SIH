import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProjectDetailsView } from '../../components/projects/ProjectDetailsView';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject, loading, error, fetchProjectById } = useProjects();

  useEffect(() => {
    if (projectId) {
      const decodedId = decodeURIComponent(projectId);
      fetchProjectById(decodedId);
    }
  }, [projectId, fetchProjectById]);

  if (loading && !selectedProject) {
    return <LoadingState message={`Loading details for Project ${projectId}...`} />;
  }

  if (error || !selectedProject) {
    return (
      <ErrorState
        title="Project Not Found"
        message={error || `Could not find project record for ID "${projectId}".`}
        onRetry={() => navigate('/projects')}
      />
    );
  }

  return (
    <ProjectDetailsView
      project={selectedProject}
      onClose={() => navigate('/projects')}
    />
  );
};

export default ProjectDetailsPage;
