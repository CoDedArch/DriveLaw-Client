// hooks/useAdminDrivers.ts

import { useState, useEffect, useCallback } from 'react';

// Types
interface DriverVehicle {
  make: string;
  model: string;
  year: number;
  plate: string;
}

interface Driver {
  id: string;
  name: string;
  license: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "Active" | "Suspended" | "Pending Verification";
  totalOffenses: number;
  totalFines: number;
  paidFines: number;
  outstandingFines: number;
  licenseExpiry: string;
  vehicle?: DriverVehicle;
}

interface DriverOffense {
  id: string;
  type: string;
  date: string;
  fine: number;
  status: "Paid" | "Unpaid" | "Under Appeal";
}

interface DriverDetails extends Driver {
  offenses: DriverOffense[];
}

interface DriversListResponse {
  drivers: Driver[];
  totalCount: number;
  activeCount: number;
  suspendedCount: number;
  pendingCount: number;
}

interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  suspendedDrivers: number;
  pendingDrivers: number;
  totalOffenses: number;
  totalFines: number;
  paidFines: number;
  outstandingFines: number;
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

// Hook for fetching all drivers with proper dependency management
export const useDrivers = (
  search?: string,
  status?: string,
  limit: number = 50,
  offset: number = 0
) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    activeCount: 0,
    suspendedCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (status && status !== 'all') params.append('status', status);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      console.log('Fetching drivers with params:', params.toString()); // Debug log

      const response = await fetch(
        `${API_BASE_URL}/admin/drivers?${params}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch drivers');
      }

      const data: DriversListResponse = await response.json();
      
      setDrivers(data.drivers);
      setStats({
        totalCount: data.totalCount,
        activeCount: data.activeCount,
        suspendedCount: data.suspendedCount,
        pendingCount: data.pendingCount,
      });
    } catch (err) {
      console.error('Error fetching drivers:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [search, status, limit, offset]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    stats,
    loading,
    error,
    refetch: fetchDrivers,
  };
};

// Hook for fetching single driver details
export const useDriverDetails = (driverId: string | null) => {
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/drivers/${id}`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch driver details');
      }

      const data: DriverDetails = await response.json();
      setDriver(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails(driverId);
    } else {
      setDriver(null);
    }
  }, [driverId, fetchDriverDetails]);

  return {
    driver,
    loading,
    error,
    refetch: () => driverId && fetchDriverDetails(driverId),
  };
};

// Hook for driver statistics
export const useDriverStats = () => {
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/drivers/stats/overview`,
        {
          headers: getAuthHeaders(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch driver statistics');
      }

      const data: DriverStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

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

// Hook for license actions
export const useLicenseAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLicenseAction = async (
    driverId: string,
    action: 'suspend' | 'reinstate' | 'verify',
    reason: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/drivers/${driverId}/license-action`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ action, reason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to perform license action');
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

  return {
    performLicenseAction,
    loading,
    error,
  };
};

// Custom hook for managing all driver-related operations
export const useAdminDriverManagement = () => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Use individual hooks
  const driversQuery = useDrivers(searchQuery, statusFilter);
  const driverDetailsQuery = useDriverDetails(selectedDriver);
  const statsQuery = useDriverStats();
  const licenseActionMutation = useLicenseAction();

  const refreshAll = useCallback(() => {
    driversQuery.refetch();
    statsQuery.refetch();
    if (selectedDriver) {
      driverDetailsQuery.refetch();
    }
  }, [driversQuery, statsQuery, driverDetailsQuery, selectedDriver]);

  return {
    // Search and filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedDriver,
    setSelectedDriver,

    // Data queries
    drivers: driversQuery.drivers,
    driversLoading: driversQuery.loading,
    driversError: driversQuery.error,
    driversStats: driversQuery.stats,

    // Driver details
    driverDetails: driverDetailsQuery.driver,
    driverDetailsLoading: driverDetailsQuery.loading,
    driverDetailsError: driverDetailsQuery.error,

    // Overall stats
    overallStats: statsQuery.stats,
    overallStatsLoading: statsQuery.loading,
    overallStatsError: statsQuery.error,

    // License actions
    performLicenseAction: licenseActionMutation.performLicenseAction,
    licenseActionLoading: licenseActionMutation.loading,
    licenseActionError: licenseActionMutation.error,

    // Utility functions
    refreshAll,
  };
};