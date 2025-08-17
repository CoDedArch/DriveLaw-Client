"use client"

import React, { useState } from "react";
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
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Type definitions
interface Driver {
  name: string;
  license: string;
  licenseStatus?: "Active" | "Suspended" | "Revoked";
}

interface Offense {
  id: string;
  type: string;
  date: string;
  fine: number;
  status: "Pending Payment" | "Under Appeal" | "Paid" | "Overdue";
  description: string;
  driver: Driver;
}

interface Appeal {
  id: string;
  offenseId: string;
  submittedDate: string;
  driver: Driver;
  reason: string;
  evidence: string[];
  status: "Under Review" | "Approved" | "Rejected";
  reviewDueDate: string;
  officerNotes: string;
  offenseDetails: Offense;
}

type AppealStatusFilter = "all" | "Under Review" | "Approved" | "Rejected";

const OfficerAppealsPage = () => {
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AppealStatusFilter>("all");
  const [expandedAppeals, setExpandedAppeals] = useState<Record<string, boolean>>({});

  // Mock data - in real app, this would come from API
  const appeals: Appeal[] = [
    {
      id: "APL-2023-0023",
      offenseId: "OFF-2023-0455",
      submittedDate: "2023-05-20",
      driver: { 
        name: "Jessica Wilson", 
        license: "DL-456123",
        licenseStatus: "Active"
      },
      reason: "Traffic light was malfunctioning, showing green in both directions",
      evidence: ["light_malfunction.jpg", "witness_statement.pdf"],
      status: "Under Review",
      reviewDueDate: "2023-06-03",
      officerNotes: "Need to verify traffic light maintenance records",
      offenseDetails: {
        id: "OFF-2023-0455",
        type: "Red Light Violation",
        date: "2023-05-14",
        fine: 200.0,
        status: "Under Appeal",
        description: "Ran red light, nearly caused collision",
        driver: { name: "Jessica Wilson", license: "DL-456123" }
      }
    },
    {
      id: "APL-2023-0022",
      offenseId: "OFF-2023-0421",
      submittedDate: "2023-05-18",
      driver: { 
        name: "Michael Brown", 
        license: "DL-987654",
        licenseStatus: "Active"
      },
      reason: "Speed camera was incorrectly calibrated",
      evidence: ["calibration_report.pdf"],
      status: "Approved",
      reviewDueDate: "2023-05-28",
      officerNotes: "Camera calibration was indeed off by 5mph on that day",
      offenseDetails: {
        id: "OFF-2023-0421",
        type: "Speeding",
        date: "2023-05-10",
        fine: 150.0,
        status: "Under Appeal",
        description: "Exceeded speed limit by 20mph in construction zone",
        driver: { name: "Michael Brown", license: "DL-987654" }
      }
    },
    {
      id: "APL-2023-0021",
      offenseId: "OFF-2023-0387",
      submittedDate: "2023-05-15",
      driver: { 
        name: "Robert Taylor", 
        license: "DL-789456",
        licenseStatus: "Suspended"
      },
      reason: "Parking signs were obscured by construction equipment",
      evidence: ["sign_photo.jpg", "construction_permit.pdf"],
      status: "Rejected",
      reviewDueDate: "2023-05-25",
      officerNotes: "Signs were visible from other angles, violation stands",
      offenseDetails: {
        id: "OFF-2023-0387",
        type: "Illegal Parking",
        date: "2023-05-05",
        fine: 75.0,
        status: "Under Appeal",
        description: "Parked in no-parking zone during rush hour",
        driver: { name: "Robert Taylor", license: "DL-789456" }
      }
    },
    {
      id: "APL-2023-0020",
      offenseId: "OFF-2023-0356",
      submittedDate: "2023-05-12",
      driver: { 
        name: "Sarah Johnson", 
        license: "DL-321654",
        licenseStatus: "Active"
      },
      reason: "Emergency situation requiring quick stop",
      evidence: ["medical_report.pdf"],
      status: "Under Review",
      reviewDueDate: "2023-05-22",
      officerNotes: "Need to verify medical documentation",
      offenseDetails: {
        id: "OFF-2023-0356",
        type: "Lane Violation",
        date: "2023-05-01",
        fine: 125.0,
        status: "Under Appeal",
        description: "Improper lane change without signaling",
        driver: { name: "Sarah Johnson", license: "DL-321654" }
      }
    }
  ];

  // Filter appeals based on search and filters
  const filteredAppeals: Appeal[] = appeals.filter((appeal) => {
    const matchesSearch =
      appeal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.offenseId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getAppealStatusColor = (status: Appeal["status"]): string => {
    switch (status) {
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

  const getOffenseStatusColor = (status: Offense["status"]): string => {
    switch (status) {
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Under Appeal":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Paid":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Overdue":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const toggleAppealExpansion = (appealId: string) => {
    setExpandedAppeals(prev => ({
      ...prev,
      [appealId]: !prev[appealId]
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Calculate statistics
  const totalAppeals = appeals.length;
  const underReview = appeals.filter(a => a.status === "Under Review").length;
  const approved = appeals.filter(a => a.status === "Approved").length;
  const rejected = appeals.filter(a => a.status === "Rejected").length;

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
                Review and process all appeal cases
              </p>
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
                <Shield className="h-6 w-6 text-red-600" />
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
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Appeals List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Appeal Cases ({filteredAppeals.length})
            </h3>
          </div>

          <div className="space-y-4">
            {filteredAppeals.map((appeal) => (
              <div 
                key={appeal.id} 
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleAppealExpansion(appeal.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-[#0A2540]">
                        Appeal #{appeal.id}
                      </h4>
                      <p className="text-gray-600">
                        For Offense #{appeal.offenseId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getAppealStatusColor(appeal.status)}`}>
                        {appeal.status}
                      </span>
                      {expandedAppeals[appeal.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedAppeals[appeal.id] && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Driver</h5>
                        <p className="text-[#0A2540] font-medium">
                          {appeal.driver.name} (DL: {appeal.driver.license})
                        </p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Submitted</h5>
                        <p className="text-[#0A2540] font-medium">{appeal.submittedDate}</p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Review Due</h5>
                        <p className="text-[#0A2540] font-medium">{appeal.reviewDueDate}</p>
                      </div>
                      <div>
                        <h5 className="text-gray-600 text-sm mb-2">Offense Type</h5>
                        <p className="text-[#0A2540] font-medium">{appeal.offenseDetails.type}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-gray-600 text-sm mb-2">Reason for Appeal</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{appeal.reason}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-gray-600 text-sm mb-2">Supporting Evidence</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        {appeal.evidence.map((file, index) => (
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

                    {appeal.officerNotes && (
                      <div className="mb-6">
                        <h5 className="text-gray-600 text-sm mb-2">Officer Notes</h5>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{appeal.officerNotes}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setSelectedAppeal(appeal)}
                        className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Ticket className="h-4 w-4" />
                        <span>View Full Details</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOffense(appeal.offenseDetails);
                          setSelectedAppeal(null);
                        }}
                        className="bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>View Driver Record</span>
                      </button>

                      <button
                        onClick={() => {
                          // Handle quick decision
                          console.log("Quick decision for:", appeal.id);
                        }}
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
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Appeal Review
              </h2>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">
                Appeal #{selectedAppeal.id}
              </h3>
              <p className="text-gray-600">
                For Offense #{selectedAppeal.offenseId}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedAppeal.driver.name} (DL: {selectedAppeal.driver.license})
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Submitted</h4>
                <p className="text-[#0A2540] font-semibold">{selectedAppeal.submittedDate}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getAppealStatusColor(selectedAppeal.status)}`}>
                  {selectedAppeal.status}
                </span>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Review Due</h4>
                <p className="text-[#0A2540] font-semibold">{selectedAppeal.reviewDueDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Original Offense</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-[#0A2540] font-medium">
                      {selectedAppeal.offenseDetails.type}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {selectedAppeal.offenseDetails.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0A2540] font-semibold">
                      ${selectedAppeal.offenseDetails.fine.toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getOffenseStatusColor(selectedAppeal.offenseDetails.status)}`}>
                      {selectedAppeal.offenseDetails.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  {selectedAppeal.offenseDetails.description}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Reason for Appeal</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedAppeal.reason}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Supporting Evidence</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedAppeal.evidence.map((file, index) => (
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

            {selectedAppeal.officerNotes && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Officer Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedAppeal.officerNotes}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Decision</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  className="bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                  onClick={() => {
                    // Handle approve appeal
                    console.log("Approve appeal:", selectedAppeal.id);
                    setSelectedAppeal(null);
                  }}
                >
                  Approve Appeal
                </button>
                <button
                  className="bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  onClick={() => {
                    // Handle reject appeal
                    console.log("Reject appeal:", selectedAppeal.id);
                    setSelectedAppeal(null);
                  }}
                >
                  Reject Appeal
                </button>
                <button
                  className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                  onClick={() => {
                    // Handle request more info
                    console.log("Request more info for:", selectedAppeal.id);
                    setSelectedAppeal(null);
                  }}
                >
                  Request More Info
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedOffense(selectedAppeal.offenseDetails);
                  setSelectedAppeal(null);
                }}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View Original Offense
              </button>

              <button
                onClick={() => setSelectedAppeal(null)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offense Details Modal */}
      {selectedOffense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Offense Details
              </h2>
              <button
                onClick={() => {
                  setSelectedOffense(null);
                  // Return to appeal if it was the source
                  if (selectedAppeal) setSelectedAppeal(selectedAppeal);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">
                {selectedOffense.type}
              </h3>
              <p className="text-gray-600">#{selectedOffense.id}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Date</h4>
                <p className="text-[#0A2540] font-semibold">{selectedOffense.date}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedOffense.driver.name} (DL: {selectedOffense.driver.license})
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                <p className="text-2xl font-bold text-[#0A2540]">
                  ${selectedOffense.fine.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getOffenseStatusColor(selectedOffense.status)}`}>
                  {selectedOffense.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Description</h4>
              <p className="text-gray-700">{selectedOffense.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Find the related appeal
                  const relatedAppeal = appeals.find(a => a.offenseId === selectedOffense.id);
                  if (relatedAppeal) {
                    setSelectedAppeal(relatedAppeal);
                    setSelectedOffense(null);
                  }
                }}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                View Appeal
              </button>

              <button
                onClick={() => setSelectedOffense(null)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerAppealsPage;