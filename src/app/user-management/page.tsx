"use client"

import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Download,
  RefreshCw,
  ChevronRight,
  X,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: "Officer" | "Admin";
  department: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

type StatusFilter = "all" | "Active" | "Inactive";
type RoleFilter = "all" | "Officer" | "Admin";

const AdminUsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Mock data - in real app, this would come from API
  const users: User[] = [
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "s.johnson@trafficwatch.gov",
      role: "Officer",
      department: "Traffic Enforcement",
      lastActive: "2023-05-20 09:15",
      status: "Active",
    },
    {
      id: "USR-002",
      name: "David Miller",
      email: "d.miller@trafficwatch.gov",
      role: "Officer",
      department: "Patrol Division",
      lastActive: "2023-05-19 16:45",
      status: "Active",
    },
    {
      id: "USR-003",
      name: "Lisa Wong",
      email: "l.wong@trafficwatch.gov",
      role: "Admin",
      department: "IT Department",
      lastActive: "2023-05-20 11:30",
      status: "Active",
    },
    {
      id: "USR-004",
      name: "Robert Garcia",
      email: "r.garcia@trafficwatch.gov",
      role: "Officer",
      department: "Traffic Enforcement",
      lastActive: "2023-05-15 08:00",
      status: "Inactive",
    },
    {
      id: "USR-005",
      name: "Emily Chen",
      email: "e.chen@trafficwatch.gov",
      role: "Admin",
      department: "Operations",
      lastActive: "2023-05-20 14:20",
      status: "Active",
    },
    {
      id: "USR-006",
      name: "Michael Brown",
      email: "m.brown@trafficwatch.gov",
      role: "Officer",
      department: "Patrol Division",
      lastActive: "2023-05-18 12:30",
      status: "Inactive",
    },
  ];

  // Filter users based on search and filters
  const filteredUsers: User[] = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: User["status"]): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Inactive":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const admins = users.filter(u => u.role === "Admin").length;
  const officers = users.filter(u => u.role === "Officer").length;

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
                User Management
              </h1>
              <p className="text-gray-600">
                Manage all system users and permissions
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
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-[#0A2540]">{totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">{admins}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Officers</p>
                <p className="text-2xl font-bold text-blue-600">{officers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 flex-1 max-w-sm">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              >
                <option value="all">All Roles</option>
                <option value="Officer">Officer</option>
                <option value="Admin">Admin</option>
              </select>

              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add User</span>
              </button>

              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Department</th>
                  <th className="pb-4 font-medium">Last Active</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="py-4 font-medium text-[#0A2540]">
                      {user.name}
                    </td>
                    <td className="py-4 text-gray-700">{user.email}</td>
                    <td className="py-4 text-gray-700">{user.role}</td>
                    <td className="py-4 text-gray-700">{user.department}</td>
                    <td className="py-4 text-gray-700">{user.lastActive}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">No users found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
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
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">
                  {selectedUser.role} • {selectedUser.department}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-gray-600 text-sm mb-2">User ID</h4>
                <p className="text-[#0A2540] font-semibold">{selectedUser.id}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Email</h4>
                <p className="text-[#0A2540] font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Last Active</h4>
                <p className="text-[#0A2540] font-semibold">{selectedUser.lastActive}</p>
              </div>
              <div>
                <h4 className="text-gray-600 text-sm mb-2">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedUser.status
                  )}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-bold text-[#0A2540] mb-4">
                Account Actions
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    // Handle reset password
                    console.log("Reset password for:", selectedUser.id);
                  }}
                  className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                >
                  Reset Password
                </button>

                <button
                  onClick={() => {
                    // Handle toggle status
                    console.log(
                      "Toggle status for:",
                      selectedUser.id,
                      selectedUser.status === "Active" ? "Inactive" : "Active"
                    );
                  }}
                  className={
                    selectedUser.status === "Active"
                      ? "bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                      : "bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                  }
                >
                  {selectedUser.status === "Active"
                    ? "Deactivate Account"
                    : "Activate Account"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Handle edit user
                  console.log("Edit user:", selectedUser.id);
                }}
                className="bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                Edit User
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A2540]">
                Add New User
              </h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="user@trafficwatch.gov"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Role
                  </label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent">
                    <option value="Officer">Officer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Department
                  </label>
                  <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent">
                    <option value="Traffic Enforcement">
                      Traffic Enforcement
                    </option>
                    <option value="Patrol Division">Patrol Division</option>
                    <option value="IT Department">IT Department</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;