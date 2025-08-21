"use client";

import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  ChevronRight,
  X,
  Download,
  MessageSquare,
  AlertTriangle,
  Clock,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Scale,
  Loader2,
} from "lucide-react";
import { useAdminAppealsManagement } from "../../../components/UseAdminAppeals";
import EvidenceDisplay from "@/components/EvidenceDisplay";

// Type definitions for the review modal
type ReviewDecision = "approved" | "rejected";
type StatusFilter =
  | "all"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Pending Review";
type PriorityFilter = "all" | "high" | "medium" | "low";

const AdminAppealsPage = () => {
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision | null>(
    null
  );
  const [reviewNotes, setReviewNotes] = useState<string>("");

  // Use the comprehensive appeals management hook
  const {
    // Search and filter state
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedAppeal,
    setSelectedAppeal,

    // Data queries
    appeals,
    appealsLoading,
    appealsError,
    appealsStats,

    appealDetailsLoading,
    appealDetailsError,

    // Appeal actions
    approveAppeal,
    rejectAppeal,
    downloadEvidence,
    actionsLoading,
    actionsError,

    // Export functionality
    exportAppeals,
    exportLoading,

    // Utility functions
    refreshAll,
    resetFilters,
  } = useAdminAppealsManagement();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending Review":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReviewAppeal = async (decision: "approved" | "rejected") => {
    if (!selectedAppeal || !reviewNotes.trim()) return;

    try {
      if (decision === "approved") {
        await approveAppeal(selectedAppeal, reviewNotes);
      } else {
        await rejectAppeal(selectedAppeal, reviewNotes);
      }

      setShowReviewModal(false);
      setReviewDecision(null);
      setReviewNotes("");
      setSelectedAppeal(null);
      refreshAll();
    } catch (error) {
      console.error(`Failed to ${decision} appeal:`, error);
    }
  };

  const handleDownloadEvidence = async (evidenceId: string) => {
    if (!selectedAppeal) return;

    try {
      await downloadEvidence(selectedAppeal, evidenceId);
    } catch (error) {
      console.error("Failed to download evidence:", error);
    }
  };

  const handleExportData = async () => {
    try {
      await exportAppeals("csv", {
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      });
    } catch (error) {
      console.error("Failed to export appeals:", error);
    }
  };

  if (appealsError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Appeals
          </h2>
          <p className="text-gray-600 mb-4">{appealsError}</p>
          <button
            onClick={refreshAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedAppealData = appeals.find(
    (appeal) => appeal.id === selectedAppeal
  );

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
              <h1 className="text-2xl font-bold text-[#0A2540]">
                Appeals Management
              </h1>
              <p className="text-gray-600">
                Review and process traffic violation appeals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Appeals</p>
                <p className="text-2xl font-bold text-[#0A2540]">
                  {appealsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    appealsStats.totalCount
                  )}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {appealsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    appealsStats.pendingReviewCount
                  )}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appealsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    appealsStats.underReviewCount
                  )}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {appealsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    appealsStats.approvedCount
                  )}
                </p>
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
                <p className="text-2xl font-bold text-red-600">
                  {appealsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    appealsStats.rejectedCount
                  )}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
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
                placeholder="Search by ID, driver, offense, or officer..."
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as PriorityFilter)
              }
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>

            <button
              onClick={refreshAll}
              className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
              disabled={appealsLoading}
            >
              <RefreshCw
                className={`h-5 w-5 ${appealsLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {actionsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{actionsError}</p>
            </div>
          </div>
        )}

        {/* Appeals Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Appeal Cases ({appeals.length})
            </h3>
            <button
              onClick={handleExportData}
              disabled={exportLoading || appealsLoading}
              className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors disabled:opacity-50"
            >
              {exportLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              <span>Export Data</span>
            </button>
          </div>

          {appealsLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading appeals...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="pb-4 font-medium">Appeal ID</th>
                    <th className="pb-4 font-medium">Offense</th>
                    <th className="pb-4 font-medium">Driver</th>
                    <th className="pb-4 font-medium">Submitted</th>
                    <th className="pb-4 font-medium">Assigned To</th>
                    <th className="pb-4 font-medium">Priority</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Due Date</th>
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appeals.map((appeal) => (
                    <tr
                      key={appeal.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedAppeal(appeal.id)}
                    >
                      <td className="py-4 text-gray-700">#{appeal.id}</td>
                      <td className="py-4 text-gray-700">
                        <div>
                          <p className="font-medium">{appeal.offense.type}</p>
                          <p className="text-sm text-gray-500">
                            #{appeal.offenseId}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">
                        <div>
                          <p className="font-medium">{appeal.driver.name}</p>
                          <p className="text-sm text-gray-500">
                            {appeal.driver.license}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">
                        {new Date(appeal.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-gray-700">
                        {appeal.assignedTo.name}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(
                            appeal.priority
                          )}`}
                        >
                          {appeal.priority}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                            appeal.status
                          )}`}
                        >
                          {appeal.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-700">
                        {new Date(appeal.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {appeals.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">
                    No appeals found
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appeal Details Modal */}
      {selectedAppealData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Appeal Details
              </h2>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {appealDetailsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading appeal details...</p>
              </div>
            ) : appealDetailsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-600">{appealDetailsError}</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Appeal Information */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                      Appeal #{selectedAppealData.id}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          selectedAppealData.status
                        )}`}
                      >
                        {selectedAppealData.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                          selectedAppealData.priority
                        )}`}
                      >
                        {selectedAppealData.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-gray-600 text-sm mb-2">
                        Submitted Date
                      </h4>
                      <p className="text-[#0A2540] font-semibold">
                        {new Date(
                          selectedAppealData.submittedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-600 text-sm mb-2">Due Date</h4>
                      <p className="text-[#0A2540] font-semibold">
                        {new Date(
                          selectedAppealData.dueDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-600 text-sm mb-2">
                        Assigned Officer
                      </h4>
                      <p className="text-[#0A2540] font-semibold">
                        {selectedAppealData.assignedTo.name}
                      </p>
                    </div>
                    {selectedAppealData.reviewDate && (
                      <div>
                        <h4 className="text-gray-600 text-sm mb-2">
                          Review Date
                        </h4>
                        <p className="text-[#0A2540] font-semibold">
                          {new Date(
                            selectedAppealData.reviewDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-gray-600 text-sm mb-2">
                      Driver Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-[#0A2540] font-semibold">
                        {selectedAppealData.driver.name}
                      </p>
                      <p className="text-gray-600">
                        License: {selectedAppealData.driver.license}
                      </p>
                      <p className="text-gray-600">
                        Email: {selectedAppealData.driver.email}
                      </p>
                      <p className="text-gray-600">
                        Phone: {selectedAppealData.driver.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-gray-600 text-sm mb-2">
                      Appeal Reason
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {selectedAppealData.reason}
                      </p>
                    </div>
                  </div>

                  {selectedAppealData.reviewNotes && (
                    <div className="mb-6">
                      <h4 className="text-gray-600 text-sm mb-2">
                        Review Notes
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-700">
                          {selectedAppealData.reviewNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-gray-600 text-sm mb-2">
                      Evidence Submitted
                    </h4>
                    <EvidenceDisplay />
                  </div>
                </div>

                {/* Right Column - Original Offense Information */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0A2540] mb-4">
                      Original Offense
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <h4 className="text-lg font-semibold text-red-800">
                          {selectedAppealData.offense.type}
                        </h4>
                      </div>
                      <p className="text-red-700 mb-3">
                        {selectedAppealData.offense.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-red-600 text-sm">Offense ID</p>
                          <p className="text-red-800 font-medium">
                            #{selectedAppealData.offense.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-red-600 text-sm">Date</p>
                          <p className="text-red-800 font-medium">
                            {new Date(
                              selectedAppealData.offense.date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-red-600 text-sm">Location</p>
                          <p className="text-red-800 font-medium">
                            {selectedAppealData.offense.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-red-600 text-sm">Fine Amount</p>
                          <p className="text-red-800 font-medium">
                            ${selectedAppealData.offense.fine.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons for appeals under review */}
                  {(selectedAppealData.status === "Under Review" ||
                    selectedAppealData.status === "Pending Review") && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Scale className="h-5 w-5 text-blue-600" />
                          <h4 className="text-blue-800 font-medium">
                            Review Actions
                          </h4>
                        </div>
                        <p className="text-blue-700 text-sm mb-4">
                          Carefully review all evidence and driver statements
                          before making a decision.
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setReviewDecision("approved");
                              setShowReviewModal(true);
                            }}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve Appeal</span>
                          </button>
                          <button
                            onClick={() => {
                              setReviewDecision("rejected");
                              setShowReviewModal(true);
                            }}
                            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject Appeal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedAppeal(null)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Decision Modal */}
      {showReviewModal && selectedAppealData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              {reviewDecision === "approved" ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              )}
              <h2 className="text-xl font-bold text-[#0A2540]">
                {reviewDecision === "approved"
                  ? "Approve Appeal"
                  : "Reject Appeal"}
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm mb-2">
                Review Notes
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                rows={4}
                placeholder="Enter your review notes here..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  reviewDecision && handleReviewAppeal(reviewDecision)
                }
                disabled={!reviewNotes.trim() || actionsLoading}
                className={`${
                  reviewDecision === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50`}
              >
                {actionsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Confirm ${
                    reviewDecision === "approved" ? "Approval" : "Rejection"
                  }`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppealsPage;
