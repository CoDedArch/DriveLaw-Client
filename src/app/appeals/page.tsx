"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  X,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { Appeal, useAppeals, useSubmitAppeal } from "../data/queries";


const AppealsPage = () => {
  const [appealModal, setAppealModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [appealForm, setAppealForm] = useState({
    offenseId: "",
    reason: "",
    description: "",
    evidence: null as File | null,
  });

  const {
    appeals,
    loading: appealsLoading,
    error: appealsError,
    refetch,
  } = useAppeals();
  const {
    submitAppeal,
    loading: appealSubmitting,
    error: appealSubmitError,
  } = useSubmitAppeal();

  // Handle loading state
  if (appealsLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appeals...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (appealsError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading appeals</p>
          <p className="text-gray-600">{appealsError}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Update color functions to use more reliable Tailwind classes
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      case "pending_documentation":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under_review":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      case "pending_documentation":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Update appeal submission handler
  const handleAppealSubmit = async () => {
    try {
      await submitAppeal({
        offenseId: appealForm.offenseId,
        reason: appealForm.reason,
        description: appealForm.description,
        evidence: appealForm.evidence || undefined,
      });

      setAppealModal(false);
      setAppealForm({
        offenseId: "",
        reason: "",
        description: "",
        evidence: null,
      });
      refetch(); // Refresh the appeals list

      console.log("Appeal submitted successfully");
    } catch (error) {
      console.error("Appeal submission failed:", error);
      // Error will be handled by the hook and displayed in the modal
    }
  };

    
  console.log("Appeals ", appeals)
  // Calculate active and past appeals from real data
  const activeAppeals = appeals.filter(
    (appeal) =>
      appeal.status === "under_review" ||
      appeal.status === "pending_documentation"
  );

  const pastAppeals = appeals.filter(
    (appeal) => appeal.status === "approved" || appeal.status === "rejected"
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
                Appeal Management
              </h1>
              <p className="text-gray-600">
                Submit and track your traffic violation appeals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Submit New Appeal Button */}
        <div className="mb-8">
          <button
            onClick={() => setAppealModal(true)}
            disabled={appealSubmitting}
            className="w-full bg-[#0052CC] text-white py-4 rounded-lg font-semibold hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-5 w-5" />
            <span>
              {appealSubmitting ? "Submitting..." : "Submit New Appeal"}
            </span>
          </button>
        </div>

        {/* Active Appeals */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Current Appeals
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {activeAppeals.length} active
            </span>
          </div>

          {activeAppeals.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active appeals</p>
              <p className="text-gray-400 text-sm">
                Submit an appeal to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-[#0A2540] font-semibold text-lg">
                        {appeal.offenseType} - {appeal.offenseId}
                      </h4>
                      <div className="flex items-center space-x-4 text-gray-600 text-sm mt-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appeal.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {appeal.submissionDate}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusBadgeClasses(
                        appeal.status
                      )}`}
                    >
                      {getStatusIcon(appeal.status)}
                      <span>{appeal.status}</span>
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm">
                      <strong>Reason:</strong> {appeal.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                      {appeal.status === "Under Review" &&
                        "Expected response within 14 business days"}
                      {appeal.status === "Pending Documentation" &&
                        "Additional documentation required"}
                    </p>
                    <button
                      onClick={() => setSelectedAppeal(appeal)}
                      className="text-[#0052CC] hover:text-[#003D99] transition-colors flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Appeals */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">Past Appeals</h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {pastAppeals.length} completed
            </span>
          </div>

          <div className="space-y-4">
            {pastAppeals.map((appeal) => (
              <div
                key={appeal.id}
                className="border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-[#0A2540] font-semibold text-lg">
                      {appeal.offenseType} - {appeal.offenseId}
                    </h4>
                    <div className="flex items-center space-x-4 text-gray-600 text-sm mt-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{appeal.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {appeal.submissionDate}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusBadgeClasses(
                      appeal.status
                    )}`}
                  >
                    {getStatusIcon(appeal.status)}
                    <span>{appeal.status}</span>
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Reason:</strong> {appeal.description}
                  </p>
                  {appeal.reviewerNotes && (
                    <p className="text-gray-600 text-sm mt-2">
                      <strong>Decision:</strong> {appeal.reviewerNotes}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    {appeal.status === "Approved" &&
                      `Approved on ${appeal.responseDate}`}
                    {appeal.status === "Rejected" &&
                      `Rejected on ${appeal.responseDate}`}
                  </p>
                  <button
                    onClick={() => setSelectedAppeal(appeal)}
                    className="text-[#0052CC] hover:text-[#003D99] transition-colors flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appeal Guidelines */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[#0A2540] font-bold text-lg mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Appeal Guidelines</span>
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Submit appeals within 30 days of violation date</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                Provide clear evidence supporting your case (photos, documents,
                witness statements)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Appeals are reviewed within 14-21 business days</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                You can track appeal status in real-time through this portal
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p>
                False appeals may result in additional penalties and processing
                fees
              </p>
            </div>
          </div>
        </div>

        {/* Appeal Submission Modal */}
        {appealModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Submit New Appeal
                </h2>
                <button
                  onClick={() => setAppealModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Offense ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., OFF001"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    value={appealForm.offenseId}
                    onChange={(e) =>
                      setAppealForm({
                        ...appealForm,
                        offenseId: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Reason for Appeal
                  </label>
                  <select
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    value={appealForm.reason}
                    onChange={(e) =>
                      setAppealForm({ ...appealForm, reason: e.target.value })
                    }
                  >
                    <option value="">Select reason...</option>
                    <option value="incorrect_details">
                      Incorrect violation details
                    </option>
                    <option value="not_driver">I was not the driver</option>
                    <option value="emergency">Emergency situation</option>
                    <option value="signage_issue">
                      Poor signage/visibility
                    </option>
                    <option value="equipment_malfunction">
                      Equipment malfunction
                    </option>
                    <option value="road_conditions">
                      Poor road conditions
                    </option>
                    <option value="other">Other (please specify)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    placeholder="Please provide a detailed explanation of your appeal, including any relevant circumstances, evidence, and supporting information..."
                    rows={6}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
                    value={appealForm.description}
                    onChange={(e) =>
                      setAppealForm({
                        ...appealForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Supporting Evidence
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0052CC] transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Supports: PDF, JPG, PNG, MP4 (max 10MB each)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.mp4"
                      className="hidden"
                      onChange={(e) =>
                        setAppealForm({
                          ...appealForm,
                          evidence: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-800 text-sm">
                      <p className="font-semibold mb-1">Important Notice:</p>
                      <p>
                        Submitting false information in an appeal may result in
                        additional penalties. Please ensure all information
                        provided is accurate and truthful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setAppealModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAppealSubmit}
                  className="flex-1 bg-[#0052CC] text-white px-4 py-3 rounded-md hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Submit Appeal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appeal Details Modal */}
        {selectedAppeal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Appeal ID
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedAppeal.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Offense ID
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedAppeal.offenseId}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Violation Type
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedAppeal.offenseType}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Location
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedAppeal.location}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Submission Date
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedAppeal.submissionDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(
                          selectedAppeal.status
                        )}`}
                      >
                        {getStatusIcon(selectedAppeal.status)}
                        <span>{selectedAppeal.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-2">
                    Appeal Description
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {selectedAppeal.description}
                    </p>
                  </div>
                </div>

                {selectedAppeal.reviewerNotes && (
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-2">
                      Reviewer Notes
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {selectedAppeal.reviewerNotes}
                      </p>
                    </div>
                  </div>
                )}

                {selectedAppeal.responseDate && (
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Response Date
                    </label>
                    <p className="font-semibold text-[#0A2540]">
                      {selectedAppeal.responseDate}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedAppeal(null)}
                className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealsPage;
