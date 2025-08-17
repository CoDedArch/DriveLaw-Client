import React, { useState } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import DriveLaw from "../images/drivelaw-icon";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "officer":
        return "bg-blue-100 text-blue-800";
      case "driver":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "officer":
        return "Traffic Officer";
      case "driver":
        return "Driver";
      default:
        return role?.toUpperCase() || "USER";
    }
  };

  const getUserDisplayName = () => {
    // Since we don't have name/email in the User type, we can use user_id or create a display name
    if (user?.role === "officer" && user?.badge_number) {
      return `Officer #${user.badge_number}`;
    }
    if (user?.role === "driver" && user?.license_number) {
      return `License: ${user.license_number}`;
    }
    // if (user?.role === 'judge' && user?.court_id) {
    //   return `Court ${user.court_id}`;
    // }
    return "";
  };

  const getUserSecondaryInfo = () => {
    if (user?.department) {
      return user.department;
    }
    if (user?.role === "driver") {
      return "Licensed Driver";
    }
    return user?.role ? getRoleDisplayName(user.role) : "";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <DriveLaw />
                <span className="text-xl font-semibold text-black">DriveLaw</span>
              </div>
            </div>
            {/* Status indicator for active/inactive users */}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="ml-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.is_active ? "Active" : "Pending Activation"}
                </span>
              </div>
            )}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      user?.role || ""
                    )}`}
                  >
                    {getRoleDisplayName(user?.role || "")}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {getUserDisplayName()}
                  </span>
                </div>
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{getUserDisplayName()}</p>
                    <p className="text-gray-500">{getUserSecondaryInfo()}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user?.role || ""
                        )}`}
                      >
                        {getRoleDisplayName(user?.role || "")}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user?.is_active ? "Active" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-7xl {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          h1 {
            font-size: 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
