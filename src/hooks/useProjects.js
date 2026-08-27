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
import { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP } from '../services/api/locationService';

const DEFAULT_FILTERS = {
  financialYear: '2026-27',
  state: '',
  district: '',
  constituency: '',
  mp: '',
  projectType: '',
  agency: '',
  contractor: '',
  status: '',
  riskLevel: '',
  costRange: '',
  progressRange: '',
  search: '',
};

export const useProjects = (initialFilters = {}) => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'riskScore', sortOrder: 'desc' });

  // Fetch Master Projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjects();
      setProjects(res.data || []);
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

  // Filter change handler with interdependency sync (State -> District -> MP)
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
          if (updated.mp && MP_LOCATION_MAP[updated.mp]?.state !== value) {
            updated.mp = '';
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

      // MP changes
      if (key === 'mp') {
        if (value && MP_LOCATION_MAP[value]) {
          updated.state = MP_LOCATION_MAP[value].state;
          updated.district = MP_LOCATION_MAP[value].district;
        }
      }

      return updated;
    });
    setCurrentPage(1); // Reset to page 1 on filter change
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((sortByField) => {
    setSortConfig((prev) => {
      if (prev.sortBy === sortByField) {
        return { sortBy: sortByField, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' };
      }
      return { sortBy: sortByField, sortOrder: 'desc' };
    });
    setCurrentPage(1);
  }, []);

  // 1. Single Source Filtered Dataset
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filters.state) {
      result = result.filter((p) => p.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.district) {
      result = result.filter((p) => p.district.toLowerCase() === filters.district.toLowerCase());
    }
    if (filters.constituency) {
      result = result.filter(
        (p) =>
          p.constituencyName.toLowerCase().includes(filters.constituency.toLowerCase()) ||
          p.constituencyId.toLowerCase().includes(filters.constituency.toLowerCase())
      );
    }
    if (filters.mp) {
      result = result.filter((p) => p.mpName.toLowerCase().includes(filters.mp.toLowerCase()));
    }
    if (filters.projectType) {
      result = result.filter((p) =>
        p.projectType.toLowerCase().includes(filters.projectType.toLowerCase())
      );
    }
    if (filters.agency) {
      result = result.filter((p) =>
        p.implementingAgency.toLowerCase().includes(filters.agency.toLowerCase())
      );
    }
    if (filters.contractor) {
      result = result.filter((p) =>
        p.contractor.toLowerCase().includes(filters.contractor.toLowerCase())
      );
    }
    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters.riskLevel) {
      result = result.filter((p) => p.riskLevel === filters.riskLevel);
    }
    if (filters.costRange) {
      if (filters.costRange === '<50L') result = result.filter((p) => p.sanctionedAmount < 5000000);
      else if (filters.costRange === '50L-1Cr') result = result.filter((p) => p.sanctionedAmount >= 5000000 && p.sanctionedAmount <= 10000000);
      else if (filters.costRange === '>1Cr') result = result.filter((p) => p.sanctionedAmount > 10000000);
    }
    if (filters.progressRange) {
      if (filters.progressRange === '0-30') result = result.filter((p) => p.progress <= 30);
      else if (filters.progressRange === '30-80') result = result.filter((p) => p.progress > 30 && p.progress <= 80);
      else if (filters.progressRange === '80-99') result = result.filter((p) => p.progress > 80 && p.progress < 100);
      else if (filters.progressRange === '100') result = result.filter((p) => p.progress === 100);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.constituencyName.toLowerCase().includes(q) ||
          p.mpName.toLowerCase().includes(q) ||
          p.implementingAgency.toLowerCase().includes(q) ||
          p.contractor.toLowerCase().includes(q)
      );
    }

    return result;
  }, [projects, filters]);

  // 2. Single Source Statistics derived from filteredProjects
  const statistics = useMemo(() => {
    return {
      kpis: calculateProjectKPIs(filteredProjects),
      statusDistribution: calculateStatusDistribution(filteredProjects),
      riskDistribution: calculateRiskDistribution(filteredProjects),
      projectTypeDistribution: calculateProjectTypeDistribution(filteredProjects),
      statePerformance: calculateStatePerformance(filteredProjects),
      mpPerformance: calculateMPPerformance(filteredProjects),
    };
  }, [filteredProjects]);

  // 3. Sorted filtered projects
  const sortedFilteredProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    const { sortBy, sortOrder } = sortConfig;

    sorted.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredProjects, sortConfig]);

  // 4. Paginated projects slice
  const paginatedProjects = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedFilteredProjects.slice(startIdx, startIdx + pageSize);
  }, [sortedFilteredProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedFilteredProjects.length / pageSize) || 1;

  return {
    projects,
    filteredProjects,
    sortedFilteredProjects,
    paginatedProjects,
    selectedProject,
    setSelectedProject,
    loading,
    error,
    filters,
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
    resetFilters,
    fetchProjectById,
    refetch: fetchProjects,
  };
};
