"use client"

import { useState } from "react"
import {
  Search,
  Camera,
  Download,
  X,
  ArrowLeft,
  AlertTriangle,
  User,
  RefreshCw,
  ChevronRight,
  Ticket,
  ClipboardList,
  Bell,
  Edit3,
} from "lucide-react"
import {
  useOfficerOffenses,
  useOffenseDetails,
  useDriverRecord,
  type OffenseListItem,
  type OffenseFilters,
} from "../../../data/use-officer-api"

interface Driver {
  name: string
  license: string
  totalOffenses?: number
  openFines?: number | null
  licenseStatus?: "Active" | "Suspended" | "Revoked"
}

type StatusFilter = "all" | "PENDING_PAYMENT" | "UNDER_APPEAL" | "PAID" | "OVERDUE"
type SeverityFilter = "all" | "high" | "medium" | "low"
type TypeFilter = "all" | "Speeding" | "Red Light Violation" | "Illegal Parking" | "Lane Violation"
type SortBy = "offense_date" | "fine_amount" | "user_id" | "severity"
type SortOrder = "asc" | "desc"

const OfficerOffensesPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [sortBy, setSortBy] = useState<SortBy>("offense_date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const filters: OffenseFilters = {
    status: statusFilter !== "all" ? statusFilter : undefined,
    offense_type: typeFilter !== "all" ? typeFilter : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    limit: 100,
  }

  const { offenses, loading, error, refetch } = useOfficerOffenses(filters)

  const [selectedOffenseNumber, setSelectedOffenseNumber] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { offenseDetail } = useOffenseDetails(selectedOffenseNumber || "")
  const { driverRecord, loading: driverLoading, error: driverError } = useDriverRecord(selectedUserId || "")

  const filteredOffenses: OffenseListItem[] = offenses.filter((offense) => {
    if (!searchQuery) return true

    const matchesSearch =
      offense.offense_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.vehicle_registration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  console.log("[v0] Backend Filtering Debug:", {
    appliedFilters: filters,
    totalOffenses: offenses.length,
    filteredCount: filteredOffenses.length,
    searchQuery,
  })

  const getSeverityColor = (severity: OffenseListItem["severity"]): string => {
    switch (severity) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const getStatusBadgeClasses = (status: OffenseListItem["status"]): string => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "PAID":
        return "bg-green-100 text-green-800 border border-green-300"
      case "UNDER_APPEAL":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "OVERDUE":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSeverityFilter("all")
    setTypeFilter("all")
    setSortBy("offense_date")
    setSortOrder("desc")
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0A2540]">Offense Management</h1>
              <p className="text-gray-600">Monitor and manage all traffic violations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Offenses</p>
                <p className="text-2xl font-bold text-[#0A2540]">{offenses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {offenses.filter((o) => o.status === "PENDING_PAYMENT").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Appeal</p>
                <p className="text-2xl font-bold text-blue-600">
                  {offenses.filter((o) => o.status === "UNDER_APPEAL").length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {offenses.filter((o) => o.status === "OVERDUE").length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 flex-1 max-w-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, driver, plate, or location..."
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            >
              <option value="all">All Types</option>
              <option value="Speeding">Speeding</option>
              <option value="Red Light Violation">Red Light Violation</option>
              <option value="Illegal Parking">Illegal Parking</option>
              <option value="Lane Violation">Lane Violation</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="UNDER_APPEAL">Under Appeal</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
            >
              <option value="offense_date">Date</option>
              <option value="fine_amount">Fine Amount</option>
              <option value="severity">Severity</option>
              <option value="user_id">Driver</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Offenses List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">Traffic Offenses ({filteredOffenses.length})</h3>
          </div>

          <div className="space-y-4">
            {filteredOffenses.map((offense) => (
              <div
                key={offense.id}
                className={`border-l-4 ${getSeverityColor(
                  offense.severity,
                )} border border-gray-200 rounded-r-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setSelectedOffenseNumber(offense.offense_number)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-[#0A2540] font-semibold text-lg">{offense.offense_type}</h4>
                      <span className="text-gray-500 text-sm">#{offense.offense_number}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(offense.status)}`}
                      >
                        {offense.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{offense.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Driver</p>
                        <p className="text-gray-900">
                          {offense.user_name} ({offense.driver_license})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Vehicle</p>
                        <p className="text-gray-900">{offense.vehicle_registration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Location</p>
                        <p className="text-gray-900">{offense.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0A2540]">${offense.fine_amount.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">
                      {offense.offense_date} at {offense.offense_time}
                    </p>
                    <p className="text-gray-600 text-sm">Due: {offense.due_date}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Evidence available</span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedUserId(offense.user_id.toString())
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>View Driver</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle edit offense
                        console.log("Edit offense:", offense.offense_number)
                      }}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle download evidence
                        console.log("Download evidence for:", offense.offense_number)
                      }}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredOffenses.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No offenses found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offense Details Modal */}
      {selectedOffenseNumber && offenseDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Offense Details</h2>
              <button
                onClick={() => setSelectedOffenseNumber(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className={`border-l-4 ${getSeverityColor(offenseDetail.severity)} pl-4 mb-6`}>
              <h3 className="text-xl font-bold text-[#0A2540]">{offenseDetail.offense_type}</h3>
              <p className="text-gray-600">#{offenseDetail.offense_number}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Date & Time</h4>
                <p className="text-[#0A2540] font-semibold">
                  {offenseDetail.offense_date} at {offenseDetail.offense_time}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Location</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.location}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.user_name}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Vehicle</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.vehicle_registration}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                <p className="text-2xl font-bold text-[#0A2540]">${offenseDetail.fine_amount.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(offenseDetail.status)}`}
                >
                  {offenseDetail.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {offenseDetail.description && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{offenseDetail.description}</p>
                </div>
              </div>
            )}

            {offenseDetail.evidence_urls && offenseDetail.evidence_urls.length > 0 && (
              <div className="mb-8">
                <h4 className="text-gray-600 text-sm mb-2">Evidence</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {offenseDetail.evidence_urls.map((url: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Camera className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">Evidence {index + 1}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setSelectedUserId(offenseDetail.user_id.toString())
                  setSelectedOffenseNumber(null)
                }}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View Driver Record
              </button>

              <button
                onClick={() => {
                  // Handle edit offense
                  console.log("Edit offense:", offenseDetail.offense_number)
                }}
                className="bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                Edit Offense
              </button>

              <button
                onClick={() => setSelectedOffenseNumber(null)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserId && driverRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Driver Record</h2>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0A2540]">
                  {driverRecord.first_name} {driverRecord.last_name}
                </h3>
                <p className="text-gray-600">Driver ID: {driverRecord.id}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Account Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${
                    driverRecord.is_active
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {driverRecord.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Total Offenses</h4>
                <p className="text-[#0A2540] font-semibold">{driverRecord.total_offenses}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Total Fines</h4>
                <p className="text-[#0A2540] font-semibold">${driverRecord.total_fines.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driving Score</h4>
                <p className="text-[#0A2540] font-semibold">{driverRecord.driving_score}/100</p>
              </div>
            </div>

            {driverRecord.offenses && driverRecord.offenses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-bold text-[#0A2540] mb-4">Recent Offenses</h4>
                <div className="space-y-3">
                  {driverRecord.offenses.slice(0, 3).map((offense) => (
                    <div
                      key={offense.id}
                      className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedOffenseNumber(offense.offense_number)
                        setSelectedUserId(null)
                      }}
                    >
                      <div>
                        <p className="text-[#0A2540] font-medium">{offense.offense_type}</p>
                        <p className="text-gray-600 text-sm">
                          {offense.offense_date} at {offense.offense_time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClasses(offense.status)}`}>
                          {offense.status.replace("_", " ")}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedUserId(null)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle view full driver history
                  console.log("View full history for driver:", driverRecord.id)
                }}
                className="bg-[#0052CC] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                View Full History
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserId && driverLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading driver record...</p>
          </div>
        </div>
      )}

      {selectedUserId && driverError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-md">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading driver record: {driverError}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setSelectedUserId(null)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Trigger refetch by resetting and setting the selectedUserId
                  const currentUserId = selectedUserId
                  setSelectedUserId(null)
                  setTimeout(() => setSelectedUserId(currentUserId), 100)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfficerOffensesPage
