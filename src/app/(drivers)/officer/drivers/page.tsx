"use client"

import React, { useState } from "react";
import {
  Search,
  User,
  Shield,
  RefreshCw,
  ChevronRight,
  X,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Download,
  Camera,
} from "lucide-react";

// Type definitions
interface Driver {
  name: string;
  license: string;
  totalOffenses?: number;
  openFines?: number | null;
  licenseStatus?: "Active" | "Suspended" | "Revoked";
  lastOffenseDate?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
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

type LicenseStatusFilter = "all" | "Active" | "Suspended" | "Revoked";

const OfficerDriversPage = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<LicenseStatusFilter>("all");

  // Mock data - in real app, this would come from API
  const drivers: Driver[] = [
    {
      name: "Michael Brown",
      license: "DL-987654",
      totalOffenses: 3,
      openFines: 150.0,
      licenseStatus: "Active",
      lastOffenseDate: "2023-05-15",
      contactNumber: "(555) 123-4567",
      email: "michael.brown@example.com",
      address: "123 Main St, Anytown, USA",
    },
    {
      name: "Jessica Wilson",
      license: "DL-456123",
      totalOffenses: 1,
      openFines: 200.0,
      licenseStatus: "Active",
      lastOffenseDate: "2023-05-14",
      contactNumber: "(555) 234-5678",
      email: "jessica.wilson@example.com",
      address: "456 Oak Ave, Somewhere, USA",
    },
    {
      name: "Robert Taylor",
      license: "DL-789456",
      totalOffenses: 5,
      openFines: 0.0,
      licenseStatus: "Suspended",
      lastOffenseDate: "2023-05-12",
      contactNumber: "(555) 345-6789",
      email: "robert.taylor@example.com",
      address: "789 Market St, Nowhere, USA",
    },
    {
      name: "Sarah Johnson",
      license: "DL-321654",
      totalOffenses: 2,
      openFines: 125.0,
      licenseStatus: "Active",
      lastOffenseDate: "2023-05-10",
      contactNumber: "(555) 456-7890",
      email: "sarah.johnson@example.com",
      address: "321 Elm St, Anywhere, USA",
    },
    {
      name: "David Chen",
      license: "DL-159753",
      totalOffenses: 1,
      openFines: 0.0,
      licenseStatus: "Revoked",
      lastOffenseDate: "2023-05-08",
      contactNumber: "(555) 567-8901",
      email: "david.chen@example.com",
      address: "159 Pine Rd, Everywhere, USA",
    },
  ];

  const offenses: Offense[] = [
    {
      id: "OFF-2023-0456",
      date: "2023-05-15",
      time: "14:30",
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
      officerNotes: "School zone was active at time of violation. Multiple children present.",
    },
    {
      id: "OFF-2023-0455",
      date: "2023-05-14",
      time: "09:15",
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
      officerNotes: "Multiple violations at this intersection recently. Driver claims light malfunction.",
    },
    {
      id: "OFF-2023-0454",
      date: "2023-05-12",
      time: "18:45",
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
      officerNotes: "Vehicle blocking bus stop during peak hours.",
    },
    {
      id: "OFF-2023-0453",
      date: "2023-05-10",
      time: "22:15",
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
      officerNotes: "Heavy traffic conditions. Dangerous maneuver.",
    },
    {
      id: "OFF-2023-0452",
      date: "2023-05-08",
      time: "16:20",
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
      officerNotes: "First-time offender. Residential area with children playing nearby.",
    }
  ];

  // Filter drivers based on search and filters
  const filteredDrivers: Driver[] = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || driver.licenseStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getLicenseStatusColor = (status: Driver["licenseStatus"]): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Revoked":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Calculate statistics
  const totalDrivers = drivers.length;
  const activeLicenses = drivers.filter(d => d.licenseStatus === "Active").length;
  const suspendedLicenses = drivers.filter(d => d.licenseStatus === "Suspended").length;
  const revokedLicenses = drivers.filter(d => d.licenseStatus === "Revoked").length;

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
                Driver Management
              </h1>
              <p className="text-gray-600">
                View and manage all driver records
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
                <p className="text-gray-600 text-sm">Total Drivers</p>
                <p className="text-2xl font-bold text-[#0A2540]">{totalDrivers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Licenses</p>
                <p className="text-2xl font-bold text-green-600">{activeLicenses}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Suspended Licenses</p>
                <p className="text-2xl font-bold text-yellow-600">{suspendedLicenses}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revoked Licenses</p>
                <p className="text-2xl font-bold text-red-600">{revokedLicenses}</p>
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
                placeholder="Search by name or license number..."
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LicenseStatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Revoked">Revoked</option>
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

        {/* Drivers List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Driver Records ({filteredDrivers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="pb-4 font-medium">Driver</th>
                  <th className="pb-4 font-medium">License</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Offenses</th>
                  <th className="pb-4 font-medium text-right">Open Fines</th>
                  <th className="pb-4 font-medium">Last Offense</th>
                  <th className="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.license}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <td className="py-4 font-medium text-[#0A2540]">
                      {driver.name}
                    </td>
                    <td className="py-4 text-gray-700">{driver.license}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getLicenseStatusColor(
                          driver.licenseStatus
                        )}`}
                      >
                        {driver.licenseStatus}
                      </span>
                    </td>
                    <td className="py-4 text-gray-700">{driver.totalOffenses}</td>
                    <td className="py-4 text-right text-gray-700">
                      {driver.openFines && driver.openFines > 0
                        ? `$${driver.openFines.toFixed(2)}`
                        : "None"}
                    </td>
                    <td className="py-4 text-gray-700">
                      {driver.lastOffenseDate || "None"}
                    </td>
                    <td className="py-4 text-right">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDrivers.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No drivers found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Driver Record
              </h2>
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
                  className={`px-3 py-1 rounded-full text-sm ${getLicenseStatusColor(
                    selectedDriver.licenseStatus
                  )}`}
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
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Last Offense</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedDriver.lastOffenseDate || "None"}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Contact Number</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedDriver.contactNumber || "Not provided"}
                </p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Email</h4>
                <p className="text-[#0A2540] font-semibold">
                  {selectedDriver.email || "Not provided"}
                </p>
              </div>
            </div>

            {selectedDriver.address && (
              <div className="mb-6">
                <h4 className="text-gray-600 text-sm mb-2">Address</h4>
                <p className="text-[#0A2540] font-semibold">{selectedDriver.address}</p>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-xl font-bold text-[#0A2540] mb-4">
                Recent Offenses
              </h4>
              <div className="space-y-4">
                {offenses
                  .filter((o) => o.driver.license === selectedDriver.license)
                  .slice(0, 3)
                  .map((offense) => (
                    <div
                      key={offense.id}
                      className={`border-l-4 ${getSeverityColor(
                        offense.severity
                      )} border border-gray-200 rounded-r-lg p-4 hover:bg-gray-50 cursor-pointer`}
                      onClick={() => {
                        setSelectedOffense(offense);
                        setSelectedDriver(null);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-[#0A2540] font-medium">
                            {offense.type}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {offense.date} at {offense.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#0A2540] font-semibold">
                            ${offense.fine.toFixed(2)}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClasses(
                              offense.status
                            )}`}
                          >
                            {offense.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  // Handle update license status
                  console.log("Update license status for:", selectedDriver.license);
                }}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Update Status
              </button>

              <button
                onClick={() => {
                  // Handle view full history
                  console.log("View full history for:", selectedDriver.license);
                }}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                View Full History
              </button>

              <button
                onClick={() => setSelectedDriver(null)}
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
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Offense Details
              </h2>
              <button
                onClick={() => {
                  setSelectedOffense(null);
                  setSelectedDriver(selectedOffense.driver);
                }}
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
                Back to Driver
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
                onClick={() => {
                  setSelectedOffense(null);
                  setSelectedDriver(selectedOffense.driver);
                }}
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

export default OfficerDriversPage;