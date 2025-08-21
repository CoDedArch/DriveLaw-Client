"use client"

import React, { useState } from "react";
import {
  Settings,
  ArrowLeft,
  CheckCircle,
  XCircle,
  X,
  DollarSign,
  Calendar,
  Shield,
  Clock,
  CreditCard,
  Database,
  Lock,
  AlertTriangle,
  Download,
  RefreshCw,
  Save
} from "lucide-react";

// Type definitions
interface FineRate {
  id: string;
  name: string;
  amount: number;
  description: string;
}

interface TimeWindow {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

interface SystemSetting {
  id: string;
  name: string;
  value: string | number | boolean;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
  description: string;
}

const AdminConfigurationsPage = () => {
  const [activeTab, setActiveTab] = useState<"fines" | "time" | "system" | "security">("fines");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Mock data - fine rates
  const [fineRates, setFineRates] = useState<FineRate[]>([
    {
      id: "FINE-001",
      name: "Speeding",
      amount: 150,
      description: "Exceeding posted speed limits"
    },
    {
      id: "FINE-002",
      name: "Red Light Violation",
      amount: 200,
      description: "Running a red traffic signal"
    },
    {
      id: "FINE-003",
      name: "Illegal Parking",
      amount: 75,
      description: "Parking in restricted zones"
    },
    {
      id: "FINE-004",
      name: "DUI",
      amount: 1000,
      description: "Driving under influence"
    },
    {
      id: "FINE-005",
      name: "Reckless Driving",
      amount: 500,
      description: "Dangerous operation of vehicle"
    }
  ]);

  // Mock data - time windows
  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([
    {
      id: "TIME-001",
      name: "Appeal Window",
      value: 30,
      unit: "days",
      description: "Time allowed to submit an appeal after violation"
    },
    {
      id: "TIME-002",
      name: "Payment Due",
      value: 30,
      unit: "days",
      description: "Time allowed to pay fines before penalties apply"
    },
    {
      id: "TIME-003",
      name: "License Suspension",
      value: 180,
      unit: "days",
      description: "Default suspension period for serious offenses"
    }
  ]);

  // Mock data - system settings
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    {
      id: "SYS-001",
      name: "Maintenance Mode",
      value: false,
      type: "boolean",
      description: "Enable to take system offline for maintenance"
    },
    {
      id: "SYS-002",
      name: "Maintenance Window",
      value: "2023-06-15 02:00-04:00",
      type: "text",
      description: "Scheduled maintenance time"
    },
    {
      id: "SYS-003",
      name: "Notification Level",
      value: "medium",
      type: "select",
      options: ["low", "medium", "high"],
      description: "System notification verbosity"
    },
    {
      id: "SYS-004",
      name: "Data Retention",
      value: 365,
      type: "number",
      description: "Days to keep violation records before archiving"
    }
  ]);

  // Mock data - security settings
  const [securitySettings, setSecuritySettings] = useState<SystemSetting[]>([
    {
      id: "SEC-001",
      name: "Password Policy",
      value: 8,
      type: "number",
      description: "Minimum password length for user accounts"
    },
    {
      id: "SEC-002",
      name: "Session Timeout",
      value: 30,
      type: "number",
      description: "Minutes of inactivity before automatic logout"
    },
    {
      id: "SEC-003",
      name: "Two-Factor Auth",
      value: false,
      type: "boolean",
      description: "Require 2FA for admin accounts"
    },
    {
      id: "SEC-004",
      name: "Failed Login Attempts",
      value: 5,
      type: "number",
      description: "Allowed failed attempts before account lock"
    }
  ]);

  const handleFineRateChange = (id: string, value: number) => {
    setFineRates(fineRates.map(rate => 
      rate.id === id ? { ...rate, amount: value } : rate
    ));
  };

  const handleTimeWindowChange = (id: string, value: number) => {
    setTimeWindows(timeWindows.map(window => 
      window.id === id ? { ...window, value: value } : window
    ));
  };

  const handleSystemSettingChange = (id: string, value: string | number | boolean) => {
    setSystemSettings(systemSettings.map(setting => 
      setting.id === id ? { ...setting, value: value } : setting
    ));
  };

  const handleSecuritySettingChange = (id: string, value: string | number | boolean) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id ? { ...setting, value: value } : setting
    ));
  };

  const handleSaveChanges = () => {
    // In a real app, this would send updates to the API
    console.log("Saving configuration changes...");
    setIsEditing(false);
    setShowSaveModal(false);
  };

  const handleResetToDefault = () => {
    // In a real app, this would reset to default values from API
    console.log("Resetting to default configurations...");
    setShowResetModal(false);
  };

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
                System Configurations
              </h1>
              <p className="text-gray-600">
                Manage system settings and parameters
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("fines")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "fines"
                  ? "bg-white text-[#0A2540] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Fine Rates</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("time")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "time"
                  ? "bg-white text-[#0A2540] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Time Windows</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "system"
                  ? "bg-white text-[#0A2540] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-white text-[#0A2540] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Edit Configurations</span>
              </button>
            )}
          </div>
        </div>

        {/* Fine Rates Tab */}
        {activeTab === "fines" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#0A2540] mb-6">
              Fine Rate Configuration
            </h2>
            <div className="space-y-6">
              {fineRates.map((rate) => (
                <div key={rate.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0A2540]">{rate.name}</h3>
                    <p className="text-sm text-gray-600">{rate.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">$</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={rate.amount}
                        onChange={(e) => handleFineRateChange(rate.id, parseFloat(e.target.value))}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-right"
                      />
                    ) : (
                      <span className="w-24 text-right font-medium">{rate.amount.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Windows Tab */}
        {activeTab === "time" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#0A2540] mb-6">
              Time Window Configuration
            </h2>
            <div className="space-y-6">
              {timeWindows.map((window) => (
                <div key={window.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0A2540]">{window.name}</h3>
                    <p className="text-sm text-gray-600">{window.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={window.value}
                        onChange={(e) => handleTimeWindowChange(window.id, parseInt(e.target.value))}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-right"
                      />
                    ) : (
                      <span className="w-24 text-right font-medium">{window.value}</span>
                    )}
                    <span className="text-gray-500">{window.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "system" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#0A2540] mb-6">
              System Settings
            </h2>
            <div className="space-y-6">
              {systemSettings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0A2540]">{setting.name}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    {isEditing ? (
                      setting.type === "boolean" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value as boolean}
                            onChange={(e) => handleSystemSettingChange(setting.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      ) : setting.type === "select" ? (
                        <select
                          value={setting.value as string}
                          onChange={(e) => handleSystemSettingChange(setting.id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                          {setting.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={setting.type}
                          value={setting.value as string | number}
                          onChange={(e) => handleSystemSettingChange(
                            setting.id, 
                            setting.type === "number" ? parseInt(e.target.value) : e.target.value
                          )}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                        />
                      )
                    ) : (
                      <span className="font-medium">
                        {setting.type === "boolean" 
                          ? (setting.value ? "Enabled" : "Disabled") 
                          : setting.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === "security" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#0A2540] mb-6">
              Security Settings
            </h2>
            <div className="space-y-6">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#0A2540]">{setting.name}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    {isEditing ? (
                      setting.type === "boolean" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value as boolean}
                            onChange={(e) => handleSecuritySettingChange(setting.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      ) : (
                        <input
                          type={setting.type}
                          value={setting.value as string | number}
                          onChange={(e) => handleSecuritySettingChange(
                            setting.id, 
                            setting.type === "number" ? parseInt(e.target.value) : e.target.value
                          )}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                        />
                      )
                    ) : (
                      <span className="font-medium">
                        {setting.type === "boolean" 
                          ? (setting.value ? "Enabled" : "Disabled") 
                          : setting.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-full">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[#0A2540]">
                Confirm Configuration Changes
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save these configuration changes? This will update system settings for all users.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-[#0052CC] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003D99] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset to Default Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[#0A2540]">
                Reset to Default Settings
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all configurations to their default values? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfigurationsPage;