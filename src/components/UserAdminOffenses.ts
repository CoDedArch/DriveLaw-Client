// hooks/useAdminOffenses.ts

import { useState, useEffect, useCallback } from 'react';

// Types
interface Officer {
  id: string;
  name: string;
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
  date: string;
  officer: Officer;
  type: string;
  licensePlate: string;
  driver: Driver;
  location: string;
  fine: number;
  status: "Pending Payment" | "Under Appeal" | "Paid" | "Overdue" | "Cancelled";
  description: string;
  evidence: string[];
  dueDate: string;
  severity: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
}

interface OffenseDetails extends Offense {
  officerDetails: {
    id: string;
    name: string;
    badge: string;
    department: string;
  };
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    color: string;
  };
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    method: string;
    reference: string;
  }[];
  appealHistory?: {
    id: string;
    date: string;
    reason: string;
    status: string;
    decision?: string;
  }[];
}

interface OffensesListResponse {
  offenses: Offense[];
  totalCount: number;
  pendingPaymentCount: number;
  underAppealCount: number;
  paidCount: number;
  overdueCount: number;
  cancelledCount: number;
}

interface OffenseStats {
  totalOffenses: number;
  pendingPayment: number;
  underAppeal: number;
  paid: number;
  overdue: number;
  cancelled: number;
  totalFines: number;
  collectedFines: number;
  outstandingFines: number;
  averageFine: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
}

interface OffenseUpdateRequest {
  status?: string;
  fine?: number;
  description?: string;
  dueDate?: string;
  severity?: string;
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Hook for fetching all offenses
export const useOffenses = (
  search?: string,
  status?: string,
  severity?: string,
  offenseType?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 50,
  offset: number = 0
) => {
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingPaymentCount: 0,
    underAppealCount: 0,
    paidCount: 0,
    overdueCount: 0,
    cancelledCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (status && status !== 'all') params.append('status', status);
      if (severity && severity !== 'all') params.append('severity', severity);
      if (offenseType && offenseType !== 'all') params.append('offense_type', offenseType);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      console.log('Fetching offenses with params:', params.toString());

      const response = await fetch(
        `${API_BASE_URL}admin/offenses?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch offenses');
      }

      const data: OffensesListResponse = await response.json();
      
      setOffenses(data.offenses);
      setStats({
        totalCount: data.totalCount,
        pendingPaymentCount: data.pendingPaymentCount,
        underAppealCount: data.underAppealCount,
        paidCount: data.paidCount,
        overdueCount: data.overdueCount,
        cancelledCount: data.cancelledCount,
      });
    } catch (err) {
      console.error('Error fetching offenses:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [search, status, severity, offenseType, startDate, endDate, limit, offset]);

  useEffect(() => {
    fetchOffenses();
  }, [fetchOffenses]);

  return {
    offenses,
    stats,
    loading,
    error,
    refetch: fetchOffenses,
  };
};

// Hook for fetching single offense details
export const useOffenseDetails = (offenseId: string | null) => {
  const [offense, setOffense] = useState<OffenseDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffenseDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}admin/offenses/${id}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch offense details');
      }

      const data: OffenseDetails = await response.json();
      setOffense(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (offenseId) {
      fetchOffenseDetails(offenseId);
    } else {
      setOffense(null);
    }
  }, [offenseId, fetchOffenseDetails]);

  return {
    offense,
    loading,
    error,
    refetch: () => offenseId && fetchOffenseDetails(offenseId),
  };
};

// Hook for offense statistics
export const useOffenseStats = (
  startDate?: string,
  endDate?: string
) => {
  const [stats, setStats] = useState<OffenseStats | null>(null);
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
        `${API_BASE_URL}admin/offenses/stats/overview?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch offense statistics');
      }

      const data: OffenseStats = await response.json();
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

// Hook for offense actions (update status, fine amount, etc.)
export const useOffenseActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOffense = async (
    offenseId: string,
    updates: OffenseUpdateRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}admin/offenses/${offenseId}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update offense');
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

  const markAsPaid = async (offenseId: string, paymentReference?: string) => {
    return updateOffense(offenseId, { 
      status: 'Paid',
      ...(paymentReference && { description: `Payment Reference: ${paymentReference}` })
    });
  };

  const cancelOffense = async (offenseId: string, reason: string) => {
    return updateOffense(offenseId, { 
      status: 'Cancelled',
      description: `Cancelled: ${reason}`
    });
  };

  const updateFineAmount = async (offenseId: string, newAmount: number, reason: string) => {
    return updateOffense(offenseId, { 
      fine: newAmount,
      description: `Fine updated: ${reason}`
    });
  };

  return {
    updateOffense,
    markAsPaid,
    cancelOffense,
    updateFineAmount,
    loading,
    error,
  };
};

// Custom hook for managing all offense-related operations
export const useAdminOffenseManagement = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedOffense, setSelectedOffense] = useState<string | null>(null);

  // Use individual hooks
  const offensesQuery = useOffenses(
    searchQuery, 
    statusFilter, 
    severityFilter, 
    typeFilter,
    startDate,
    endDate
  );
  const offenseDetailsQuery = useOffenseDetails(selectedOffense);
  const statsQuery = useOffenseStats(startDate, endDate);
  const offenseActionsMutation = useOffenseActions();

  const refreshAll = useCallback(() => {
    offensesQuery.refetch();
    statsQuery.refetch();
    if (selectedOffense) {
      offenseDetailsQuery.refetch();
    }
  }, [offensesQuery, statsQuery, offenseDetailsQuery, selectedOffense]);

  return {
    // Search and filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,
    typeFilter,
    setTypeFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedOffense,
    setSelectedOffense,

    // Data queries
    offenses: offensesQuery.offenses,
    offensesLoading: offensesQuery.loading,
    offensesError: offensesQuery.error,
    offensesStats: offensesQuery.stats,

    // Offense details
    offenseDetails: offenseDetailsQuery.offense,
    offenseDetailsLoading: offenseDetailsQuery.loading,
    offenseDetailsError: offenseDetailsQuery.error,

    // Overall stats
    overallStats: statsQuery.stats,
    overallStatsLoading: statsQuery.loading,
    overallStatsError: statsQuery.error,

    // Offense actions
    updateOffense: offenseActionsMutation.updateOffense,
    markAsPaid: offenseActionsMutation.markAsPaid,
    cancelOffense: offenseActionsMutation.cancelOffense,
    updateFineAmount: offenseActionsMutation.updateFineAmount,
    actionsLoading: offenseActionsMutation.loading,
    actionsError: offenseActionsMutation.error,

    // Utility functions
    refreshAll,
  };
};