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
} from "lucide-react";

// Type definitions
interface Officer {
  id: string;
  name: string;
}

interface Driver {
  name: string;
  license: string;
}

interface Offense {
  id: string;
  date: string;
  officer: Officer;
  type: string;
  licensePlate: string;
  driver: Driver;
  location: string;
  fine: number;
  status: "Pending Payment" | "Under Appeal" | "Paid" | "Overdue";
  description: string;
  evidence: string[];
  dueDate: string;
  severity: "high" | "medium" | "low";
}

type StatusFilter = "all" | "Pending Payment" | "Under Appeal" | "Paid" | "Overdue";
type SeverityFilter = "all" | "high" | "medium" | "low";
type TypeFilter = "all" | "Speeding" | "Red Light Violation" | "Illegal Parking" | "Lane Violation";

const AdminOffensesPage = () => {
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // Mock data - in real app, this would come from API
  const offenses: Offense[] = [
    {
      id: "OFF-2023-0456",
      date: "2023-05-15",
      officer: { id: "USR-001", name: "Sarah Johnson" },
      type: "Speeding",
      licensePlate: "ABC-1234",
      driver: { name: "Michael Brown", license: "DL-987654" },
      location: "Main St & 5th Ave",
      fine: 150.0,
      status: "Pending Payment",
      description: "Exceeded speed limit by 25mph in school zone",
      evidence: ["speed_cam_0456.jpg", "radar_reading_0456.pdf"],
      dueDate: "2023-06-14",
      severity: "high",
    },
    {
      id: "OFF-2023-0455",
      date: "2023-05-14",
      officer: { id: "USR-002", name: "David Miller" },
      type: "Red Light Violation",
      licensePlate: "XYZ-7890",
      driver: { name: "Jessica Wilson", license: "DL-456123" },
      location: "Oak St & Pine Ave",
      fine: 200.0,
      status: "Under Appeal",
      description: "Ran red light, nearly caused collision",
      evidence: ["intersection_cam_0455.mp4", "witness_statement.pdf"],
      dueDate: "2023-06-13",
      severity: "high",
    },
    {
      id: "OFF-2023-0454",
      date: "2023-05-12",
      officer: { id: "USR-001", name: "Sarah Johnson" },
      type: "Illegal Parking",
      licensePlate: "DEF-4567",
      driver: { name: "Robert Taylor", license: "DL-789456" },
      location: "100 Block Market St",
      fine: 75.0,
      status: "Paid",
      description: "Parked in no-parking zone during rush hour",
      evidence: ["parking_0454.jpg"],
      dueDate: "2023-06-11",
      severity: "low",
    },
    {
      id: "OFF-2023-0453",
      date: "2023-05-10",
      officer: { id: "USR-003", name: "Lisa Wong" },
      type: "Lane Violation",
      licensePlate: "GHI-7891",
      driver: { name: "Sarah Johnson", license: "DL-321654" },
      location: "Highway 101 North",
      fine: 125.0,
      status: "Overdue",
      description: "Improper lane change without signaling",
      evidence: ["highway_cam_0453.mp4"],
      dueDate: "2023-05-25",
      severity: "medium",
    },
    {
      id: "OFF-2023-0452",
      date: "2023-05-08",
      officer: { id: "USR-002", name: "David Miller" },
      type: "Speeding",
      licensePlate: "JKL-1122",
      driver: { name: "David Chen", license: "DL-159753" },
      location: "Elm Street",
      fine: 100.0,
      status: "Paid",
      description: "Exceeded speed limit by 15mph in residential area",
      evidence: ["speed_cam_0452.jpg"],
      dueDate: "2023-06-07",
      severity: "medium",
    },
  ];

  // Filter offenses based on search and filters
  const filteredOffenses: Offense[] = offenses.filter((offense) => {
    const matchesSearch =
      offense.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.officer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || offense.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || offense.severity === severityFilter;
    const matchesType = typeFilter === "all" || offense.type === typeFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const getStatusColor = (status: Offense["status"]): string => {
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

  const getSeverityColor = (severity: Offense["severity"]): string => {
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
  };

  // Calculate statistics
  const totalOffenses = offenses.length;
  const pendingPayments = offenses.filter(o => o.status === "Pending Payment").length;
  const underAppeal = offenses.filter(o => o.status === "Under Appeal").length;
  const overdue = offenses.filter(o => o.status === "Overdue").length;
  const paid = offenses.filter(o => o.status === "Paid").length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Offenses</p>
                <p className="text-2xl font-bold text-[#0A2540]">{totalOffenses}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
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
                <p className="text-2xl font-bold text-blue-600">{underAppeal}</p>
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
                <p className="text-2xl font-bold text-red-600">{overdue}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
        </div>

        {/* Offenses Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Traffic Offenses ({filteredOffenses.length})
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
                {filteredOffenses.map((offense) => (
                  <tr
                    key={offense.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOffense(offense)}
                  >
                    <td className="py-4 text-gray-700">#{offense.id}</td>
                    <td className="py-4 text-gray-700">{offense.date}</td>
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
                <h4 className="text-gray-600 text-sm mb-2">Location</h4>
                <p className="text-[#0A2540] font-semibold">{selectedOffense.location}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Officer</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedOffense.officer.name} (ID: {selectedOffense.officer.id})
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Driver</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedOffense.driver.name} (DL: {selectedOffense.driver.license})
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Vehicle</h4>
                <p className="text-[#0A2540] font-semibold">{selectedOffense.licensePlate}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Severity</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(
                    selectedOffense.severity
                  )}`}
                >
                  {selectedOffense.severity}
                </span>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                <p className="text-2xl font-bold text-[#0A2540]">
                  ${selectedOffense.fine.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedOffense.status
                  )}`}
                >
                  {selectedOffense.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-600 text-sm mb-2">Description</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedOffense.description}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-gray-600 text-sm mb-2">Evidence</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedOffense.evidence.map((file, index) => (
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
                onClick={() => {
                  // Handle edit offense
                  console.log("Edit offense:", selectedOffense.id);
                }}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                Edit Offense
              </button>

              {selectedOffense.status === "Pending Payment" && (
                <button
                  onClick={() => {
                    // Handle mark as paid
                    console.log("Mark as paid:", selectedOffense.id);
                  }}
                  className="bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                >
                  Mark as Paid
                </button>
              )}

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

export default AdminOffensesPage;