"use client";
import OfficerDashboard from "./_component/ui/OfficerDashboard";
import DriverDashboard from "./_component/ui/DriverDashboard";
import LoadingScreen from "./_component/ui/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import PublicHomepage from "./_component/ui/PublicHomePage";
import AdminDashboard from "./_component/ui/AdministratorDashboard";

type UserRole = "admin" | "officer" | "driver";

export default function HomePage() {
  const { user, authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authenticated || !user) {
    return <PublicHomepage />;
  }

  // Determine user role - get the role from your user object
  const userRole = user.role; // Ensure user.role matches UserRole

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout role={userRole} user={user}>
        {userRole === "admin" && <AdminDashboard />}
        {userRole === "officer" && <OfficerDashboard />}
        {userRole === "driver" && <DriverDashboard />}
      </DashboardLayout>
    </div>
  );
}

// Updated DashboardLayout to use custom logout and show user status
function DashboardLayout({
  role,
  user,
  children,
}: {
  role: UserRole;
  user: any; // or import the User type from your AuthContext
  children: React.ReactNode;
}) {
  const roleTitles = {
    admin: "Administrator Console",
    officer: "Traffic Officer Dashboard",
    driver: "Driver Portal",
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Manage system users, settings, and oversee all operations";
      case "officer":
        return "Record violations, manage fines, and monitor traffic compliance";
      case "driver":
        return "View your violations, pay fines, and submit appeals";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 mt-5 md:mt-0">
                {roleTitles[role]}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {getRoleDescription(role)}
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Show inactive user message */}
          {!user.is_active && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Account Activation Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your account is currently inactive. Some features may be
                      limited until your account is activated by an
                      administrator.
                      {user.role === "driver" &&
                        " Please ensure your license information is verified."}
                      {user.role === "officer" &&
                        " Please contact your department administrator."}
                      {user.role === "judge" &&
                        " Please contact the court administrator."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
