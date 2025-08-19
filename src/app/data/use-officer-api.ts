"use client"

import { useState, useEffect, useCallback } from "react"

export interface Appeal {
  appeal_number: string
  user_id: number
  user_name: string
  offense_number: string
  reason: string
  status: "under_review" | "approved" | "rejected" | "pending_documentation"
  submission_date: string
}

export interface AppealDetail {
  id: string
  user_id: number
  user_name: string
  offense_number: string
  appeal_number: string
  reason: string
  description: string
  status: "under_review" | "approved" | "rejected" | "pending_documentation"
  submission_date: string
  response_date?: string
  reviewer_notes?: string
  supporting_documents?: string[]
  reviewer_id?: number
}

export interface OffenseDetail {
  id: string
  user_id: number
  user_name: string
  offense_number: string
  offense_type: string
  offense_date: string
  offense_time: string
  location: string
  fine_amount: number
  status: "PENDING_PAYMENT" | "UNDER_APPEAL" | "PAID" | "OVERDUE"
  severity: string
  description?: string
  evidence_urls?: string[]
  due_date: string
  vehicle_registration?: string
  officer_id?: string
  points: number
}

export interface UserFullRecord {
  id: number
  first_name: string
  last_name: string
  other_name?: string
  email: string
  national_id_number?: string
  phone?: string
  alt_phone?: string
  address?: string
  gps_address?: string
  gender?: string
  date_of_birth?: string
  nationality?: string
  national_id_type?: string
  region?: string
  is_active: boolean
  preferred_verification?: string
  role: string
  verification_stage: string
  total_offenses: number
  total_fines: number
  pending_appeals: number
  successful_appeals: number
  driving_score: number
  offenses: OffenseDetail[]
  payments: any[]
  appeals: Appeal[]
}

export interface AppealDecision {
  appealNumber: string
  decision: string
  notes: string
}

export interface OffenseListItem {
  id: string
  user_id: number
  user_name: string
  offense_number: string
  offense_type: string
  offense_date: string
  offense_time: string
  location: string
  fine_amount: number
  status: "PENDING_PAYMENT" | "UNDER_APPEAL" | "PAID" | "OVERDUE"
  severity: "high" | "medium" | "low"
  description?: string
  due_date: string
  vehicle_registration?: string
  officer_id?: string
  points: number
  driver_license?: string
  total_driver_offenses?: number
  open_driver_fines?: number
  license_status?: "Active" | "Suspended" | "Revoked"
}
export interface OffenseFilters {
  status?: string
  offense_type?: string
  sort_by?: "offense_date" | "fine_amount" | "user_id" | "severity"
  sort_order?: "asc" | "desc"
  limit?: number
  offset?: number
}

// Base API configuration for officer endpoints
const OFFICER_API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/"}officer`

const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  console.log("[v0] Making request to:", url)
  console.log("[v0] Request options:", options)

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Error response body:", errorText)

      if (response.status === 401) {
        // Handle authentication error
        console.log("[v0] Authentication required, redirecting to login")
        window.location.href = "/login"
        throw new Error("Authentication required")
      }
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Response data:", data)
    return data
  } catch (error) {
    console.log("[v0] Fetch error details:", error)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Please check if the backend is running on localhost:8000")
    }
    throw error
  }
}

// Officer Appeals Hook
export const useOfficerAppeals = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppeals = useCallback(async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching officer appeals from:", `${OFFICER_API_BASE}/appeals`)
      const result: Appeal[] = await fetchWithCredentials(`${OFFICER_API_BASE}/appeals`)
      console.log("[v0] Appeals data received:", result)

      setAppeals(result)
      setError(null)
    } catch (err) {
      console.log("[v0] Error fetching appeals:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppeals()
  }, [fetchAppeals])

  return { appeals, loading, error, refetch: fetchAppeals }
}

export const useAppealDetails = (appealNumber: string) => {
  const [appealDetail, setAppealDetail] = useState<AppealDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppealDetails = useCallback(async () => {
    if (!appealNumber) return

    try {
      setLoading(true)
      console.log("[v0] Fetching appeal details for:", appealNumber)
      const result: AppealDetail = await fetchWithCredentials(`${OFFICER_API_BASE}/appeals/${appealNumber}`)
      console.log("[v0] Appeal details received:", result)

      setAppealDetail(result)
      setError(null)
    } catch (err) {
      console.log("[v0] Error fetching appeal details:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch appeal details")
    } finally {
      setLoading(false)
    }
  }, [appealNumber])

  useEffect(() => {
    fetchAppealDetails()
  }, [fetchAppealDetails])

  return { appealDetail, loading, error, refetch: fetchAppealDetails }
}

export const useOfficerOffenses = (filters: OffenseFilters = {}) => {
  const [offenses, setOffenses] = useState<OffenseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffenses = useCallback(async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching officer offenses from:", `${OFFICER_API_BASE}/offenses`)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status)
      }
      if (filters.offense_type && filters.offense_type !== "all") {
        params.append("offense_type", filters.offense_type)
      }
      if (filters.sort_by) {
        params.append("sort_by", filters.sort_by)
      }
      if (filters.sort_order) {
        params.append("sort_order", filters.sort_order)
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString())
      }
      if (filters.offset) {
        params.append("offset", filters.offset.toString())
      }

      const url = `${OFFICER_API_BASE}/offenses${params.toString() ? `?${params.toString()}` : ""}`
      console.log("[v0] Fetching officer offenses from:", url)
      console.log("[v0] Applied filters:", filters)

      const result: OffenseListItem[] = await fetchWithCredentials(url)
      console.log("[v0] Offenses data received:", result)

      setOffenses(result)
      setError(null)
    } catch (err) {
      console.log("[v0] Error fetching offenses:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffenses()
  }, [fetchOffenses])

  return { offenses, loading, error, refetch: fetchOffenses }
}
export const useOffenseDetails = (offenseNumber: string) => {
  const [offenseDetail, setOffenseDetail] = useState<OffenseDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffenseDetails = useCallback(async () => {
    if (!offenseNumber) return

    try {
      setLoading(true)
      console.log("[v0] Fetching offense details for:", offenseNumber)
      const result: OffenseDetail = await fetchWithCredentials(`${OFFICER_API_BASE}/offenses/${offenseNumber}`)
      console.log("[v0] Offense details received:", result)

      setOffenseDetail(result)
      setError(null)
    } catch (err) {
      console.log("[v0] Error fetching offense details:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch offense details")
    } finally {
      setLoading(false)
    }
  }, [offenseNumber])

  useEffect(() => {
    fetchOffenseDetails()
  }, [fetchOffenseDetails])

  return { offenseDetail, loading, error, refetch: fetchOffenseDetails }
}

export const useDriverRecord = (userId: string) => {
  const [driverRecord, setDriverRecord] = useState<UserFullRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDriverRecord = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      console.log("[v0] Fetching driver record for user ID:", userId)
      const result: UserFullRecord = await fetchWithCredentials(`${OFFICER_API_BASE}/users/${userId}`)
      console.log("[v0] Driver record data received:", result)

      setDriverRecord(result)
      setError(null)
    } catch (err) {
      console.log("[v0] Error fetching driver record:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch driver record")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDriverRecord()
  }, [fetchDriverRecord])

  return { driverRecord, loading, error, refetch: fetchDriverRecord }
}

export const useAppealDecision = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeDecision = useCallback(async (decision: AppealDecision) => {
    try {
      setLoading(true)
      console.log("[v0] Making appeal decision:", decision)

      const result = await fetchWithCredentials(`${OFFICER_API_BASE}/appeals/${decision.appealNumber}/decision`, {
        method: "PUT",
        body: JSON.stringify({
          status: decision.decision,
          reviewer_notes: decision.notes,
        }),
      })

      console.log("[v0] Decision result:", result)
      setError(null)
      return result
    } catch (err) {
      console.log("[v0] Error making decision:", err)
      setError(err instanceof Error ? err.message : "Failed to make decision")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { makeDecision, loading, error }
}
