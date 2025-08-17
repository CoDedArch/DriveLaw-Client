"use client"

import React, { useState } from "react";
import {
  Search,
  Filter,
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
} from "lucide-react";

// Type definitions
interface Driver {
  name: string;
  license: string;
  totalOffenses?: number;
  openFines?: number | null;
  licenseStatus?: "Active" | "Suspended" | "Revoked";
}

interface Offense {
  id: string;
  date: string;
  time: string;
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
  officerNotes: string;
}

type StatusFilter = "all" | "Pending Payment" | "Under Appeal" | "Paid" | "Overdue";
type SeverityFilter = "all" | "high" | "medium" | "low";
type TypeFilter = "all" | "Speeding" | "Red Light Violation" | "Illegal Parking" | "Lane Violation";

const OfficerOffensesPage = () => {
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // Mock data - in real app, this would come from API
  const offenses: Offense[] = [
    {
      id: "OFF-2023-0456",
      date: "2023-05-15",
      time: "14:30",
      type: "Speeding",
      licensePlate: "ABC-1234",
      driver: { name: "Michael Brown", license: "DL-987654", totalOffenses: 3, openFines: 150.0, licenseStatus: "Active" },
      location: "Main St & 5th Ave",
      fine: 150.0,
      status: "Pending Payment",
      description: "Exceeded speed limit by 25mph in school zone",
      evidence: ["speed_cam_0456.jpg", "radar_reading_0456.pdf"],
      dueDate: "2023-06-14",
      severity: "high",
      officerNotes: "School zone was active at time of violation. Multiple children present.",
    },
    {
      id: "OFF-2023-0455",
      date: "2023-05-14",
      time: "09:15",
      type: "Red Light Violation",
      licensePlate: "XYZ-7890",
      driver: { name: "Jessica Wilson", license: "DL-456123", totalOffenses: 1, openFines: 200.0, licenseStatus: "Active" },
      location: "Oak St & Pine Ave",
      fine: 200.0,
      status: "Under Appeal",
      description: "Ran red light, nearly caused collision",
      evidence: ["intersection_cam_0455.mp4", "witness_statement.pdf"],
      dueDate: "2023-06-13",
      severity: "high",
      officerNotes: "Multiple violations at this intersection recently. Driver claims light malfunction.",
    },
    {
      id: "OFF-2023-0454",
      date: "2023-05-12",
      time: "18:45",
      type: "Illegal Parking",
      licensePlate: "DEF-4567",
      driver: { name: "Robert Taylor", license: "DL-789456", totalOffenses: 5, openFines: 0.0, licenseStatus: "Suspended" },
      location: "100 Block Market St",
      fine: 75.0,
      status: "Paid",
      description: "Parked in no-parking zone during rush hour",
      evidence: ["parking_0454.jpg"],
      dueDate: "2023-06-11",
      severity: "low",
      officerNotes: "Vehicle blocking bus stop during peak hours.",
    },
    {
      id: "OFF-2023-0453",
      date: "2023-05-10",
      time: "22:15",
      type: "Lane Violation",
      licensePlate: "GHI-7891",
      driver: { name: "Sarah Johnson", license: "DL-321654", totalOffenses: 2, openFines: 125.0, licenseStatus: "Active" },
      location: "Highway 101 North",
      fine: 125.0,
      status: "Overdue",
      description: "Improper lane change without signaling",
      evidence: ["highway_cam_0453.mp4"],
      dueDate: "2023-05-25",
      severity: "medium",
      officerNotes: "Heavy traffic conditions. Dangerous maneuver.",
    },
    {
      id: "OFF-2023-0452",
      date: "2023-05-08",
      time: "16:20",
      type: "Speeding",
      licensePlate: "JKL-1122",
      driver: { name: "David Chen", license: "DL-159753", totalOffenses: 1, openFines: 0.0, licenseStatus: "Active" },
      location: "Elm Street",
      fine: 100.0,
      status: "Paid",
      description: "Exceeded speed limit by 15mph in residential area",
      evidence: ["speed_cam_0452.jpg"],
      dueDate: "2023-06-07",
      severity: "medium",
      officerNotes: "First-time offender. Residential area with children playing nearby.",
    }
  ];

  // Filter offenses based on search and filters
  const filteredOffenses: Offense[] = offenses.filter((offense) => {
    const matchesSearch =
      offense.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offense.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || offense.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || offense.severity === severityFilter;
    const matchesType = typeFilter === "all" || offense.type === typeFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: Offense["severity"]): string => {
    switch (severity) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getStatusBadgeClasses = (status: Offense["status"]): string => {
    switch (status) {
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Paid":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Under Appeal":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Overdue":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const handleApplyFilters = () => {
    // In real app, this would trigger a new API call
    console.log("Applying filters:", { statusFilter, severityFilter, typeFilter, searchQuery });
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
                Monitor and manage all traffic violations
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
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
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
                <p className="text-2xl font-bold text-blue-600">{underAppeal}</p>
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
                <p className="text-2xl font-bold text-red-600">{overdue}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-red-600" />
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
              onClick={handleApplyFilters}
              className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Apply</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Offenses List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Traffic Offenses ({filteredOffenses.length})
            </h3>
          </div>

          <div className="space-y-4">
            {filteredOffenses.map((offense) => (
              <div
                key={offense.id}
                className={`border-l-4 ${getSeverityColor(
                  offense.severity
                )} border border-gray-200 rounded-r-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setSelectedOffense(offense)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-[#0A2540] font-semibold text-lg">
                        {offense.type}
                      </h4>
                      <span className="text-gray-500 text-sm">
                        #{offense.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(
                          offense.status
                        )}`}
                      >
                        {offense.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{offense.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Driver</p>
                        <p className="text-gray-900">
                          {offense.driver.name} ({offense.driver.license})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Vehicle</p>
                        <p className="text-gray-900">{offense.licensePlate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Location</p>
                        <p className="text-gray-900">{offense.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0A2540]">
                      ${offense.fine.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {offense.date} at {offense.time}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Due: {offense.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">
                      {offense.evidence.length} evidence file(s)
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDriver(offense.driver);
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>View Driver</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit offense
                        console.log("Edit offense:", offense.id);
                      }}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download evidence
                        console.log("Download evidence for:", offense.id);
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

            <div className={`border-l-4 ${getSeverityColor(selectedOffense.severity)} pl-4 mb-6`}>
              <h3 className="text-xl font-bold text-[#0A2540]">
                {selectedOffense.type}
              </h3>
              <p className="text-gray-600">#{selectedOffense.id}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Date & Time</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedOffense.date} at {selectedOffense.time}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Location</h4>
                <p className="text-[#0A2540] font-semibold">{selectedOffense.location}</p>
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
                <h4 className="text-gray-600 text-sm mb-2">Fine Amount</h4>
                <p className="text-2xl font-bold text-[#0A2540]">
                  ${selectedOffense.fine.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(
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

            {selectedOffense.officerNotes && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Officer Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedOffense.officerNotes}</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-gray-600 text-sm mb-2">Evidence</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedOffense.evidence.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-gray-600" />
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
                  setSelectedDriver(selectedOffense.driver);
                  setSelectedOffense(null);
                }}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View Driver Record
              </button>

              <button
                onClick={() => {
                  // Handle edit offense
                  console.log("Edit offense:", selectedOffense.id);
                }}
                className="bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                Edit Offense
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

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">Driver Record</h2>
              <button
                onClick={() => setSelectedDriver(null)}
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
                  {selectedDriver.name}
                </h3>
                <p className="text-gray-600">
                  License: {selectedDriver.license}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">License Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedDriver.licenseStatus === "Active"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : selectedDriver.licenseStatus === "Suspended"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {selectedDriver.licenseStatus}
                </span>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Total Offenses</h4>
                <p className="text-[#0A2540] font-semibold">{selectedDriver.totalOffenses}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Open Fines</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedDriver?.openFines && selectedDriver.openFines > 0
                    ? `$${selectedDriver.openFines.toFixed(2)}`
                    : "None"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-bold text-[#0A2540] mb-4">
                Recent Offenses
              </h4>
              <div className="space-y-3">
                {offenses
                  .filter((o) => o.driver.license === selectedDriver.license)
                  .slice(0, 3)
                  .map((offense) => (
                    <div
                      key={offense.id}
                      className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedOffense(offense);
                        setSelectedDriver(null);
                      }}
                    >
                      <div>
                        <p className="text-[#0A2540] font-medium">{offense.type}</p>
                        <p className="text-gray-600 text-sm">{offense.date} at {offense.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClasses(offense.status)}`}>
                          {offense.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedDriver(null)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle view full driver history
                  console.log("View full history for:", selectedDriver.license);
                }}
                className="bg-[#0052CC] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                View Full History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerOffensesPage;