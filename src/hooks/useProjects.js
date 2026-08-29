import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectService } from '../services/api/projectService';
import {
  calculateProjectKPIs,
  calculateStatusDistribution,
  calculateRiskDistribution,
  calculateProjectTypeDistribution,
  calculateStatePerformance,
  calculateMPPerformance,
} from '../utils/projectAnalytics';
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP } from '../services/api/locationService';
import { useApp } from '../context/AppContext';

export const useProjects = (initialFilters = {}) => {
  const { dashboardPreferences } = useApp();
  const defaultYear = dashboardPreferences?.financialYear || '2026-27';
  const defaultView = dashboardPreferences?.projectView || 'All Projects';

  const defaultFilters = useMemo(() => {
    let status = '';
    let riskLevel = '';
    if (defaultView === 'Completed') status = 'Completed';
    else if (defaultView === 'Ongoing') status = 'Ongoing';
    else if (defaultView === 'Delayed') status = 'Delayed';
    else if (defaultView === 'High Risk') riskLevel = 'High';

    return {
      financialYear: defaultYear,
      house: 'All',
      state: '',
      district: '',
      constituency: '',
      mp: '',
      projectType: '',
      agency: '',
      contractor: '',
      status,
      riskLevel,
      costRange: '',
      progressRange: '',
      ...initialFilters,
    };
  }, [defaultYear, defaultView, initialFilters]);

  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Sorting State for Master Directory Table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'riskScore', sortOrder: 'desc' });

  // Fetch Master Projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjects();
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load project records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjectById(id);
      setSelectedProject(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter change handler for Top Filter Bar (affects ONLY Upper Sections)
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // State changes
      if (key === 'state') {
        if (value) {
          const validDists = STATE_DISTRICT_MAP[value] || [];
          if (updated.district && !validDists.includes(updated.district)) {
            updated.district = '';
          }
        }
      }

      // District changes
      if (key === 'district') {
        if (value) {
          const parentState = DISTRICT_STATE_MAP[value];
          if (parentState) updated.state = parentState;
        }
      }

      return updated;
    });
  }, []);

  // Isolated Table Search Handler (affects ONLY Projects Master Directory Table)
  const handleTableSearchChange = useCallback((value) => {
    setTableSearch(value);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setTableSearch('');
    setCurrentPage(1);
  }, [defaultFilters]);

  const handleSort = useCallback((sortByField) => {
    setSortConfig((prev) => {
      if (prev.sortBy === sortByField) {
        return { sortBy: sortByField, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' };
      }
      return { sortBy: sortByField, sortOrder: 'desc' };
    });
    setCurrentPage(1);
  }, []);

  // 1. Single Source Filtered Dataset FOR UPPER SECTIONS ONLY (Top Filter Bar)
  const globalFilteredProjects = useMemo(() => {
    let result = Array.isArray(projects) ? [...projects] : [];

    if (filters.state) {
      const s = filters.state.toLowerCase();
      result = result.filter((p) => (p?.state || '').toLowerCase() === s);
    }
    if (filters.district) {
      const d = filters.district.toLowerCase();
      result = result.filter((p) => (p?.district || '').toLowerCase() === d);
    }
    if (filters.constituency) {
      const q = filters.constituency.toLowerCase();
      result = result.filter(
        (p) =>
          (p?.constituencyName || '').toLowerCase().includes(q) ||
          (p?.constituencyId || '').toLowerCase().includes(q) ||
          (p?.district || '').toLowerCase().includes(q)
      );
    }
    if (filters.mp) {
      const q = filters.mp.toLowerCase();
      result = result.filter((p) =>
        (p?.mpName || p?.mp || '').toLowerCase().includes(q)
      );
    }
    if (filters.house && filters.house !== 'All') {
      result = result.filter((p) => p?.house === filters.house);
    }
    if (filters.projectType) {
      const q = filters.projectType.toLowerCase();
      result = result.filter((p) =>
        (p?.projectType || '').toLowerCase().includes(q)
      );
    }
    if (filters.agency) {
      const q = filters.agency.toLowerCase();
      result = result.filter((p) =>
        (p?.implementingAgency || '').toLowerCase().includes(q)
      );
    }
    if (filters.contractor) {
      const q = filters.contractor.toLowerCase();
      result = result.filter((p) =>
        (p?.contractor || '').toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      result = result.filter((p) => p?.status === filters.status);
    }
    if (filters.riskLevel) {
      result = result.filter((p) => p?.riskLevel === filters.riskLevel);
    }
    if (filters.costRange) {
      if (filters.costRange === '<50L') result = result.filter((p) => (p?.sanctionedAmount || 0) < 5000000);
      else if (filters.costRange === '50L-1Cr') result = result.filter((p) => (p?.sanctionedAmount || 0) >= 5000000 && (p?.sanctionedAmount || 0) <= 10000000);
      else if (filters.costRange === '>1Cr') result = result.filter((p) => (p?.sanctionedAmount || 0) > 10000000);
    }
    if (filters.progressRange) {
      if (filters.progressRange === '0-30') result = result.filter((p) => (p?.progress || 0) <= 30);
      else if (filters.progressRange === '30-80') result = result.filter((p) => (p?.progress || 0) > 30 && (p?.progress || 0) <= 80);
      else if (filters.progressRange === '80-99') result = result.filter((p) => (p?.progress || 0) > 80 && (p?.progress || 0) < 100);
      else if (filters.progressRange === '100') result = result.filter((p) => p?.progress === 100);
    }

    return result;
  }, [projects, filters]);

  // 2. Statistics derived from globalFilteredProjects (KPI Cards, Pie Charts, State Ranking) & Master Projects Dataset (MP Performance Overview)
  const statistics = useMemo(() => {
    return {
      kpis: calculateProjectKPIs(globalFilteredProjects),
      statusDistribution: calculateStatusDistribution(globalFilteredProjects),
      riskDistribution: calculateRiskDistribution(globalFilteredProjects),
      projectTypeDistribution: calculateProjectTypeDistribution(globalFilteredProjects),
      statePerformance: calculateStatePerformance(globalFilteredProjects),
      mpPerformance: calculateMPPerformance(projects),
    };
  }, [globalFilteredProjects, projects]);

  // 3. Isolated Projects Master Directory Table Dataset (Independent of top filter bar, filtered ONLY by tableSearch)
  const tableFilteredProjects = useMemo(() => {
    let result = Array.isArray(projects) ? [...projects] : [];
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      result = result.filter(
        (p) =>
          (p?.name || '').toLowerCase().includes(q) ||
          (p?.id || '').toLowerCase().includes(q) ||
          (p?.state || '').toLowerCase().includes(q) ||
          (p?.district || '').toLowerCase().includes(q) ||
          (p?.constituencyName || '').toLowerCase().includes(q) ||
          (p?.mpName || p?.mp || '').toLowerCase().includes(q) ||
          (p?.implementingAgency || '').toLowerCase().includes(q) ||
          (p?.contractor || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, tableSearch]);

  // 4. Sorted table projects
  const sortedFilteredProjects = useMemo(() => {
    const sorted = [...tableFilteredProjects];
    const { sortBy, sortOrder } = sortConfig;

    sorted.sort((a, b) => {
      let valA = a?.[sortBy] ?? '';
      let valB = b?.[sortBy] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [tableFilteredProjects, sortConfig]);

  // 5. Paginated projects slice for Master Directory Table
  const paginatedProjects = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedFilteredProjects.slice(startIdx, startIdx + pageSize);
  }, [sortedFilteredProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedFilteredProjects.length / pageSize) || 1;

  return {
    projects,
    filteredProjects: globalFilteredProjects,
    tableFilteredProjects,
    sortedFilteredProjects,
    paginatedProjects,
    selectedProject,
    setSelectedProject,
    loading,
    error,
    filters,
    tableSearch,
    statistics,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalCount: sortedFilteredProjects.length,
      setPage: setCurrentPage,
      setPageSize,
    },
    sortConfig,
    handleSort,
    handleFilterChange,
    handleTableSearchChange,
    resetFilters,
    fetchProjectById,
    refetch: fetchProjects,
  };
};
