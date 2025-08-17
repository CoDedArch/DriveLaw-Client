"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Camera,
  Download,
  X,
  CreditCard,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  useOffenses,
  useProcessPayment,
  useSubmitAppeal,
} from "../data/queries";

interface Offense {
  id: string;
  date: string;
  time: string;
  type: string;
  location: string;
  fine: number;
  status: string;
  description: string;
  evidence: string;
  dueDate: string;
  severity: string;
}

const OffensesPage = () => {
  const [selectedOffense, setSelectedOffense] = useState<Offense | null>(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [appealModal, setAppealModal] = useState(false);
  const [appealForm, setAppealForm] = useState({
    offenseId: "",
    reason: "",
    description: "",
  });

  // Add filter states
  const [filters, setFilters] = useState({
    status: "",
    offense_type: "",
  });

  // Replace mock data with real hooks
  const {
    offenses,
    loading: offensesLoading,
    error: offensesError,
    refetch,
  } = useOffenses(filters);
  const {
    processPayment,
    loading: paymentProcessing,
    error: paymentError,
  } = useProcessPayment();
  const {
    submitAppeal,
    loading: appealSubmitting,
    error: appealError,
  } = useSubmitAppeal();

  // Handle loading state
  if (offensesLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offenses...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (offensesError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading offenses</p>
          <p className="text-gray-600">{offensesError}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Update color functions to use more reliable Tailwind classes
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "major":
        return "border-l-red-500";
      case "moderate":
        return "border-l-yellow-500";
      case "minor":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "paid":
        return "bg-green-100 text-green-800 border border-green-300";
      case "under_appeal":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "appealed_approved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "appealed_rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Update payment handler
  const handlePayment = async (offense: Offense) => {
    try {
      await processPayment({
        offenseIds: [offense.id],
        amount: offense.fine,
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
      setSelectedOffense(null);
      refetch(); // Refresh the offenses list

      // You might want to show a success message
      console.log("Payment successful for offense:", offense.id);
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle error - show error message to user
    }
  };

  // Update appeal handler
  const handleAppealSubmit = async () => {
    try {
      await submitAppeal({
        offenseId: appealForm.offenseId,
        reason: appealForm.reason,
        description: appealForm.description,
        // evidence: file // Optional file from form
      });

      setAppealModal(false);
      setAppealForm({ offenseId: "", reason: "", description: "" });
      refetch(); // Refresh the offenses list

      console.log("Appeal submitted successfully");
    } catch (error) {
      console.error("Appeal submission failed:", error);
      // Handle error - show error message to user
    }
  };

  // Update filter handler
  const handleApplyFilters = () => {
    refetch();
  };

  // Calculate pending offenses from real data
  const pendingOffenses = offenses.filter(
    (offense) => offense.status === "Pending Payment"
  );

  console.log("OFFENSES ", offenses);
  const otherOffenses = offenses.filter(
    (offense) => offense.status !== "Pending Payment"
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
                Traffic Offenses
              </h1>
              <p className="text-gray-600">
                View and manage your traffic violations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 flex-1 max-w-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, type, or location..."
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1"
              />
            </div>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={filters.offense_type}
              onChange={(e) =>
                setFilters({ ...filters, offense_type: e.target.value })
              }
            >
              <option value="">All Types</option>
              <option value="speeding">Speeding</option>
              <option value="parking">Parking Violation</option>
              <option value="redlight">Red Light Violation</option>
              <option value="lane">Lane Violation</option>
            </select>

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="appeal">Under Appeal</option>
            </select>

            <button
              onClick={handleApplyFilters}
              className="flex items-center space-x-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Pending Payments Section */}
        {pendingOffenses.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0A2540]">
                Pending Payments
              </h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {pendingOffenses.length} outstanding
              </span>
            </div>

            <div className="space-y-4">
              {pendingOffenses.map((offense) => (
                <div
                  key={offense.id}
                  className={`border-l-4 ${getSeverityColor(
                    offense.severity
                  )} bg-yellow-50 border border-yellow-200 rounded-r-lg p-6 hover:bg-yellow-100 transition-colors cursor-pointer`}
                  onClick={() => setSelectedOffense(offense)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="text-[#0A2540] font-semibold text-lg">
                          {offense.type} - {offense.id}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(
                            offense.status
                          )}`}
                        >
                          {offense.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {offense.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {offense.date} at {offense.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{offense.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#0A2540]">
                        ${offense.fine.toFixed(2)}
                      </p>
                      <p className="text-red-600 text-sm font-medium">
                        Due: {offense.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-yellow-300">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">Evidence Available</span>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffense(offense);
                          setPaymentModal(true);
                        }}
                        disabled={paymentProcessing}
                        className="bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentProcessing ? "Processing..." : "Pay Now"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffense(offense);
                          setAppealForm({
                            ...appealForm,
                            offenseId: offense.id,
                          });
                          setAppealModal(true);
                        }}
                        disabled={appealSubmitting}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {appealSubmitting ? "Submitting..." : "Appeal"}
                      </button>

                      <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Offenses Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              All Traffic Offenses
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {offenses.length} total
            </span>
          </div>

          <div className="space-y-4">
            {offenses.map((offense) => (
              <div
                key={offense.id}
                className={`border-l-4 ${getSeverityColor(
                  offense.severity
                )} border border-gray-200 rounded-r-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => setSelectedOffense(offense)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-[#0A2540] font-semibold text-lg">
                        {offense.type} - {offense.id}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClasses(
                          offense.status
                        )}`}
                      >
                        {offense.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{offense.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {offense.date} at {offense.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{offense.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0A2540]">
                      ${offense.fine.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Due: {offense.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Evidence Available</span>
                  </div>

                  <div className="flex space-x-3">
                    {offense.status === "Pending Payment" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffense(offense);
                          setPaymentModal(true);
                        }}
                        className="bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003D99] transition-colors"
                      >
                        Pay Now
                      </button>
                    )}

                    {offense.status !== "Under Appeal" &&
                      offense.status !== "Paid" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOffense(offense);
                            setAppealForm({
                              ...appealForm,
                              offenseId: offense.id,
                            });
                            setAppealModal(true);
                          }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Appeal
                        </button>
                      )}

                    <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offense Details Modal */}
        {selectedOffense && !paymentModal && !appealModal && (
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

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Offense ID
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedOffense.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Type
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedOffense.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Date & Time
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedOffense.date} at {selectedOffense.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Location
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedOffense.location}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Fine Amount
                      </label>
                      <p className="font-semibold text-[#0A2540] text-2xl">
                        ${selectedOffense.fine.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Due Date
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedOffense.dueDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-2">
                    Description
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {selectedOffense.description}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-2">
                    Evidence
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedOffense.evidence}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOffense(null)}
                className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal && selectedOffense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Payment Details
                </h2>
                <button
                  onClick={() => setPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-[#0A2540] font-semibold">
                    {selectedOffense.type}
                  </h3>
                  <p className="text-gray-600 text-sm">#{selectedOffense.id}</p>
                  <p className="text-2xl font-bold text-[#0A2540] mt-2">
                    ${selectedOffense.fine.toFixed(2)}
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
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
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
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-blue-800 text-sm">
                        <p className="font-semibold mb-1">Secure Payment:</p>
                        <p>
                          Your payment information is encrypted and processed
                          securely. A receipt will be emailed to you upon
                          completion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPaymentModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayment(selectedOffense)}
                  disabled={paymentProcessing}
                  className="flex-1 bg-[#0052CC] text-white px-4 py-3 rounded-lg hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {paymentProcessing
                      ? "Processing..."
                      : `Pay $${selectedOffense?.fine.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appeal Modal */}
        {appealModal && selectedOffense && (
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

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-[#0A2540] font-semibold">
                    {selectedOffense.type}
                  </h3>
                  <p className="text-gray-600 text-sm">#{selectedOffense.id}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Reason for Appeal
                    </label>
                    <select
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      value={appealForm.reason}
                      onChange={(e) =>
                        setAppealForm({ ...appealForm, reason: e.target.value })
                      }
                    >
                      <option value="">Select reason...</option>
                      <option value="incorrect_details">
                        Incorrect Details
                      </option>
                      <option value="not_driver">I was not the driver</option>
                      <option value="emergency">Emergency situation</option>
                      <option value="signage_issue">
                        Poor signage/visibility
                      </option>
                      <option value="equipment_malfunction">
                        Equipment malfunction
                      </option>
                      <option value="road_conditions">
                        Poor road conditions
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
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
                      value={appealForm.description}
                      onChange={(e) =>
                        setAppealForm({
                          ...appealForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-yellow-800 text-sm">
                        <p className="font-semibold mb-1">Important Notice:</p>
                        <p>
                          This appeal will be submitted for review. You can
                          track its status in the Appeal Management section.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setAppealModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAppealSubmit}
                  disabled={appealSubmitting}
                  className="flex-1 bg-[#0052CC] text-white px-4 py-3 rounded-lg hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-5 w-5" />
                  <span>
                    {appealSubmitting ? "Submitting..." : "Submit Appeal"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-red-800 text-sm">
                <p className="font-semibold mb-1">Payment Error:</p>
                <p>{paymentError}</p>
              </div>
            </div>
          </div>
        )}

        {appealError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-red-800 text-sm">
                <p className="font-semibold mb-1">Appeal Error:</p>
                <p>{appealError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffensesPage;
