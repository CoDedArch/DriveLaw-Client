// hooks/useAdminAppeals.ts

import { useState, useEffect, useCallback } from 'react';

// Types
interface Officer {
  id: string;
  name: string;
  badge?: string;
  department?: string;
}

interface Driver {
  id: string;
  name: string;
  license: string;
  email?: string;
  phone?: string;
}

interface Offense {
  id: string;
  offenseNumber: string;
  type: string;
  date: string;
  location: string;
  fine: number;
  description: string;
}

interface Appeal {
  id: string;
  appealNumber: string;
  offenseId: string;
  offense: Offense;
  driver: Driver;
  submittedDate: string;
  status: "Under Review" | "Approved" | "Rejected" | "Pending Review";
  assignedTo: Officer;
  priority: "high" | "medium" | "low";
  reason: string;
  evidence: string[];
  reviewNotes?: string;
  reviewDate?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface AppealDetails extends Appeal {
  officerDetails: {
    id: string;
    name: string;
    badge: string;
    department: string;
    email?: string;
    phone?: string;
  };
  offenseDetails: {
    id: string;
    offenseNumber: string;
    type: string;
    date: string;
    location: string;
    fine: number;
    description: string;
    issuingOfficer?: Officer;
  };
  driverDetails: {
    id: string;
    name: string;
    license: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  evidenceDetails?: {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadDate: string;
    url: string;
  }[];
  appealHistory?: {
    id: string;
    action: string;
    performedBy: string;
    performedAt: string;
    notes?: string;
  }[];
}

interface AppealsListResponse {
  appeals: Appeal[];
  totalCount: number;
  pendingReviewCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
}

interface AppealStats {
  totalAppeals: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  rejected: number;
  totalFinesAppealed: number;
  approvedFinesAmount: number;
  rejectedFinesAmount: number;
  averageProcessingTime: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  overdueCount: number;
}

interface AppealUpdateRequest {
  status?: "Under Review" | "Approved" | "Rejected" | "Pending Review";
  priority?: "high" | "medium" | "low";
  assignedTo?: string;
  reviewNotes?: string;
  dueDate?: string;
}

interface AppealReviewRequest {
  decision: "approved" | "rejected";
  reviewNotes: string;
  notifyDriver?: boolean;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Hook for fetching all appeals
export const useAppeals = (
  search?: string,
  status?: string,
  priority?: string,
  assignedTo?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 50,
  offset: number = 0
) => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingReviewCount: 0,
    underReviewCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (status && status !== 'all') params.append('status', status);
      if (priority && priority !== 'all') params.append('priority', priority);
      if (assignedTo && assignedTo !== 'all') params.append('assigned_to', assignedTo);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      console.log('Fetching appeals with params:', params.toString());

      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/admin?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch appeals');
      }

      const data: AppealsListResponse = await response.json();
      
      setAppeals(data.appeals);
      setStats({
        totalCount: data.totalCount,
        pendingReviewCount: data.pendingReviewCount,
        underReviewCount: data.underReviewCount,
        approvedCount: data.approvedCount,
        rejectedCount: data.rejectedCount,
      });
    } catch (err) {
      console.error('Error fetching appeals:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, assignedTo, startDate, endDate, limit, offset]);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  return {
    appeals,
    stats,
    loading,
    error,
    refetch: fetchAppeals,
  };
};

// Hook for fetching single appeal details
export const useAppealDetails = (appealId: string | null) => {
  const [appeal, setAppeal] = useState<AppealDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppealDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/${id}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch appeal details');
      }

      const data: AppealDetails = await response.json();
      setAppeal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appealId) {
      fetchAppealDetails(appealId);
    } else {
      setAppeal(null);
    }
  }, [appealId, fetchAppealDetails]);

  return {
    appeal,
    loading,
    error,
    refetch: () => appealId && fetchAppealDetails(appealId),
  };
};

// Hook for appeal statistics
export const useAppealStats = (
  startDate?: string,
  endDate?: string
) => {
  const [stats, setStats] = useState<AppealStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/stats/overview?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch appeal statistics');
      }

      const data: AppealStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Hook for appeal actions (review, update, assign, etc.)
export const useAppealActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAppeal = async (
    appealId: string,
    updates: AppealUpdateRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/${appealId}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update appeal');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reviewAppeal = async (
    appealId: string,
    reviewData: AppealReviewRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/${appealId}/review`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to review appeal');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const assignAppeal = async (appealId: string, officerId: string, notes?: string) => {
    return updateAppeal(appealId, { 
      assignedTo: officerId,
      status: 'Under Review',
      ...(notes && { reviewNotes: notes })
    });
  };

  const updatePriority = async (appealId: string, priority: "high" | "medium" | "low", reason?: string) => {
    return updateAppeal(appealId, { 
      priority,
      ...(reason && { reviewNotes: reason })
    });
  };

  const approveAppeal = async (appealId: string, reviewNotes: string, notifyDriver: boolean = true) => {
    return reviewAppeal(appealId, {
      decision: 'approved',
      reviewNotes,
      notifyDriver
    });
  };

  const rejectAppeal = async (appealId: string, reviewNotes: string, notifyDriver: boolean = true) => {
    return reviewAppeal(appealId, {
      decision: 'rejected',
      reviewNotes,
      notifyDriver
    });
  };

  const downloadEvidence = async (appealId: string, evidenceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/${appealId}/evidence/${evidenceId}/download`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to download evidence');
      }

      // Handle file download
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'evidence';
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateAppeal,
    reviewAppeal,
    assignAppeal,
    updatePriority,
    approveAppeal,
    rejectAppeal,
    downloadEvidence,
    loading,
    error,
  };
};

// Hook for fetching available officers for assignment
export const useOfficers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/officers`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch officers');
      }

      const data = await response.json();
      setOfficers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  return {
    officers,
    loading,
    error,
    refetch: fetchOfficers,
  };
};

// Hook for exporting appeals data
export const useAppealExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAppeals = async (
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: {
      search?: string;
      status?: string;
      priority?: string;
      assignedTo?: string;
      startDate?: string;
      endDate?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
        if (filters.assignedTo && filters.assignedTo !== 'all') params.append('assigned_to', filters.assignedTo);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/appeals/export?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to export appeals');
      }

      // Handle file download
      const blob = await response.blob();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `appeals_export_${timestamp}.${format}`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    exportAppeals,
    loading,
    error,
  };
};

// Custom hook for managing all appeal-related operations
export const useAdminAppealsManagement = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedAppeal, setSelectedAppeal] = useState<string | null>(null);

  // Use individual hooks
  const appealsQuery = useAppeals(
    searchQuery, 
    statusFilter, 
    priorityFilter, 
    assignedToFilter,
    startDate,
    endDate
  );
  const appealDetailsQuery = useAppealDetails(selectedAppeal);
  const statsQuery = useAppealStats(startDate, endDate);
  const appealActionsMutation = useAppealActions();
  const officersQuery = useOfficers();
  const exportMutation = useAppealExport();

  const refreshAll = useCallback(() => {
    appealsQuery.refetch();
    statsQuery.refetch();
    if (selectedAppeal) {
      appealDetailsQuery.refetch();
    }
  }, [appealsQuery, statsQuery, appealDetailsQuery, selectedAppeal]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssignedToFilter('all');
    setStartDate('');
    setEndDate('');
  }, []);

  return {
    // Search and filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assignedToFilter,
    setAssignedToFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedAppeal,
    setSelectedAppeal,

    // Data queries
    appeals: appealsQuery.appeals,
    appealsLoading: appealsQuery.loading,
    appealsError: appealsQuery.error,
    appealsStats: appealsQuery.stats,

    // Appeal details
    appealDetails: appealDetailsQuery.appeal,
    appealDetailsLoading: appealDetailsQuery.loading,
    appealDetailsError: appealDetailsQuery.error,

    // Overall stats
    overallStats: statsQuery.stats,
    overallStatsLoading: statsQuery.loading,
    overallStatsError: statsQuery.error,

    // Officers for assignment
    officers: officersQuery.officers,
    officersLoading: officersQuery.loading,
    officersError: officersQuery.error,

    // Appeal actions
    updateAppeal: appealActionsMutation.updateAppeal,
    reviewAppeal: appealActionsMutation.reviewAppeal,
    assignAppeal: appealActionsMutation.assignAppeal,
    updatePriority: appealActionsMutation.updatePriority,
    approveAppeal: appealActionsMutation.approveAppeal,
    rejectAppeal: appealActionsMutation.rejectAppeal,
    downloadEvidence: appealActionsMutation.downloadEvidence,
    actionsLoading: appealActionsMutation.loading,
    actionsError: appealActionsMutation.error,

    // Export functionality
    exportAppeals: exportMutation.exportAppeals,
    exportLoading: exportMutation.loading,
    exportError: exportMutation.error,

    // Utility functions
    refreshAll,
    resetFilters,
  };
};