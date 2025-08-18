"use client"

import React from "react";
import {
  ArrowLeft,
  Users,
  Ticket,
  MessageSquare,
  CreditCard,
  Database,
  Activity,
  Shield,
  BarChart2,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: number;
  color: string;
}

interface ActivityItem {
  type: string;
  details: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalUsers: 42,
    monthlyOffenses: 128,
    finesCollected: 9850,
    pendingAppeals: 7,
    activeOfficers: 23,
    systemHealth: "Optimal",
    databaseUsage: "45%",
    serverLoad: "28%",
    activeSessions: 19,
  };

  const recentActivities: ActivityItem[] = [
    {
      type: "New Offense",
      details: "Speeding ticket issued by Officer Johnson",
      time: "2 hours ago",
      icon: <Ticket className="h-5 w-5" />,
      color: "bg-orange-500/20 text-orange-400",
    },
    {
      type: "User Login",
      details: "Admin Michael Chen logged in",
      time: "3 hours ago",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      type: "Appeal Submitted",
      details: "Jessica Wilson appealed OFF-2023-0455",
      time: "1 day ago",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      type: "System Update",
      details: "Database backup completed",
      time: "1 day ago",
      icon: <Database className="h-5 w-5" />,
      color: "bg-green-500/20 text-green-400",
    },
  ];

  const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change && (
          <div className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
            {change > 0 ? "+" : ""}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-[#0A2540] mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                System overview and performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            title="Active Users"
            value={stats.totalUsers.toString()}
            change={5}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Ticket className="h-6 w-6 text-white" />}
            title="Monthly Offenses"
            value={stats.monthlyOffenses.toString()}
            change={-2}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          <StatCard
            icon={<CreditCard className="h-6 w-6 text-white" />}
            title="Fines Collected"
            value={`$${stats.finesCollected.toLocaleString()}`}
            change={12}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6 text-white" />}
            title="Pending Appeals"
            value={stats.pendingAppeals.toString()}
            change={3}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* System Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-6">
            System Status
          </h2>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-[#0A2540] font-medium">{stats.systemHealth} Status</span>
            </div>
            <div className="text-gray-500 text-sm">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-[#0A2540] font-semibold mb-3">Database</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Storage</span>
                <span className="text-[#0A2540]">{stats.databaseUsage} used</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: stats.databaseUsage }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-[#0A2540] font-semibold mb-3">Server Load</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">CPU Usage</span>
                <span className="text-[#0A2540]">{stats.serverLoad}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: stats.serverLoad }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-[#0A2540] font-semibold mb-3">
                Active Sessions
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Current Users</span>
                <span className="text-[#0A2540]">{stats.activeSessions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(stats.activeSessions / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A2540]">
              Recent Activity
            </h2>
            <button className="text-[#0052CC] hover:text-[#003D99] text-sm font-medium">
              View All Activity
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-[#0A2540] font-medium">
                      {activity.type}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {activity.details}
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[#0A2540] font-semibold mb-4">
              Offense Types
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              <BarChart2 className="h-8 w-8 mr-2" />
              <span>Pie Chart Placeholder</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[#0A2540] font-semibold mb-4">
              Monthly Trends
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              <Activity className="h-8 w-8 mr-2" />
              <span>Line Chart Placeholder</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[#0A2540] font-semibold mb-4">
              Officer Activity
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              <Shield className="h-8 w-8 mr-2" />
              <span>Bar Chart Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;