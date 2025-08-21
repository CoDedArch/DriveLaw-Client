import { useState, useEffect, useCallback } from 'react';

// Types for dashboard statistics
interface DashboardStats {
  totalUsers: number;
  monthlyOffenses: number;
  finesCollected: number;
  pendingAppeals: number;
  activeOfficers: number;
  systemHealth: string;
  databaseUsage: string;
  serverLoad: string;
  activeSessions: number;
}

interface DashboardChanges {
  totalUsers: number;
  monthlyOffenses: number;
  finesCollected: number;
  pendingAppeals: number;
}

interface DashboardStatsResponse {
  stats: DashboardStats;
  changes: DashboardChanges;
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function for auth headers (adjust based on your auth implementation)
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  // Add your auth token here, e.g.:
  // 'Authorization': `Bearer ${getToken()}`,
});

// Hook for fetching dashboard statistics
export const useDashboardStats = (refreshInterval = 5 * 60 * 1000) => { // 5 minutes default
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [changes, setChanges] = useState<DashboardChanges | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}admin/dashboard/stats`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch dashboard statistics');
      }

      const data: DashboardStatsResponse = await response.json();
      setStats(data.stats);
      setChanges(data.changes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchDashboardStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDashboardStats, refreshInterval]);

  return {
    stats,
    changes,
    loading,
    error,
    refetch: fetchDashboardStats,
  };
};

// Export types for use in components
export type { DashboardStats, DashboardChanges, DashboardStatsResponse };