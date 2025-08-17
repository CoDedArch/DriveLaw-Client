// hooks/useDriverApi.ts
import { useState, useEffect, useCallback } from "react";

// Types matching your Pydantic models
export interface Offense {
  id: string;
  date: string;
  time: string;
  type: string;
  location: string;
  fine: number;
  status: string;
  description: string;
  evidence: string;
  dueDate: string;
  severity: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  offenseId: string;
  method: string;
  location?: string;
}

export interface Appeal {
  id: string;
  offenseId: string;
  offenseType: string;
  location: string;
  submissionDate: string;
  status: string;
  reason: string;
  description: string;
  responseDate?: string;
  reviewerNotes?: string;
}

export interface DriverData {
  name: string;
  license: string;
  totalOffenses: number;
  totalFines: number;
  pendingAppeals: number;
  drivingScore: number;
}

export interface DashboardResponse {
  driverData: DriverData;
  recentOffenses: Offense[];
  pendingAmount: number;
}

export interface PaymentSummary {
  outstandingAmount: number;
  outstandingCount: number;
  thisMonthAmount: number;
  thisMonthCount: number;
  totalPaidAmount: number;
  totalPaidCount: number;
}

// Base API configuration
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}driver`;

// Generic fetch with credentials
const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle authentication error
      window.location.href = "/login";
      throw new Error("Authentication required");
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Dashboard Hook
export const useDashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchWithCredentials(`${API_BASE}/dashboard`);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};

// Offenses Hook
export const useOffenses = (filters?: {
  status?: string;
  offense_type?: string;
}) => {
  const [offenses, setOffenses] = useState<Offense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.offense_type)
        params.append("offense_type", filters.offense_type);

      const url = `${API_BASE}/offenses${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const result = await fetchWithCredentials(url);
      setOffenses(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOffenses();
  }, [fetchOffenses]);

  return { offenses, loading, error, refetch: fetchOffenses };
};

// Single Offense Hook
export const useOffense = (offenseId: string | null) => {
  const [offense, setOffense] = useState<Offense | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffense = useCallback(async () => {
    if (!offenseId) return;

    try {
      setLoading(true);
      const result = await fetchWithCredentials(
        `${API_BASE}/offenses/${offenseId}`
      );
      setOffense(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [offenseId]);

  useEffect(() => {
    fetchOffense();
  }, [fetchOffense]);

  return { offense, loading, error, refetch: fetchOffense };
};

// Payments Hook
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchWithCredentials(`${API_BASE}/payments`);
      setPayments(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
};

// Payment Summary Hook
export const usePaymentSummary = () => {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchWithCredentials(`${API_BASE}/payment-summary`);
      setSummary(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};

// Appeals Hook
export const useAppeals = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await fetchWithCredentials(`${API_BASE}/appeals`);
      setAppeals(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []); // Remove fetchAppeals from dependency array

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  return { appeals, loading, error, refetch: fetchAppeals };
};
// Generic mutation hook for POST/PUT operations
export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      endpoint: string,
      data?: any,
      method: "POST" | "PUT" | "DELETE" = "POST"
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithCredentials(endpoint, {
          method,
          ...(data && { body: JSON.stringify(data) }),
        });

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
};

// Custom hooks for specific actions
export const useSubmitAppeal = () => {
  const { mutate, loading, error } = useApiMutation();

  const submitAppeal = useCallback(
    async (appealData: {
      offenseId: string;
      reason: string;
      description: string;
      evidence?: File;
    }) => {
      // For file upload, you might need to use FormData
      const formData = new FormData();
      formData.append("offenseId", appealData.offenseId);
      formData.append("reason", appealData.reason);
      formData.append("description", appealData.description);
      if (appealData.evidence) {
        formData.append("evidence", appealData.evidence);
      }

      return mutate("/api/driver/appeals", formData, "POST");
    },
    [mutate]
  );

  return { submitAppeal, loading, error };
};

export const useProcessPayment = () => {
  const { mutate, loading, error } = useApiMutation();

  const processPayment = useCallback(
    async (paymentData: {
      offenseIds: string[];
      amount: number;
      method: string;
      cardDetails?: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        nameOnCard: string;
      };
    }) => {
      return mutate("/api/driver/payments", paymentData, "POST");
    },
    [mutate]
  );

  return { processPayment, loading, error };
};

// Combined hook for components that need multiple data sources
export const useDriverDashboardData = () => {
  const dashboard = useDashboard();
  const paymentSummary = usePaymentSummary();
  const appeals = useAppeals();

  return {
    dashboard,
    paymentSummary,
    appeals,
    loading: dashboard.loading || paymentSummary.loading || appeals.loading,
    error: dashboard.error || paymentSummary.error || appeals.error,
    refetchAll: () => {
      dashboard.refetch();
      paymentSummary.refetch();
      appeals.refetch();
    },
  };
};
