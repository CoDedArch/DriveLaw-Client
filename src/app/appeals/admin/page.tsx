"use client"

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
  User,
  Calendar,
  Scale,
} from "lucide-react";

// Type definitions
interface Officer {
  id: string;
  name: string;
}

interface Driver {
  name: string;
  license: string;
  email: string;
  phone: string;
}

interface Offense {
  id: string;
  type: string;
  date: string;
  location: string;
  fine: number;
  description: string;
}

interface Appeal {
  id: string;
  offenseId: string;
  offense: Offense;
  driver: Driver;
  submittedDate: string;
  status: "Under Review" | "Approved" | "Rejected" | "Pending Review";
  assignedTo: Officer;
  priority: "high" | "medium" | "low";
  reason: string;
  evidence: string[];
  reviewNotes?: string;
  reviewDate?: string;
  dueDate: string;
}

type StatusFilter = "all" | "Under Review" | "Approved" | "Rejected" | "Pending Review";
type PriorityFilter = "all" | "high" | "medium" | "low";
type ReviewDecision = "approved" | "rejected";

const AdminAppealsPage = () => {
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>("");

  // Mock data - in real app, this would come from API
  const appeals: Appeal[] = [
    {
      id: "APL-2023-0056",
      offenseId: "OFF-2023-0455",
      offense: {
        id: "OFF-2023-0455",
        type: "Red Light Violation",
        date: "2023-05-14",
        location: "Oak St & Pine Ave",
        fine: 200.0,
        description: "Ran red light, nearly caused collision"
      },
      driver: {
        name: "Jessica Wilson",
        license: "DL-456123",
        email: "jessica.wilson@email.com",
        phone: "(555) 123-4567"
      },
      submittedDate: "2023-05-20",
      status: "Under Review",
      assignedTo: { id: "USR-001", name: "Sarah Johnson" },
      priority: "high",
      reason: "Traffic light was malfunctioning at the time of the incident. I have dashcam footage showing the light was stuck on yellow.",
      evidence: ["dashcam_footage_may14.mp4", "traffic_light_report.pdf"],
      dueDate: "2023-06-19",
    },
    {
      id: "APL-2023-0055",
      offenseId: "OFF-2023-0450",
      offense: {
        id: "OFF-2023-0450",
        type: "Speeding",
        date: "2023-05-10",
        location: "Highway 101 North",
        fine: 150.0,
        description: "Exceeded speed limit by 20mph"
      },
      driver: {
        name: "Michael Rodriguez",
        license: "DL-789012",
        email: "m.rodriguez@email.com",
        phone: "(555) 987-6543"
      },
      submittedDate: "2023-05-18",
      status: "Approved",
      assignedTo: { id: "USR-002", name: "David Miller" },
      priority: "medium",
      reason: "Medical emergency - was rushing sick child to hospital. Have hospital admission records.",
      evidence: ["hospital_admission.pdf", "emergency_dispatch.wav"],
      reviewNotes: "Verified hospital admission. Emergency circumstances justify dismissal.",
      reviewDate: "2023-05-25",
      dueDate: "2023-06-17",
    },
    {
      id: "APL-2023-0054",
      offenseId: "OFF-2023-0448",
      offense: {
        id: "OFF-2023-0448",
        type: "Illegal Parking",
        date: "2023-05-08",
        location: "100 Block Market St",
        fine: 75.0,
        description: "Parked in no-parking zone during rush hour"
      },
      driver: {
        name: "Sarah Chen",
        license: "DL-345678",
        email: "sarah.chen@email.com",
        phone: "(555) 456-7890"
      },
      submittedDate: "2023-05-16",
      status: "Rejected",
      assignedTo: { id: "USR-003", name: "Lisa Wong" },
      priority: "low",
      reason: "The no-parking sign was not clearly visible due to tree branches blocking it.",
      evidence: ["parking_photo_branch.jpg"],
      reviewNotes: "Sign was visible from driver position. Tree obstruction minimal.",
      reviewDate: "2023-05-23",
      dueDate: "2023-06-15",
    },
    {
      id: "APL-2023-0053",
      offenseId: "OFF-2023-0445",
      offense: {
        id: "OFF-2023-0445",
        type: "Lane Violation",
        date: "2023-05-05",
        location: "Main St Bridge",
        fine: 125.0,
        description: "Improper lane change without signaling"
      },
      driver: {
        name: "Robert Taylor",
        license: "DL-901234",
        email: "r.taylor@email.com",
        phone: "(555) 321-0987"
      },
      submittedDate: "2023-05-14",
      status: "Pending Review",
      assignedTo: { id: "USR-001", name: "Sarah Johnson" },
      priority: "medium",
      reason: "Vehicle malfunction caused signal failure. Mechanic report shows turn signal was not working.",
      evidence: ["mechanic_report.pdf", "repair_invoice.pdf"],
      dueDate: "2023-06-13",
    },
  ];

  // Filter appeals based on search and filters
  const filteredAppeals: Appeal[] = appeals.filter((appeal) => {
    const matchesSearch =
      appeal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.offenseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.offense.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || appeal.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Appeal["status"]): string => {
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

  const getPriorityColor = (priority: Appeal["priority"]): string => {
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const handleReviewAppeal = (decision: "approved" | "rejected") => {
    if (!selectedAppeal) return;
    
    // In real implementation, this would call an API
    console.log(`Appeal ${selectedAppeal.id} ${decision}:`, reviewNotes);
    setShowReviewModal(false);
    setReviewDecision(null);
    setReviewNotes("");
    setSelectedAppeal(null);
  };

  // Calculate statistics
  const totalAppeals = appeals.length;
  const underReview = appeals.filter(a => a.status === "Under Review").length;
  const pendingReview = appeals.filter(a => a.status === "Pending Review").length;
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
                <p className="text-2xl font-bold text-[#0A2540]">{totalAppeals}</p>
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
                <p className="text-2xl font-bold text-orange-600">{pendingReview}</p>
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
                <p className="text-2xl font-bold text-blue-600">{underReview}</p>
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
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            >
              <option value="all">All Priorities</option>
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
        </div>

        {/* Appeals Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Appeal Cases ({filteredAppeals.length})
            </h3>
            <button className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
          </div>

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
                {filteredAppeals.map((appeal) => (
                  <tr
                    key={appeal.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAppeal(appeal)}
                  >
                    <td className="py-4 text-gray-700">#{appeal.id}</td>
                    <td className="py-4 text-gray-700">
                      <div>
                        <p className="font-medium">{appeal.offense.type}</p>
                        <p className="text-sm text-gray-500">#{appeal.offenseId}</p>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">
                      <div>
                        <p className="font-medium">{appeal.driver.name}</p>
                        <p className="text-sm text-gray-500">{appeal.driver.license}</p>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">{appeal.submittedDate}</td>
                    <td className="py-4 text-gray-700">{appeal.assignedTo.name}</td>
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
                    <td className="py-4 text-gray-700">{appeal.dueDate}</td>
                    <td className="py-4 text-right">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAppeals.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Appeal Information */}
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                    Appeal #{selectedAppeal.id}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        selectedAppeal.status
                      )}`}
                    >
                      {selectedAppeal.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                        selectedAppeal.priority
                      )}`}
                    >
                      {selectedAppeal.priority} priority
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Submitted Date</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedAppeal.submittedDate}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Due Date</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedAppeal.dueDate}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Assigned Officer</h4>
                    <p className="text-[#0A2540] font-semibold">
                      {selectedAppeal.assignedTo.name}
                    </p>
                  </div>
                  {selectedAppeal.reviewDate && (
                    <div>
                      <h4 className="text-gray-600 text-sm mb-2">Review Date</h4>
                      <p className="text-[#0A2540] font-semibold">{selectedAppeal.reviewDate}</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Driver Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-[#0A2540] font-semibold">{selectedAppeal.driver.name}</p>
                    <p className="text-gray-600">License: {selectedAppeal.driver.license}</p>
                    <p className="text-gray-600">Email: {selectedAppeal.driver.email}</p>
                    <p className="text-gray-600">Phone: {selectedAppeal.driver.phone}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Appeal Reason</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedAppeal.reason}</p>
                  </div>
                </div>

                {selectedAppeal.reviewNotes && (
                  <div className="mb-6">
                    <h4 className="text-gray-600 text-sm mb-2">Review Notes</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{selectedAppeal.reviewNotes}</p>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Evidence Submitted</h4>
                  <div className="space-y-2">
                    {selectedAppeal.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
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
                        {selectedAppeal.offense.type}
                      </h4>
                    </div>
                    <p className="text-red-700 mb-3">{selectedAppeal.offense.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-red-600 text-sm">Offense ID</p>
                        <p className="text-red-800 font-medium">#{selectedAppeal.offense.id}</p>
                      </div>
                      <div>
                        <p className="text-red-600 text-sm">Date</p>
                        <p className="text-red-800 font-medium">{selectedAppeal.offense.date}</p>
                      </div>
                      <div>
                        <p className="text-red-600 text-sm">Location</p>
                        <p className="text-red-800 font-medium">{selectedAppeal.offense.location}</p>
                      </div>
                      <div>
                        <p className="text-red-600 text-sm">Fine Amount</p>
                        <p className="text-red-800 font-medium">${selectedAppeal.offense.fine.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons for appeals under review */}
                {(selectedAppeal.status === "Under Review" || selectedAppeal.status === "Pending Review") && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Scale className="h-5 w-5 text-blue-600" />
                        <h4 className="text-blue-800 font-medium">Review Actions</h4>
                      </div>
                      <p className="text-blue-700 text-sm mb-4">
                        Carefully review all evidence and driver statements before making a decision.
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
      {showReviewModal && selectedAppeal && (
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
                {reviewDecision === "approved" ? "Approve Appeal" : "Reject Appeal"}
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
               onClick={() => reviewDecision && handleReviewAppeal(reviewDecision)}
                className={`${
                  reviewDecision === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
              >
                Confirm {reviewDecision === "approved" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppealsPage;