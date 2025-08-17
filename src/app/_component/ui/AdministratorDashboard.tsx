import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Download,
  UserPlus,
  Ticket,
  CreditCard,
  Database,
  Activity,
  MessageSquare,
  RefreshCw,
  User,
  LucideIcon,
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

interface Officer {
  name: string;
  id: string;
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
  driver: Driver;
  fine: number;
  status: "Pending Payment" | "Under Appeal" | "Paid";
  severity: "high" | "medium" | "low";
}

interface Appeal {
  id: string;
  offenseId: string;
  submittedDate: string;
  driver: Driver;
  status: "Under Review" | "Approved" | "Rejected";
  assignedTo: Officer;
}

interface SystemConfig {
  fineRates: {
    speeding: number;
    redLight: number;
    illegalParking: number;
    dui: number;
  };
  appealWindow: number;
  paymentDue: number;
  systemMaintenance: string;
}

interface AdminData {
  name: string;
  email: string;
  lastLogin: string;
  systemStatus: string;
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: number;
  color: string;
}

interface Activity {
  type: string;
  details: string;
  time: string;
}

type TabType =
  | "dashboard"
  | "users"
  | "offenses"
  | "appeals"
  | "analytics"
  | "configuration";

type StatusType =
  | "Active"
  | "Inactive"
  | "Pending Payment"
  | "Under Appeal"
  | "Paid"
  | "Under Review"
  | "Approved"
  | "Rejected";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Mock data
  const adminData: AdminData = {
    name: "Admin Michael Chen",
    email: "admin@trafficwatch.gov",
    lastLogin: "2023-05-20 14:30",
    systemStatus: "All systems operational",
  };

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
  ];

  const offenses: Offense[] = [
    {
      id: "OFF-2023-0456",
      date: "2023-05-15",
      officer: { name: "Sarah Johnson", id: "USR-001" },
      type: "Speeding",
      driver: { name: "Michael Brown", license: "DL-987654" },
      fine: 150.0,
      status: "Pending Payment",
      severity: "high",
    },
    {
      id: "OFF-2023-0455",
      date: "2023-05-14",
      officer: { name: "David Miller", id: "USR-002" },
      type: "Red Light Violation",
      driver: { name: "Jessica Wilson", license: "DL-456123" },
      fine: 200.0,
      status: "Under Appeal",
      severity: "high",
    },
    {
      id: "OFF-2023-0454",
      date: "2023-05-12",
      officer: { name: "Sarah Johnson", id: "USR-001" },
      type: "Illegal Parking",
      driver: { name: "Robert Taylor", license: "DL-789456" },
      fine: 75.0,
      status: "Paid",
      severity: "low",
    },
  ];

  const appeals: Appeal[] = [
    {
      id: "APL-2023-0023",
      offenseId: "OFF-2023-0455",
      submittedDate: "2023-05-20",
      driver: { name: "Jessica Wilson", license: "DL-456123" },
      status: "Under Review",
      assignedTo: { name: "Sarah Johnson", id: "USR-001" },
    },
  ];

  const systemConfig: SystemConfig = {
    fineRates: {
      speeding: 150,
      redLight: 200,
      illegalParking: 75,
      dui: 1000,
    },
    appealWindow: 30, // days
    paymentDue: 30, // days
    systemMaintenance: "2023-06-15 02:00-04:00",
  };

  const activities: Activity[] = [
    {
      type: "New Offense",
      details: "Speeding ticket issued by Officer Johnson",
      time: "2 hours ago",
    },
    {
      type: "User Login",
      details: "Admin Michael Chen logged in",
      time: "3 hours ago",
    },
    {
      type: "Appeal Submitted",
      details: "Jessica Wilson appealed OFF-2023-0455",
      time: "1 day ago",
    },
    {
      type: "System Update",
      details: "Database backup completed",
      time: "1 day ago",
    },
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Inactive":
        return "bg-red-500/20 text-red-400";
      case "Pending Payment":
        return "bg-orange-500/20 text-orange-400";
      case "Under Appeal":
        return "bg-blue-500/20 text-blue-400";
      case "Paid":
        return "bg-green-500/20 text-green-400";
      case "Under Review":
        return "bg-blue-500/20 text-blue-400";
      case "Approved":
        return "bg-green-500/20 text-green-400";
      case "Rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSeverityColor = (severity: "high" | "medium" | "low"): string => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    change,
    color,
  }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center text-sm ${
              change > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-white/70 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TrafficWatch</h1>
                <p className="text-white/70 text-sm">Administrator Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-white/70 hover:text-white transition-colors relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-medium text-sm">{adminData.name}</p>
                  <p className="text-xs text-white/70">Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-xl p-1 mb-8">
          {[
            { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart2 },
            { id: 'users' as const, label: 'User Management', icon: Users },
            { id: 'offenses' as const, label: 'Offenses', icon: Ticket },
            { id: 'appeals' as const, label: 'Appeals', icon: MessageSquare },
            { id: 'analytics' as const, label: 'Analytics', icon: Activity },
            { id: 'configuration' as const, label: 'Configuration', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Active Users"
                value="42"
                change={5}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Ticket}
                title="Monthly Offenses"
                value="128"
                change={-2}
                color="from-orange-500 to-orange-600"
              />
              <StatCard
                icon={CreditCard}
                title="Fines Collected"
                value="$9,850"
                change={12}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={MessageSquare}
                title="Pending Appeals"
                value="7"
                change={3}
                color="from-purple-500 to-purple-600"
              />
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                System Status
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-white">{adminData.systemStatus}</span>
                </div>
                <div className="text-white/70 text-sm">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Database</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Storage</span>
                    <span className="text-white">45% used</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Server Load</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">CPU Usage</span>
                    <span className="text-white">28%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">
                    Active Sessions
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Current Users</span>
                    <span className="text-white">19</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "63%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    type: "New Offense",
                    details: "Speeding ticket issued by Officer Johnson",
                    time: "2 hours ago",
                  },
                  {
                    type: "User Login",
                    details: "Admin Michael Chen logged in",
                    time: "3 hours ago",
                  },
                  {
                    type: "Appeal Submitted",
                    details: "Jessica Wilson appealed OFF-2023-0455",
                    time: "1 day ago",
                  },
                  {
                    type: "System Update",
                    details: "Database backup completed",
                    time: "1 day ago",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${
                          activity.type.includes("Offense")
                            ? "bg-orange-500/20 text-orange-400"
                            : activity.type.includes("Login")
                            ? "bg-blue-500/20 text-blue-400"
                            : activity.type.includes("Appeal")
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {activity.type.includes("Offense") ? (
                          <Ticket className="h-5 w-5" />
                        ) : activity.type.includes("Login") ? (
                          <User className="h-5 w-5" />
                        ) : activity.type.includes("Appeal") ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : (
                          <Database className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {activity.type}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {activity.details}
                        </p>
                      </div>
                    </div>
                    <span className="text-white/50 text-sm">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Controls */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">
                  User Management
                </h2>
                <div className="flex space-x-3">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                    onClick={() => setShowUserModal(true)}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add User
                  </button>
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 flex-1 max-w-md">
                  <Search className="h-5 w-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="bg-transparent text-white placeholder-white/50 outline-none w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="Officer">Officer</option>
                  <option value="Admin">Admin</option>
                </select>

                <select
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <button
                  className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setRoleFilter("all");
                  }}
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/20 text-white/70">
                    <tr>
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Department</th>
                      <th className="pb-4">Last Active</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-white/10 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="py-4 text-white font-medium">
                          {user.name}
                        </td>
                        <td className="py-4 text-white/80">{user.email}</td>
                        <td className="py-4 text-white/80">{user.role}</td>
                        <td className="py-4 text-white/80">
                          {user.department}
                        </td>
                        <td className="py-4 text-white/80">
                          {user.lastActive}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <ChevronRight className="h-5 w-5 text-white/50" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Offenses Tab */}
        {activeTab === "offenses" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Offense Records
              </h2>

              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 flex-1 max-w-md">
                  <Search className="h-5 w-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search offenses by ID, driver, or officer..."
                    className="bg-transparent text-white placeholder-white/50 outline-none w-full"
                  />
                </div>

                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2">
                  <option value="">All Statuses</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Under Appeal">Under Appeal</option>
                  <option value="Paid">Paid</option>
                </select>

                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2">
                  <option value="">All Types</option>
                  <option value="Speeding">Speeding</option>
                  <option value="Red Light">Red Light</option>
                  <option value="Parking">Parking</option>
                </select>

                <button className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300">
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/20 text-white/70">
                    <tr>
                      <th className="pb-4">ID</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Officer</th>
                      <th className="pb-4">Driver</th>
                      <th className="pb-4">Type</th>
                      <th className="pb-4">Fine</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {offenses.map((offense) => (
                      <tr
                        key={offense.id}
                        className="hover:bg-white/10 cursor-pointer"
                        onClick={() => setSelectedOffense(offense)}
                      >
                        <td className="py-4 text-white/80">#{offense.id}</td>
                        <td className="py-4 text-white/80">{offense.date}</td>
                        <td className="py-4 text-white/80">
                          {offense.officer.name}
                        </td>
                        <td className="py-4 text-white/80">
                          {offense.driver.name}
                        </td>
                        <td className="py-4 text-white/80">{offense.type}</td>
                        <td className="py-4 text-white/80">
                          ${offense.fine.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              offense.status
                            )}`}
                          >
                            {offense.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <ChevronRight className="h-5 w-5 text-white/50" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appeals Tab */}
        {activeTab === "appeals" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Appeal Cases
              </h2>

              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 flex-1 max-w-md">
                  <Search className="h-5 w-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search appeals by ID, driver, or offense..."
                    className="bg-transparent text-white placeholder-white/50 outline-none w-full"
                  />
                </div>

                <select className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2">
                  <option value="">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300">
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/20 text-white/70">
                    <tr>
                      <th className="pb-4">ID</th>
                      <th className="pb-4">Offense</th>
                      <th className="pb-4">Driver</th>
                      <th className="pb-4">Submitted</th>
                      <th className="pb-4">Assigned To</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {appeals.map((appeal) => (
                      <tr
                        key={appeal.id}
                        className="hover:bg-white/10 cursor-pointer"
                        onClick={() => setSelectedAppeal(appeal)}
                      >
                        <td className="py-4 text-white/80">#{appeal.id}</td>
                        <td className="py-4 text-white/80">
                          #{appeal.offenseId}
                        </td>
                        <td className="py-4 text-white/80">
                          {appeal.driver.name}
                        </td>
                        <td className="py-4 text-white/80">
                          {appeal.submittedDate}
                        </td>
                        <td className="py-4 text-white/80">
                          {appeal.assignedTo.name}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appeal.status
                            )}`}
                          >
                            {appeal.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <ChevronRight className="h-5 w-5 text-white/50" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                System Analytics
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Offenses by Type
                  </h3>
                  <div className="h-64 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                    Pie Chart Placeholder
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Monthly Offenses
                  </h3>
                  <div className="h-64 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                    Line Chart Placeholder
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Officer Activity
                  </h3>
                  <div className="h-64 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                    Bar Chart Placeholder
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Appeal Outcomes
                  </h3>
                  <div className="h-64 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                    Donut Chart Placeholder
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-white font-semibold mb-4">
                  Hotspot Locations
                </h3>
                <div className="h-96 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                  Map Visualization Placeholder
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === "configuration" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  System Configuration
                </h2>
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowConfigModal(true)}
                >
                  Edit Configuration
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Fine Rates</h3>
                  <div className="space-y-3">
                    {Object.entries(systemConfig.fineRates).map(
                      ([type, amount]) => (
                        <div
                          key={type}
                          className="flex justify-between items-center"
                        >
                          <span className="text-white/80 capitalize">
                            {type}
                          </span>
                          <span className="text-white">${amount}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Time Windows
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Appeal Window</span>
                      <span className="text-white">
                        {systemConfig.appealWindow} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Payment Due</span>
                      <span className="text-white">
                        {systemConfig.paymentDue} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    System Maintenance
                  </h3>
                  <p className="text-white">{systemConfig.systemMaintenance}</p>
                </div>

                <div className="bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Password Policy</span>
                      <span className="text-white">8+ characters</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Session Timeout</span>
                      <span className="text-white">30 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-white/70">
                  {selectedUser.role} • {selectedUser.department}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-white/70 text-sm mb-2">Email</h4>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm mb-2">User ID</h4>
                <p className="text-white">{selectedUser.id}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm mb-2">Last Active</h4>
                <p className="text-white">{selectedUser.lastActive}</p>
              </div>
              <div>
                <h4 className="text-white/70 text-sm mb-2">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedUser.status
                  )}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white/70 text-sm mb-2">Assigned Offenses</h4>
              <div className="space-y-2">
                {offenses
                  .filter((o) => o.officer.id === selectedUser.id)
                  .slice(0, 3)
                  .map((offense) => (
                    <div
                      key={offense.id}
                      className="bg-white/5 p-3 rounded-lg flex justify-between items-center hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setSelectedOffense(offense);
                        setSelectedUser(null);
                      }}
                    >
                      <div>
                        <p className="text-white font-medium">{offense.type}</p>
                        <p className="text-white/70 text-sm">#{offense.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">${offense.fine.toFixed(2)}</p>
                        <span
                          className={`text-xs ${getStatusColor(
                            offense.status
                          )}`}
                        >
                          {offense.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                className={`py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedUser.status === "Active"
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
                onClick={() =>
                  alert(
                    `Would ${
                      selectedUser.status === "Active"
                        ? "deactivate"
                        : "activate"
                    } user in real implementation`
                  )
                }
              >
                {selectedUser.status === "Active"
                  ? "Deactivate User"
                  : "Activate User"}
              </button>

              <button
                className="bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Add New User</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-3"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-3"
                  placeholder="user@trafficwatch.gov"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Role
                  </label>
                  <select className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3">
                    <option value="Officer">Officer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Department
                  </label>
                  <select className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3">
                    <option value="Traffic Enforcement">
                      Traffic Enforcement
                    </option>
                    <option value="Patrol Division">Patrol Division</option>
                    <option value="IT Department">IT Department</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-3"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-3"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">
                Edit System Configuration
              </h2>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Fine Rates
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(systemConfig.fineRates).map(
                    ([type, amount]) => (
                      <div key={type} className="bg-white/5 p-4 rounded-lg">
                        <label className="block text-white/70 text-sm mb-2 capitalize">
                          {type}
                        </label>
                        <div className="flex items-center">
                          <span className="text-white mr-2">$</span>
                          <input
                            type="number"
                            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                            value={amount}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Time Windows
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <label className="block text-white/70 text-sm mb-2">
                      Appeal Window (days)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                      value={systemConfig.appealWindow}
                    />
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <label className="block text-white/70 text-sm mb-2">
                      Payment Due (days)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                      value={systemConfig.paymentDue}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  System Maintenance
                </h3>
                <div className="bg-white/5 p-4 rounded-lg">
                  <label className="block text-white/70 text-sm mb-2">
                    Next Maintenance Window
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                    value={systemConfig.systemMaintenance}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Security Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <label className="block text-white/70 text-sm mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                      value="8"
                    />
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <label className="block text-white/70 text-sm mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
                      value="30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
