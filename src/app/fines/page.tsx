"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  X,
  DollarSign,
  TrendingUp,
  Receipt,
  ArrowLeft,
  AlertTriangle,
  FileText,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  Payment,
  useDashboard,
  usePayments,
  usePaymentSummary,
  useProcessPayment,
} from "../data/queries";

const FinesPage = () => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    method: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Use real data hooks
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = usePayments();
  const {
    summary: paymentSummary,
    loading: summaryLoading,
    error: summaryError,
  } = usePaymentSummary();
  const { processPayment, loading: processingPayment } = useProcessPayment();

  // Loading state
  if (dashboardLoading || paymentsLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0052CC] mx-auto mb-4" />
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError || paymentsError || summaryError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  const driverData = dashboardData?.driverData;
  const paymentHistory = payments || [];
  const outstandingAmount = paymentSummary?.outstandingAmount || 0;
  const outstandingCount = paymentSummary?.outstandingCount || 0;
  const thisMonthAmount = paymentSummary?.thisMonthAmount || 0;
  const thisMonthCount = paymentSummary?.thisMonthCount || 0;
  const totalPaidAmount = paymentSummary?.totalPaidAmount || 0;
  const totalPaidCount = paymentSummary?.totalPaidCount || 0;

  const handlePayment = async () => {
    if (!driverData) return;

    try {
      // Get outstanding offense IDs - you might need to fetch offenses separately
      // For now, using a placeholder. You may need to implement a way to get outstanding offense IDs
      const outstandingOffenseIds: string[] = []; // This should be populated with actual outstanding offense IDs

      await processPayment({
        offenseIds: outstandingOffenseIds,
        amount: outstandingAmount,
        method: paymentForm.method,
        cardDetails: {
          cardNumber: paymentForm.cardNumber,
          expiryDate: paymentForm.expiryDate,
          cvv: paymentForm.cvv,
          nameOnCard: paymentForm.nameOnCard,
        },
      });

      // Refresh data after successful payment
      refetchPayments();
      setPaymentModal(false);
      setPaymentForm({
        method: "credit",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
      });
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle error (show toast, etc.)
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Failed":
      case "failed":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "completed":
        return "bg-green-50 text-green-800 border-green-200";
      case "Pending":
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "Failed":
      case "failed":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "debit card":
      case "credit":
      case "debit":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                Traffic Fines & Payments
              </h1>
              <p className="text-gray-600">
                Manage your outstanding fines and payment history
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Payment Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-6">
            Payment Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-red-800 font-semibold">
                  Outstanding Amount
                </h3>
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-[#0A2540]">
                ${outstandingAmount.toFixed(2)}
              </p>
              <p className="text-red-600 text-sm mt-2">
                {outstandingCount} pending fines
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-blue-800 font-semibold">This Month</h3>
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-[#0A2540]">
                ${thisMonthAmount.toFixed(2)}
              </p>
              <p className="text-blue-600 text-sm mt-2">
                {thisMonthCount} fines issued
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-green-800 font-semibold">Total Paid</h3>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-[#0A2540]">
                ${totalPaidAmount.toFixed(2)}
              </p>
              <p className="text-green-600 text-sm mt-2">
                {totalPaidCount} transactions
              </p>
            </div>
          </div>

          {outstandingAmount > 0 && (
            <button
              onClick={() => setPaymentModal(true)}
              disabled={processingPayment}
              className="w-full bg-[#0052CC] text-white py-4 rounded-lg font-semibold hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPayment ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              <span>
                {processingPayment
                  ? "Processing..."
                  : `Pay Outstanding Fines ($${outstandingAmount.toFixed(2)})`}
              </span>
            </button>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0A2540]">
              Payment History
            </h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {paymentHistory.length} transactions
            </span>
          </div>

          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-[#0A2540] font-semibold text-lg">
                      {payment.type} - {payment.offenseId}
                    </h4>
                    <div className="flex items-center space-x-4 text-gray-600 text-sm mt-2">
                      {payment.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{payment.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(payment.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(payment.method)}
                        <span>{payment.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0A2540] mb-2">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm border flex items-center space-x-1 ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    Payment ID: {payment.id}
                  </p>
                  <button className="text-[#0052CC] hover:text-[#003D99] transition-colors text-sm">
                    View Receipt →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {paymentHistory.length === 0 && (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No payment history</p>
              <p className="text-gray-400 text-sm">
                Your completed payments will appear here
              </p>
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[#0A2540] font-bold text-lg mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Payment Information</span>
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Payments are processed immediately and securely</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                Digital receipts are automatically generated for all
                transactions
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                Multiple payment methods accepted (Credit/Debit, Bank Transfer,
                Digital Wallet)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Payment confirmation sent via email and SMS</p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p>Late payment fees may apply for overdue fines after 30 days</p>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {paymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Pay Outstanding Fines
                </h2>
                <button
                  onClick={() => setPaymentModal(false)}
                  disabled={processingPayment}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-red-800 font-semibold">
                    Total Outstanding
                  </h3>
                  <p className="text-3xl font-bold text-[#0A2540] mt-2">
                    ${outstandingAmount.toFixed(2)}
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    {outstandingCount} pending violations
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Payment Method
                    </label>
                    <select
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      value={paymentForm.method}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          method: e.target.value,
                        })
                      }
                      disabled={processingPayment}
                    >
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      value={paymentForm.nameOnCard}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          nameOnCard: e.target.value,
                        })
                      }
                      disabled={processingPayment}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                      value={paymentForm.cardNumber}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          cardNumber: e.target.value,
                        })
                      }
                      disabled={processingPayment}
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
                        value={paymentForm.expiryDate}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            expiryDate: e.target.value,
                          })
                        }
                        disabled={processingPayment}
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
                        value={paymentForm.cvv}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            cvv: e.target.value,
                          })
                        }
                        disabled={processingPayment}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-blue-800 text-sm">
                      <p className="font-semibold mb-1">Secure Payment:</p>
                      <p>
                        Your payment information is encrypted and processed
                        securely. You will receive a confirmation email once
                        payment is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPaymentModal(false)}
                  disabled={processingPayment}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="flex-1 bg-[#0052CC] text-white px-4 py-3 rounded-md hover:bg-[#003D99] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayment ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  <span>
                    {processingPayment
                      ? "Processing..."
                      : `Pay $${outstandingAmount.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#0A2540]">
                  Payment Details
                </h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Payment ID
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedPayment.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Offense ID
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedPayment.offenseId}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Violation Type
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedPayment.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Location
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedPayment.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Payment Date
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {formatDate(selectedPayment.date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium">
                        Payment Method
                      </label>
                      <p className="font-semibold text-[#0A2540]">
                        {selectedPayment.method}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="text-gray-600 text-sm font-medium block">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                            selectedPayment.status
                          )}`}
                        >
                          {getStatusIcon(selectedPayment.status)}
                          <span className="capitalize">
                            {selectedPayment.status}
                          </span>
                        </span>
                      </div>
                      <div className="text-right">
                        <label className="text-gray-600 text-sm font-medium block">
                          Amount
                        </label>
                        <p className="text-3xl font-bold text-[#0A2540]">
                          ${selectedPayment.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-green-600" />
                    <h3 className="text-green-800 font-semibold">
                      Receipt Available
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    A digital receipt has been sent to your registered email
                    address
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full mt-6 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinesPage;
