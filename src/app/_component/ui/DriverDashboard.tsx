import React, { useState } from "react";
import {
  FileText,
  DollarSign,
  MessageSquare,
  Shield,
  CreditCard,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  ArrowRight,
  Bell,
  User,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Offense,
  useDashboard,
  usePaymentSummary,
  useProcessPayment,
  useSubmitAppeal,
} from "@/app/data/queries";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  change?: number;
  color: string;
}

const DriverDashboard = () => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [appealModal, setAppealModal] = useState(false);
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);

  // Replace mock data with real hooks
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();
  const {
    summary: paymentSummary,
    loading: paymentLoading,
    error: paymentError,
  } = usePaymentSummary();
  const { processPayment, loading: paymentProcessing } = useProcessPayment();
  const { submitAppeal, loading: appealSubmitting } = useSubmitAppeal();

  if (dashboardLoading || paymentLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    change,
    color,
  }) => (
    <div
      className={`${color} border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#0052CC] rounded-md">
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
            <span
              className={`text-sm font-medium ${
                change > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        )}
      </div>
      <p className="text-[#0A2540] text-2xl font-bold">{value}</p>
      <p className="text-gray-600 text-sm mt-1">{title}</p>
    </div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "major":
        return "border-l-red-500";
      case "moderate":
        return "border-l-yellow-500";
      case "minor":
        return "border-l-green-500";
      default:
        return "border-l-gray-400";
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "paid":
        return "bg-green-100 text-green-800 border border-green-300";
      case "under_appeal":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Extract data from hooks
  const driverData = dashboardData?.driverData;
  const offenses = dashboardData?.recentOffenses || [];
  const pendingAmount = dashboardData?.pendingAmount || 0;

  const handlePayment = async () => {
    try {
      const pendingOffenses = offenses.filter(
        (offense) => offense.status === "Pending Payment"
      );
      const offenseIds = pendingOffenses.map((offense) => offense.id);

      await processPayment({
        offenseIds,
        amount: pendingAmount,
        method: "credit_card",
        // You'll need to collect these from the form
        cardDetails: {
          cardNumber: "1234567890123456", // Get from form
          expiryDate: "12/25", // Get from form
          cvv: "123", // Get from form
          nameOnCard: "John Doe", // Get from form
        },
      });

      setPaymentModal(false);
      // You might want to refetch data or show success message
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle error - show error message to user
    }
  };

  const handleAppealSubmit = async () => {
    try {
      await submitAppeal({
        offenseId: "OFF001", // Get from form
        reason: "incorrect_details", // Get from form
        description: "Appeal description", // Get from form
        // evidence: file // Optional file from form
      });

      setAppealModal(false);
      // You might want to refetch data or show success message
    } catch (error) {
      console.error("Appeal submission failed:", error);
      // Handle error - show error message to user
    }
  };

  const pendingOffenses = offenses.filter(
    (offense) => offense.status === "Pending Payment"
  );
  const totalPendingAmount = paymentSummary?.outstandingAmount || pendingAmount;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              title="Total Offenses"
              value={driverData?.totalOffenses || 0}
              change={-20}
              color="bg-white"
            />
            <StatCard
              icon={DollarSign}
              title="Outstanding Fines"
              value={`$${driverData?.totalFines.toFixed(2)}`}
              change={15}
              color="bg-white"
            />
            <StatCard
              icon={MessageSquare}
              title="Active Appeals"
              value={driverData?.pendingAppeals || 0}
              color="bg-white"
            />
            <StatCard
              icon={Shield}
              title="Driving Score"
              value={`${driverData?.drivingScore}/100`}
              change={-5}
              color="bg-white"
            />
          </div>

          {/* Alerts Section */}
          {driverData?.totalFines ||
            (0 > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-[#0A2540] font-semibold text-lg mb-2">
                      Action Required
                    </h3>
                    <p className="text-red-700 mb-4">
                      You have ${totalPendingAmount.toFixed(2)} in outstanding
                      fines from {pendingOffenses.length} violation(s) that
                      require payment.
                    </p>
                    <button
                      onClick={() => setPaymentModal(true)}
                      className="bg-[#0052CC] text-white px-6 py-2 rounded-md hover:bg-[#003D99] transition-colors"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0A2540]">
                Recent Activity
              </h2>
              <button className="flex items-center space-x-2 text-[#0052CC] hover:text-[#003D99] transition-colors">
                <span>View All Offenses</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {offenses.slice(0, 3).map((offense) => (
                <div
                  key={offense.id}
                  className={`border-l-4 ${getSeverityColor(
                    offense.severity
                  )} bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors cursor-pointer`}
                  onClick={() => setSelectedOffense(offense)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-[#0A2540] font-semibold text-lg">
                        {offense.type}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-600 text-sm mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{offense.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {offense.date} at {offense.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                          offense.status
                        )}`}
                      >
                        {offense.status}
                      </span>
                      <p className="text-[#0A2540] font-bold mt-2 text-xl">
                        ${offense.fine.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {offenses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent violations</p>
                <p className="text-sm">Keep up the good driving!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setPaymentModal(true)}
              className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#0052CC] rounded-md">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#0052CC] transition-colors" />
              </div>
              <h3 className="text-[#0A2540] font-bold text-lg mb-2">
                Pay Fines
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Quick payment for pending fines
              </p>
              <span className="text-gray-500 text-sm">
                {pendingOffenses.length} pending
              </span>
            </button>

            <button
              onClick={() => setAppealModal(true)}
              className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#0052CC] rounded-md">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#0052CC] transition-colors" />
              </div>
              <h3 className="text-[#0A2540] font-bold text-lg mb-2">
                Submit Appeal
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Contest a traffic violation
              </p>
              <span className="text-gray-500 text-sm">
                {driverData?.pendingAppeals} active appeals
              </span>
            </button>

            <button className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow text-left group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#0052CC] rounded-md">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#0052CC] transition-colors" />
              </div>
              <h3 className="text-[#0A2540] font-bold text-lg mb-2">
                View Details
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                See all offense details
              </p>
              <span className="text-gray-500 text-sm">
                {offenses.length} total offenses
              </span>
            </button>
          </div>

          {/* Driving Score Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#0A2540] mb-6">
              Driving Score Breakdown
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-[#0A2540] font-semibold">Safe Driving</p>
                <p className="text-gray-600 text-sm">No major violations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-[#0A2540] font-semibold">
                  Minor Infractions
                </p>
                <p className="text-gray-600 text-sm">2 parking violations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-[#0A2540] font-semibold">Improvement</p>
                <p className="text-gray-600 text-sm">Score trending up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offense Details Modal */}
        {selectedOffense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="space-y-4 text-[#0A2540]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Offense ID
                    </label>
                    <p className="font-semibold">{selectedOffense.id}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Type
                    </label>
                    <p className="font-semibold">{selectedOffense.type}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Date & Time
                    </label>
                    <p className="font-semibold">
                      {selectedOffense.date} at {selectedOffense.time}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Location
                    </label>
                    <p className="font-semibold">{selectedOffense.location}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Fine Amount
                    </label>
                    <p className="font-semibold text-2xl">
                      ${selectedOffense.fine.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm font-medium">
                      Due Date
                    </label>
                    <p className="font-semibold">{selectedOffense.dueDate}</p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium">
                    Description
                  </label>
                  <p className="font-semibold">{selectedOffense.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Quick Payment
                </h2>
                <button
                  onClick={() => setPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-[#0A2540] font-semibold">
                    Total Outstanding
                  </h3>
                  <p className="text-3xl font-bold text-[#0A2540] mt-2">
                    ${driverData?.totalFines.toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {pendingOffenses.length} pending violations
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-[#0052CC] text-white px-4 py-3 rounded-md hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Pay ${driverData?.totalFines.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Appeal Modal */}
        {appealModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Submit Appeal
                </h2>
                <button
                  onClick={() => setAppealModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Offense ID
                  </label>
                  <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent">
                    <option value="">Select offense...</option>
                    {pendingOffenses.map((offense) => (
                      <option key={offense.id} value={offense.id}>
                        {offense.id} - {offense.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Reason for Appeal
                  </label>
                  <select className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent">
                    <option value="">Select reason...</option>
                    <option value="incorrect_details">Incorrect Details</option>
                    <option value="not_driver">I was not the driver</option>
                    <option value="emergency">Emergency situation</option>
                    <option value="signage_issue">
                      Poor signage/visibility
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Please provide details about your appeal..."
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAppealSubmit}
                className="w-full mt-6 bg-[#0052CC] text-white px-4 py-3 rounded-md hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Submit Appeal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
