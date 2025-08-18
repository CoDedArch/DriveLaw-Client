"use client"

import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  ChevronRight,
  X,
  Download,
  User,
  FileText,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Car,
  BadgeCheck,
  BadgeX,
  Clock,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";

// Type definitions
interface Driver {
  id: string;
  name: string;
  license: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "Active" | "Suspended" | "Pending Verification";
  totalOffenses: number;
  totalFines: number;
  paidFines: number;
  outstandingFines: number;
  licenseExpiry: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    plate: string;
  };
}

interface Offense {
  id: string;
  type: string;
  date: string;
  fine: number;
  status: "Paid" | "Unpaid" | "Under Appeal";
}

type StatusFilter = "all" | "Active" | "Suspended" | "Pending Verification";

const AdminDriversPage = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedOffenses, setSelectedOffenses] = useState<Offense[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [licenseAction, setLicenseAction] = useState<"suspend" | "reinstate" | "">("");
  const [actionReason, setActionReason] = useState<string>("");

  // Mock data - in real app, this would come from API
  const drivers: Driver[] = [
    {
      id: "DRV-2023-001",
      name: "Michael Rodriguez",
      license: "DL-789012",
      email: "m.rodriguez@email.com",
      phone: "(555) 987-6543",
      registrationDate: "2022-03-15",
      status: "Active",
      totalOffenses: 2,
      totalFines: 350.0,
      paidFines: 350.0,
      outstandingFines: 0.0,
      licenseExpiry: "2025-03-15",
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        plate: "ABC1234",
      },
    },
    {
      id: "DRV-2023-002",
      name: "Jessica Wilson",
      license: "DL-456123",
      email: "jessica.wilson@email.com",
      phone: "(555) 123-4567",
      registrationDate: "2021-11-22",
      status: "Suspended",
      totalOffenses: 5,
      totalFines: 1250.0,
      paidFines: 750.0,
      outstandingFines: 500.0,
      licenseExpiry: "2024-11-22",
      vehicle: {
        make: "Honda",
        model: "Civic",
        year: 2019,
        plate: "XYZ5678",
      },
    },
    {
      id: "DRV-2023-003",
      name: "Sarah Chen",
      license: "DL-345678",
      email: "sarah.chen@email.com",
      phone: "(555) 456-7890",
      registrationDate: "2023-01-10",
      status: "Pending Verification",
      totalOffenses: 0,
      totalFines: 0.0,
      paidFines: 0.0,
      outstandingFines: 0.0,
      licenseExpiry: "2026-01-10",
    },
    {
      id: "DRV-2023-004",
      name: "Robert Taylor",
      license: "DL-901234",
      email: "r.taylor@email.com",
      phone: "(555) 321-0987",
      registrationDate: "2020-08-05",
      status: "Active",
      totalOffenses: 1,
      totalFines: 125.0,
      paidFines: 125.0,
      outstandingFines: 0.0,
      licenseExpiry: "2024-08-05",
      vehicle: {
        make: "Ford",
        model: "F-150",
        year: 2018,
        plate: "TRK2020",
      },
    },
  ];

  // Mock offenses data
  const offenses: Record<string, Offense[]> = {
    "DRV-2023-001": [
      {
        id: "OFF-2023-0450",
        type: "Speeding",
        date: "2023-05-10",
        fine: 150.0,
        status: "Paid",
      },
      {
        id: "OFF-2023-0488",
        type: "Illegal Parking",
        date: "2023-02-15",
        fine: 200.0,
        status: "Paid",
      },
    ],
    "DRV-2023-002": [
      {
        id: "OFF-2023-0455",
        type: "Red Light Violation",
        date: "2023-05-14",
        fine: 200.0,
        status: "Under Appeal",
      },
      {
        id: "OFF-2023-0472",
        type: "Speeding",
        date: "2023-04-01",
        fine: 250.0,
        status: "Unpaid",
      },
      {
        id: "OFF-2022-0399",
        type: "DUI",
        date: "2022-12-15",
        fine: 1000.0,
        status: "Paid",
      },
      {
        id: "OFF-2022-0376",
        type: "Reckless Driving",
        date: "2022-10-22",
        fine: 500.0,
        status: "Paid",
      },
      {
        id: "OFF-2022-0355",
        type: "No Insurance",
        date: "2022-09-05",
        fine: 300.0,
        status: "Unpaid",
      },
    ],
    "DRV-2023-004": [
      {
        id: "OFF-2023-0445",
        type: "Lane Violation",
        date: "2023-05-05",
        fine: 125.0,
        status: "Paid",
      },
    ],
  };

  // Filter drivers based on search and filters
  const filteredDrivers: Driver[] = drivers.filter((driver) => {
    const matchesSearch =
      driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Driver["status"]): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Suspended":
        return "bg-red-100 text-red-800 border border-red-300";
      case "Pending Verification":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleLicenseAction = (action: "suspend" | "reinstate") => {
    if (!selectedDriver) return;
    setLicenseAction(action);
    setActionReason("");
    setShowLicenseModal(true);
  };

  const confirmLicenseAction = () => {
    if (!selectedDriver || !licenseAction) return;
    
    // In real implementation, this would call an API
    console.log(`Driver ${selectedDriver.id} license ${licenseAction}:`, actionReason);
    setShowLicenseModal(false);
    setLicenseAction("");
    setActionReason("");
    setSelectedDriver(null);
  };

  const loadDriverOffenses = (driverId: string) => {
    // In real implementation, this would call an API
    setSelectedOffenses(offenses[driverId] || []);
  };

  // Calculate statistics
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === "Active").length;
  const suspendedDrivers = drivers.filter(d => d.status === "Suspended").length;
  const pendingDrivers = drivers.filter(d => d.status === "Pending Verification").length;

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
                View and manage registered drivers
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
                <p className="text-gray-600 text-sm">Active Drivers</p>
                <p className="text-2xl font-bold text-green-600">{activeDrivers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BadgeCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Suspended Drivers</p>
                <p className="text-2xl font-bold text-red-600">{suspendedDrivers}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <BadgeX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Verification</p>
                <p className="text-2xl font-bold text-orange-600">{pendingDrivers}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
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
                placeholder="Search by name, license, email, or phone..."
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
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Verification">Pending Verification</option>
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

        {/* Drivers Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Registered Drivers ({filteredDrivers.length})
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
                  <th className="pb-4 font-medium">Driver ID</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">License</th>
                  <th className="pb-4 font-medium">Contact</th>
                  <th className="pb-4 font-medium">Registered</th>
                  <th className="pb-4 font-medium">Offenses</th>
                  <th className="pb-4 font-medium">Fines</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedDriver(driver);
                      loadDriverOffenses(driver.id);
                    }}
                  >
                    <td className="py-4 text-gray-700">#{driver.id}</td>
                    <td className="py-4 text-gray-700 font-medium">{driver.name}</td>
                    <td className="py-4 text-gray-700">{driver.license}</td>
                    <td className="py-4 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{driver.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">{driver.registrationDate}</td>
                    <td className="py-4 text-gray-700">{driver.totalOffenses}</td>
                    <td className="py-4 text-gray-700">
                      <div>
                        <span className="font-medium">${driver.totalFines.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 block">${driver.outstandingFines.toFixed(2)} outstanding</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                          driver.status
                        )}`}
                      >
                        {driver.status}
                      </span>
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
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Driver Details
              </h2>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Driver Information */}
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                    #{selectedDriver.id} - {selectedDriver.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        selectedDriver.status
                      )}`}
                    >
                      {selectedDriver.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">License Number</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedDriver.license}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">License Expiry</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedDriver.licenseExpiry}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Registration Date</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedDriver.registrationDate}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-600 text-sm mb-2">Total Offenses</h4>
                    <p className="text-[#0A2540] font-semibold">{selectedDriver.totalOffenses}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Contact Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{selectedDriver.phone}</span>
                    </div>
                  </div>
                </div>

                {selectedDriver.vehicle && (
                  <div className="mb-6">
                    <h4 className="text-gray-600 text-sm mb-2">Vehicle Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm">Make & Model</p>
                          <p className="text-[#0A2540] font-semibold">
                            {selectedDriver.vehicle.make} {selectedDriver.vehicle.model} ({selectedDriver.vehicle.year})
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">License Plate</p>
                          <p className="text-[#0A2540] font-semibold">{selectedDriver.vehicle.plate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-gray-600 text-sm mb-2">Fine Summary</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Total Fines</p>
                        <p className="text-[#0A2540] font-semibold">${selectedDriver.totalFines.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Paid Fines</p>
                        <p className="text-green-600 font-semibold">${selectedDriver.paidFines.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Outstanding</p>
                        <p className="text-red-600 font-semibold">${selectedDriver.outstandingFines.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Offenses History */}
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#0A2540] mb-4">
                    Offense History
                  </h3>
                  
                  {selectedOffenses.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOffenses.map((offense) => (
                        <div
                          key={offense.id}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-[#0A2540]">{offense.type}</p>
                              <p className="text-sm text-gray-500">#{offense.id} • {offense.date}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                offense.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : offense.status === "Unpaid"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {offense.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-600">Fine: <span className="font-semibold">${offense.fine.toFixed(2)}</span></p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No offense records found</p>
                      <p className="text-gray-500 text-sm">This driver has no recorded offenses</p>
                    </div>
                  )}
                </div>

                {/* License Actions */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h4 className="text-blue-800 font-medium">License Actions</h4>
                    </div>
                    <p className="text-blue-700 text-sm mb-4">
                      Manage this driver&apos;s license status and permissions.
                    </p>
                    <div className="flex space-x-3">
                      {selectedDriver.status === "Active" ? (
                        <button
                          onClick={() => handleLicenseAction("suspend")}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Suspend License</span>
                        </button>
                      ) : selectedDriver.status === "Suspended" ? (
                        <button
                          onClick={() => handleLicenseAction("reinstate")}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          <span>Reinstate License</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLicenseAction("reinstate")}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          <span>Verify License</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedDriver(null)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Action Modal */}
      {showLicenseModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              {licenseAction === "suspend" ? (
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              ) : (
                <div className="bg-green-100 p-2 rounded-full">
                  <BadgeCheck className="h-6 w-6 text-green-600" />
                </div>
              )}
              <h2 className="text-xl font-bold text-[#0A2540]">
                {licenseAction === "suspend" ? "Suspend Driver License" : licenseAction === "reinstate" ? "Reinstate Driver License" : "Verify Driver License"}
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm mb-2">
                {licenseAction === "suspend" ? "Reason for Suspension" : "Verification Notes"}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                rows={4}
                placeholder={licenseAction === "suspend" ? "Enter the reason for suspending this license..." : "Enter any verification notes..."}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLicenseAction}
                className={`${
                  licenseAction === "suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
              >
                Confirm {licenseAction === "suspend" ? "Suspension" : licenseAction === "reinstate" ? "Reinstatement" : "Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDriversPage;