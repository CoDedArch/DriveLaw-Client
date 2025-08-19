"use client"

import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  ChevronRight,
  X,
  Download,
  Ticket,
  AlertTriangle,
  Clock,
  FileText,
  ArrowLeft,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useAdminOffenseManagement } from "../../../../components/UserAdminOffenses";

type StatusFilter = "all" | "Pending Payment" | "Under Appeal" | "Paid" | "Overdue" | "Cancelled";
type SeverityFilter = "all" | "high" | "medium" | "low";
type TypeFilter = "all" | "Speeding" | "Red Light Violation" | "Illegal Parking" | "Lane Violation" | "DUI" | "Reckless Driving";

const AdminOffensesPage = () => {
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updateAction, setUpdateAction] = useState<"paid" | "cancel" | "fine" | "">("");
  const [updateReason, setUpdateReason] = useState<string>("");
  const [newFineAmount, setNewFineAmount] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Use the custom hook for data management
  const {
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
    offenses,
    offensesLoading,
    offensesError,
    offenseDetails,
    offenseDetailsLoading,
    offenseDetailsError,
    overallStats,
    overallStatsLoading,
    markAsPaid,
    cancelOffense,
    updateFineAmount,
    refreshAll,
  } = useAdminOffenseManagement();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Under Appeal":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Paid":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Overdue":
        return "bg-red-100 text-red-800 border border-red-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setTypeFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const handleOffenseAction = (action: "paid" | "cancel" | "fine") => {
    if (!selectedOffense) return;
    setUpdateAction(action);
    setUpdateReason("");
    setNewFineAmount("");
    setPaymentReference("");
    setShowUpdateModal(true);
    setActionError(null);
  };

  const confirmOffenseAction = async () => {
    if (!selectedOffense || !updateAction) return;
    
    setActionLoading(true);
    try {
      switch (updateAction) {
        case "paid":
          await markAsPaid(selectedOffense, paymentReference);
          break;
        case "cancel":
          if (!updateReason.trim()) {
            throw new Error("Cancellation reason is required");
          }
          await cancelOffense(selectedOffense, updateReason);
          break;
        case "fine":
          const amount = parseFloat(newFineAmount);
          if (isNaN(amount) || amount <= 0) {
            throw new Error("Valid fine amount is required");
          }
          if (!updateReason.trim()) {
            throw new Error("Reason for fine change is required");
          }
          await updateFineAmount(selectedOffense, amount, updateReason);
          break;
      }
      
      setShowUpdateModal(false);
      setUpdateAction("");
      setUpdateReason("");
      setNewFineAmount("");
      setPaymentReference("");
      
      // Refresh data to reflect changes
      refreshAll();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectOffense = (offenseId: string) => {
    setSelectedOffense(offenseId);
  };

  // Calculate statistics from hook data
  const totalOffenses = overallStats?.totalOffenses || 0;
  const pendingPayments = overallStats?.pendingPayment || 0;
  const underAppeal = overallStats?.underAppeal || 0;
  const overdue = overallStats?.overdue || 0;
  const paid = overallStats?.paid || 0;

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
                Offense Management
              </h1>
              <p className="text-gray-600">
                View and manage all traffic violations
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
                <p className="text-gray-600 text-sm">Total Offenses</p>
                <p className="text-2xl font-bold text-[#0A2540]">
                  {overallStatsLoading ? "Loading..." : totalOffenses.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payment</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {overallStatsLoading ? "Loading..." : pendingPayments.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Appeal</p>
                <p className="text-2xl font-bold text-blue-600">
                  {overallStatsLoading ? "Loading..." : underAppeal.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {overallStatsLoading ? "Loading..." : overdue.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Fines</p>
                <p className="text-2xl font-bold text-green-600">
                  {overallStatsLoading ? "Loading..." : `$${(overallStats?.totalFines || 0).toLocaleString()}`}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
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
                placeholder="Search by ID, driver, officer, or plate..."
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
              <option value="DUI">DUI</option>
              <option value="Reckless Driving">Reckless Driving</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Under Appeal">Under Appeal</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
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
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>

            <button
              onClick={refreshAll}
              className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
              disabled={offensesLoading}
            >
              <RefreshCw className={`h-5 w-5 ${offensesLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {offensesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{offensesError}</p>
            </div>
          </div>
        )}

        {/* Offenses Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Traffic Offenses ({offenses.length})
            </h3>
            <button className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
          </div>

          {offensesLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading offenses...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Officer</th>
                    <th className="pb-4 font-medium">Driver</th>
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Severity</th>
                    <th className="pb-4 font-medium">Fine</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offenses.map((offense) => (
                    <tr
                      key={offense.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectOffense(offense.id)}
                    >
                      <td className="py-4 text-gray-700">#{offense.id}</td>
                      <td className="py-4 text-gray-700">
                        {new Date(offense.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-gray-700">{offense.officer.name}</td>
                      <td className="py-4 text-gray-700">
                        {offense.driver.name} ({offense.driver.license})
                      </td>
                      <td className="py-4 text-gray-700">{offense.type}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(
                            offense.severity
                          )}`}
                        >
                          {offense.severity}
                        </span>
                      </td>
                      <td className="py-4 text-gray-700">
                        ${offense.fine.toFixed(2)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                            offense.status
                          )}`}
                        >
                          {offense.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {offenses.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">No offenses found</p>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Offense Details Modal */}
      {selectedOffense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Offense Details
              </h2>
              <button
                onClick={() => setSelectedOffense(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {offenseDetailsLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading offense details...</p>
              </div>
            ) : offenseDetailsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-600">{offenseDetailsError}</p>
                </div>
              </div>
            ) : offenseDetails ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#0A2540]">
                    {offenseDetails.type}
                  </h3>
                  <p className="text-gray-600">#{offenseDetails.id}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Date</h4>
                    <p className="text-[#0A2540] font-semibold">
                      {new Date(offenseDetails.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Location</h4>
                    <p className="text-[#0A2540] font-semibold">{offenseDetails.location}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Officer</h4>
                    <p className="text-[#0A2540] font-semibold">
                      {offenseDetails.officer.name} (ID: {offenseDetails.officer.id})
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                    <p className="text-[#0A2540] font-semibold">
                      {offenseDetails.driver.name} (DL: {offenseDetails.driver.license})
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Vehicle</h4>
                    <p className="text-[#0A2540] font-semibold">{offenseDetails.licensePlate}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Severity</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(
                        offenseDetails.severity
                      )}`}
                    >
                      {offenseDetails.severity}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                    <p className="text-2xl font-bold text-[#0A2540]">
                      ${offenseDetails.fine.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        offenseDetails.status
                      )}`}
                    >
                      {offenseDetails.status}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{offenseDetails.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-gray-600 text-sm mb-2">Evidence</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {offenseDetails.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                      >
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

                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleOffenseAction("fine")}
                    className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                  >
                    Edit Fine
                  </button>

                  {offenseDetails.status === "Pending Payment" && (
                    <button
                      onClick={() => handleOffenseAction("paid")}
                      className="bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                    >
                      Mark as Paid
                    </button>
                  )}

                  {offenseDetails.status !== "Cancelled" && (
                    <button
                      onClick={() => handleOffenseAction("cancel")}
                      className="bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      Cancel Offense
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOffense(null)}
                    className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0A2540]">
                {updateAction === "paid" && "Mark as Paid"}
                {updateAction === "cancel" && "Cancel Offense"}
                {updateAction === "fine" && "Update Fine Amount"}
              </h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {actionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-600">{actionError}</p>
                </div>
              </div>
            )}

            {updateAction === "paid" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Payment Reference
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Enter payment reference number"
                  />
                </div>
              </div>
            )}

            {updateAction === "fine" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    New Fine Amount ($)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    value={newFineAmount}
                    onChange={(e) => setNewFineAmount(e.target.value)}
                    placeholder="Enter new fine amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {(updateAction === "cancel" || updateAction === "fine") && (
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-2">
                  {updateAction === "cancel" ? "Cancellation Reason" : "Reason for Fine Change"}
                </label>
                <textarea
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent min-h-[100px]"
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder={`Enter ${updateAction === "cancel" ? "cancellation" : "fine change"} reason`}
                />
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={confirmOffenseAction}
                disabled={actionLoading}
                className="flex-1 bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Confirm"
                )}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffensesPage;