"use client"

import React from "react";
import {
  BadgeAlert,
  Car,
  DollarSign,
  Ticket,
  Users,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Type definitions
interface OfficerData {
  name: string;
  badgeNumber: string;
  department: string;
  totalCitations: number;
  pendingAppeals: number;
  recentActivity: Array<{
    type: string;
    license: string;
    time: string;
  }>;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  change?: number;
  color: string;
}

const OfficerDashboard = () => {
  const router = useRouter()
  // Mock data
  const officerData: OfficerData = {
    name: "Officer Sarah Johnson",
    badgeNumber: "TRF-78945",
    department: "Traffic Enforcement Unit",
    totalCitations: 128,
    pendingAppeals: 7,
    recentActivity: [
      { type: "Speeding Ticket", license: "DL-987654", time: "2h ago" },
      { type: "Parking Violation", license: "DL-123456", time: "5h ago" },
      { type: "Red Light Violation", license: "DL-456789", time: "1d ago" },
      { type: "Lane Violation", license: "DL-321654", time: "1d ago" },
    ],
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    change,
    color,
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center text-sm ${
              change > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
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
                Officer Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of your enforcement activities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0A2540]">
                Welcome back, {officerData.name}
              </h2>
              <p className="text-gray-600">
                {officerData.department} • Badge #{officerData.badgeNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <BadgeAlert className="h-5 w-5" />
                <span>On Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Ticket}
            title="Citations Issued"
            value={officerData.totalCitations}
            color="bg-blue-500"
          />
          <StatCard
            icon={DollarSign}
            title="Fines Collected"
            value="$9,850"
            change={12}
            color="bg-green-500"
          />
          <StatCard
            icon={ClipboardList}
            title="Pending Appeals"
            value={officerData.pendingAppeals}
            color="bg-purple-500"
          />
          <StatCard
            icon={Car}
            title="Vehicles Flagged"
            value="23"
            change={-5}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {officerData.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Ticket className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-[#0A2540] font-medium">
                      {activity.type}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      DL: {activity.license}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540]">
                Issue Citation
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Record a new traffic violation
            </p>
            <button className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
              New Citation
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540]">
                Review Appeals
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Process pending appeals
            </p>
            <button onClick={()=> router.push("/appeals/officer/appeals")} className="w-full bg-purple-100 text-purple-700 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors">
              View Appeals
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540]">
                Driver Records
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              View driver history and records
            </p>
            <button onClick={() => router.push("/officer/drivers")} className="w-full bg-green-100 text-green-700 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors">
              Search Drivers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;