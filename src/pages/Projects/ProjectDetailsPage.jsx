import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProjectDetailsView } from '../../components/projects/ProjectDetailsView';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProject, loading, error, fetchProjectById } = useProjects();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (projectId) {
      const decodedId = decodeURIComponent(projectId);
      fetchProjectById(decodedId);
    }
  }, [projectId, fetchProjectById]);

  const handleClose = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  if (loading && !selectedProject) {
    return <LoadingState message={`Loading details for Project ${projectId}...`} />;
  }

  if (error || !selectedProject) {
    return (
      <ErrorState
        title="Project Not Found"
        message={error || `Could not find project record for ID "${projectId}".`}
        onRetry={handleClose}
      />
    );
  }

  return (
    <ProjectDetailsView
      project={selectedProject}
      onClose={handleClose}
    />
  );
};

export default ProjectDetailsPage;
