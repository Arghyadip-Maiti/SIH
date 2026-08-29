import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { ProjectsSkeletonPreloader } from '../../components/ui/SkeletonPreloader';
import { ErrorState } from '../../components/ui/ErrorState';

import { ProjectHeader } from '../../components/projects/ProjectHeader';
import { ProjectFilterBar } from '../../components/projects/ProjectFilterBar';
import { ProjectKPICards } from '../../components/projects/ProjectKPICards';
import { ProjectStatusSection } from '../../components/projects/ProjectStatusSection';
import { ProjectRiskSummarySection } from '../../components/projects/ProjectRiskSummarySection';
import { ProjectTypeAnalyticsSection } from '../../components/projects/ProjectTypeAnalyticsSection';
import { StateDistrictPerformanceSection } from '../../components/projects/StateDistrictPerformanceSection';
import { ProjectTableSection } from '../../components/projects/ProjectTableSection';
import { MPPerformanceSection } from '../../components/projects/MPPerformanceSection';
import { ProjectDetailsView } from '../../components/projects/ProjectDetailsView';

export const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    paginatedProjects,
    selectedProject,
    setSelectedProject,
    loading,
    error,
    filters,
    tableSearch,
    statistics,
    pagination,
    sortConfig,
    handleSort,
    handleFilterChange,
    handleTableSearchChange,
    resetFilters,
    refetch,
  } = useProjects();

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading && statistics.kpis.totalProjects) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000); // Wait for the fade out transition
      return () => clearTimeout(timer);
    } else if (loading && !statistics.kpis.totalProjects) {
      setShowSkeleton(true);
      setIsFadingOut(false);
    }
  }, [loading, statistics.kpis.totalProjects]);

  // Sync initial query params from URL (e.g., ?state=Maharashtra&district=Pune)
  useEffect(() => {
    const urlState = searchParams.get('state');
    const urlDistrict = searchParams.get('district');
    const urlMP = searchParams.get('mp');
    const urlStatus = searchParams.get('status');
    const urlRisk = searchParams.get('riskLevel');

    if (urlState) handleFilterChange('state', urlState);
    if (urlDistrict) handleFilterChange('district', urlDistrict);
    if (urlMP) handleFilterChange('mp', urlMP);
    if (urlStatus) handleFilterChange('status', urlStatus);
    if (urlRisk) handleFilterChange('riskLevel', urlRisk);
  }, [searchParams, handleFilterChange]);

  // Handle project selection in-place to preserve scroll position and eliminate page refresh/flash
  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    window.history.pushState({ projectModalOpen: true }, '', `#project-${encodeURIComponent(proj.id)}`);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project-')) {
      window.history.back();
    }
  };

  // Close modal on browser Back button without unmounting page or resetting scroll position
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProject, setSelectedProject]);

  if (error && !statistics.kpis.totalProjects) {
    return (
      <ErrorState
        title="Unable to load Project Master Directory"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="relative min-h-full">
      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div 
          className={`absolute inset-0 z-50 transition-opacity duration-1000 bg-white ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ProjectsSkeletonPreloader message="Loading MPLADS Project Master Directory & Analytics..." />
        </div>
      )}

      {/* Real Content */}
      {statistics.kpis.totalProjects > 0 && (
        <div 
          className={`space-y-6 pb-12 transition-opacity duration-1000 ${
            isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* 1. Header */}
          <ProjectHeader
            lastUpdated="27 Aug 2026"
            refreshing={loading}
            onRefresh={refetch}
          />

          {/* 2. Global Project Filters Bar */}
          <ProjectFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          {/* 3. Major KPI Cards (Derived from single source statistics.kpis) */}
          <ProjectKPICards kpis={statistics.kpis} />

          {/* 4. Visualizations: Project Status & Risk Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectStatusSection statusDistribution={statistics.statusDistribution} />
            <ProjectRiskSummarySection riskDistribution={statistics.riskDistribution} />
          </div>

          {/* 5. Sector Analytics & State Performance Ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectTypeAnalyticsSection projectTypeDistribution={statistics.projectTypeDistribution} />
            <StateDistrictPerformanceSection
              statePerformance={statistics.statePerformance}
            />
          </div>

          {/* 6. Projects Master Data Table */}
          <ProjectTableSection
            projects={paginatedProjects}
            pagination={pagination}
            sortConfig={sortConfig}
            tableSearch={tableSearch}
            onSort={handleSort}
            onTableSearchChange={handleTableSearchChange}
            onSelectProject={handleSelectProject}
          />

          {/* 7. Member of Parliament (MP) Performance Section */}
          <MPPerformanceSection mpPerformance={statistics.mpPerformance} />
        </div>
      )}

      {/* 8. Selected Project Details View Modal */}
      {selectedProject && (
        <ProjectDetailsView
          project={selectedProject}
          onClose={handleCloseProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
