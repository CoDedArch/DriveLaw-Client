"use client"

import { useState } from "react"
import {
  Search,
  RefreshCw,
  X,
  ArrowLeft,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  User,
  Ticket,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  useOfficerAppeals,
  useAppealDetails,
  useOffenseDetails,
  useDriverRecord,
  useAppealDecision,
  type Appeal,
  type OffenseDetail,
} from "../../../data/use-officer-api"

type AppealStatusFilter = "all" | "under_review" | "approved" | "rejected" | "pending_documentation"

const OfficerAppealsPage = () => {
  const { appeals, loading, error, refetch } = useOfficerAppeals()
  const { makeDecision, loading: decisionLoading } = useAppealDecision()

  const [selectedAppealNumber, setSelectedAppealNumber] = useState<string | null>(null)
  const [selectedOffenseNumber, setSelectedOffenseNumber] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showDecisionModal, setShowDecisionModal] = useState<Appeal | null>(null)
  const [decisionNotes, setDecisionNotes] = useState("")
  const [selectedDecision, setSelectedDecision] = useState<"APPROVED" | "REJECTED" | "PENDING_DOCUMENTATION">(
    "APPROVED",
  )
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<AppealStatusFilter>("all")
  const [expandedAppeals, setExpandedAppeals] = useState<Record<string, boolean>>({})

  const { appealDetail } = useAppealDetails(selectedAppealNumber || "")
  const { offenseDetail } = useOffenseDetails(selectedOffenseNumber || "")
  const { driverRecord, loading: driverLoading, error: driverError } = useDriverRecord(selectedUserId || "")

  console.log(
    "[v0] Appeals data:",
    appeals.map((a) => ({
      appeal_number: a.appeal_number,
      status: a.status,
      user_name: a.user_name,
    })),
  )

  console.log("[v0] Total appeals:", appeals.length)
  console.log("[v0] Status breakdown:", {
    all_statuses: appeals.map((a) => a.status),
    under_review: appeals.filter((a: Appeal) => a.status === "under_review").length,
    approved: appeals.filter((a: Appeal) => a.status === "approved").length,
    rejected: appeals.filter((a: Appeal) => a.status === "rejected").length,
    pending_documentation: appeals.filter((a: Appeal) => a.status === "pending_documentation").length,
    unique_statuses: [...new Set(appeals.map((a) => a.status))],
  })

  const filteredAppeals: Appeal[] = appeals.filter((appeal: Appeal) => {
    const matchesSearch =
      appeal.appeal_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.offense_number.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getAppealStatusColor = (status: Appeal["status"]): string => {
    switch (status.toLowerCase()) {
      case "under_review":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "approved":
        return "bg-green-100 text-green-800 border border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-300"
      case "pending_documentation":
        return "bg-orange-100 text-orange-800 border border-orange-300"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  const getOffenseStatusColor = (status: OffenseDetail["status"]): string => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300"
      case "UNDER_APPEAL":
        return "bg-blue-100 text-blue-800 border border-blue-300"
      case "PAID":
        return "bg-green-100 text-green-800 border border-green-300"
      case "OVERDUE":
        return "bg-red-100 text-red-800 border border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300"
    }
  }

  const toggleAppealExpansion = (appealId: string) => {
    setExpandedAppeals((prev) => ({
      ...prev,
      [appealId]: !prev[appealId],
    }))
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  const handleDecision = async (appealNumber: string) => {
    try {
      await makeDecision({
        appealNumber,
        decision: selectedDecision,
        notes: decisionNotes,
      })

      await refetch()

      setShowDecisionModal(null)
      setSelectedAppealNumber(null)
      setDecisionNotes("")
      setSelectedDecision("APPROVED") // Reset to default
    } catch (err) {
      console.error("Failed to make decision:", err)
    }
  }

  const openDriverRecord = (userId: number) => {
    setSelectedUserId(userId.toString())
  }

  const viewAppealDetails = (appealNumber: string) => {
    setSelectedAppealNumber(appealNumber)
  }

  const viewOffenseDetails = (offenseNumber: string) => {
    setSelectedOffenseNumber(offenseNumber)
  }

  const totalAppeals = appeals.length
  const underReview = appeals.filter((a: Appeal) => a.status === "under_review").length
  const approved = appeals.filter((a: Appeal) => a.status === "approved").length
  const rejected = appeals.filter((a: Appeal) => a.status === "rejected").length
  const pendingDocumentation = appeals.filter((a: Appeal) => a.status === "pending_documentation").length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appeals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading appeals: {error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-[#0A2540]">Appeal Management</h1>
              <p className="text-gray-600">Review and process all appeal cases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Appeals</p>
                <p className="text-2xl font-bold text-[#0A2540]">{totalAppeals}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{underReview}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Documentation</p>
                <p className="text-2xl font-bold text-orange-600">{pendingDocumentation}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 flex-1 max-w-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by appeal ID, driver, or offense..."
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppealStatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending_documentation">Pending Documentation</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>

            <button
              onClick={refetch}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Appeals List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">Appeal Cases ({filteredAppeals.length})</h3>
          </div>

          <div className="space-y-4">
            {filteredAppeals.map((appeal) => (
              <div
                key={appeal.appeal_number}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6 cursor-pointer" onClick={() => toggleAppealExpansion(appeal.appeal_number)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-[#0A2540]">Appeal #{appeal.appeal_number}</h4>
                      <p className="text-gray-600">For Offense #{appeal.offense_number}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getAppealStatusColor(appeal.status)}`}>
                        {appeal.status.replace("_", " ")}
                      </span>
                      {expandedAppeals[appeal.appeal_number] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedAppeals[appeal.appeal_number] && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Driver</h5>
                        <p className="text-[#0A2540] font-medium">
                          {appeal.user_name} (ID: {appeal.user_id})
                        </p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Submitted</h5>
                        <p className="text-[#0A2540] font-medium">{appeal.submission_date}</p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Reason</h5>
                        <p className="text-[#0A2540] font-medium">{appeal.reason}</p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Status</h5>
                        <span className={`px-3 py-1 rounded-full text-sm ${getAppealStatusColor(appeal.status)}`}>
                          {appeal.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        onClick={() => viewAppealDetails(appeal.appeal_number)}
                        className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Ticket className="h-4 w-4" />
                        <span>View Full Details</span>
                      </button>

                      <button
                        onClick={() => openDriverRecord(appeal.user_id)}
                        className="bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>See Driver Record</span>
                      </button>

                      <button
                        onClick={() => setShowDecisionModal(appeal)}
                        className="bg-[#0052CC] text-white py-2 rounded-lg font-medium hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2"
                      >
                        <ClipboardList className="h-4 w-4" />
                        <span>Make Decision</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredAppeals.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No appeals found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appeal Details Modal */}
      {selectedAppealNumber && appealDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Appeal Details</h2>
              <button
                onClick={() => setSelectedAppealNumber(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">Appeal #{appealDetail.appeal_number}</h3>
              <p className="text-gray-600">For Offense #{appealDetail.offense_number}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                <p className="text-[#0A2540] font-semibold">{appealDetail.user_name}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Submitted</h4>
                <p className="text-[#0A2540] font-semibold">{appealDetail.submission_date}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getAppealStatusColor(appealDetail.status)}`}>
                  {appealDetail.status.replace("_", " ")}
                </span>
              </div>
              {appealDetail.response_date && (
                <div>
                  <h4 className="text-gray-600 text-sm mb-2">Response Date</h4>
                  <p className="text-[#0A2540] font-semibold">{appealDetail.response_date}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Reason for Appeal</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{appealDetail.reason}</p>
              </div>
            </div>

            {appealDetail.description && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{appealDetail.description}</p>
                </div>
              </div>
            )}

            {appealDetail.supporting_documents && appealDetail.supporting_documents.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Supporting Documents</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {appealDetail.supporting_documents.map((file: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700">{file}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appealDetail.reviewer_notes && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Reviewer Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{appealDetail.reviewer_notes}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => viewOffenseDetails(appealDetail.offense_number)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View Offense Details
              </button>

              <button
                onClick={() => openDriverRecord(appealDetail.user_id)}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                View Driver Record
              </button>

              <button
                onClick={() => {
                  const appeal = appeals.find((a) => a.appeal_number === appealDetail.appeal_number)
                  if (appeal) setShowDecisionModal(appeal)
                }}
                className="bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                Make Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offense Details Modal */}
      {selectedOffenseNumber && offenseDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Offense Details</h2>
              <button
                onClick={() => setSelectedOffenseNumber(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">{offenseDetail.offense_type}</h3>
              <p className="text-gray-600">#{offenseDetail.offense_number}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Date</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.offense_date}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Time</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.offense_time}</p>
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
                <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                <p className="text-2xl font-bold text-[#0A2540]">${offenseDetail.fine_amount.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getOffenseStatusColor(offenseDetail.status)}`}>
                  {offenseDetail.status.replace("_", " ")}
                </span>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Severity</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.severity}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Points</h4>
                <p className="text-[#0A2540] font-semibold">{offenseDetail.points}</p>
              </div>
            </div>

            {offenseDetail.description && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Description</h4>
                <p className="text-gray-700">{offenseDetail.description}</p>
              </div>
            )}

            {offenseDetail.evidence_urls && offenseDetail.evidence_urls.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Evidence</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {offenseDetail.evidence_urls.map((url: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-600" />
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

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOffenseNumber(null)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Record Modal */}
      {selectedUserId && driverRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Driver Record</h2>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">{appealDetail?.user_name}</h3>
              {/* <p className="text-gray-600">Driver ID: {driverRecord.user_id}</p> */}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* <div>
                <h4 className="text-gray-600 text-sm mb-2">License Status</h4>
                <p className="text-[#0A2540] font-semibold">{driverRecord.license_status}</p>
              </div> */}
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driving Score</h4>
                <p className="text-2xl font-bold text-[#0A2540]">{driverRecord.driving_score}/100</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Total Offenses</h4>
                <p className="text-[#0A2540] font-semibold">{driverRecord.total_offenses}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Total Fines</h4>
                <p className="text-2xl font-bold text-[#0A2540]">${driverRecord.total_fines.toFixed(2)}</p>
              </div>
            </div>

            {driverRecord.offenses && driverRecord.offenses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-4">Recent Offenses</h4>
                <div className="space-y-4">
                  {driverRecord.offenses.map((offense: any) => (
                    <div key={offense.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-[#0A2540]">{offense.offense_type}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs ${getOffenseStatusColor(offense.status)}`}>
                          {offense.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date: </span>
                          <span className="text-[#0A2540]">{offense.offense_date}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fine: </span>
                          <span className="text-[#0A2540]">${offense.fine_amount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Points: </span>
                          <span className="text-[#0A2540]">{offense.points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUserId(null)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state for driver record */}
      {selectedUserId && driverLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading driver record...</p>
          </div>
        </div>
      )}

      {/* Error state for driver record */}
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

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Make Decision</h2>
              <button
                onClick={() => {
                  setShowDecisionModal(null)
                  setDecisionNotes("")
                  setSelectedDecision("APPROVED")
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0A2540] mb-2">Appeal #{showDecisionModal.appeal_number}</h3>
              <p className="text-gray-600">For Offense #{showDecisionModal.offense_number}</p>
              <p className="text-gray-600">Driver: {showDecisionModal.user_name}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Decision Type</h4>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                value={selectedDecision}
                onChange={(e) =>
                  setSelectedDecision(e.target.value as "APPROVED" | "REJECTED" | "PENDING_DOCUMENTATION")
                }
              >
                <option value="APPROVED">Approve Appeal</option>
                <option value="REJECTED">Reject Appeal</option>
                <option value="PENDING_DOCUMENTATION">Request More Information</option>
              </select>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Decision Notes (Required)</h4>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                rows={4}
                placeholder="Enter your decision notes and reasoning..."
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleDecision(showDecisionModal.appeal_number)}
                disabled={decisionLoading || !decisionNotes.trim()}
                className="bg-[#0052CC] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {decisionLoading ? "Processing..." : "Submit Decision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfficerAppealsPage
