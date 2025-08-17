"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Mail,
  Car,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Use-Toast";

// Zod validation schema
const phoneRegex = /^[0-9]{9,10}$/;

const registerSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters"),
  email: z.string().email("Please enter a valid email address"),
  gender: z.enum(["Male", "Female"], {
    message: "Please select a gender",
  }),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }, "You must be at least 16 years old"),
  contact: z
    .string()
    .regex(phoneRegex, "Contact number must be 9-10 digits")
    .refine(
      (phone) => phone.length >= 9,
      "Contact number must be at least 9 digits"
    ),
  nationality: z.string().min(1, "Nationality is required"),
  nationalid: z.enum(["Ghana Card", "Passport", "Driver's License"], {
    message: "Please select an ID type",
  }),
  idnumber: z
    .string()
    .min(1, "ID number is required")
    .max(20, "ID number must be less than 20 characters"),
  region: z.string().min(1, "Please select a region"),
  role: z.enum(["driver", "officer", "admin"], {
    message: "Please select a role",
  }),
  gpsaddress: z
    .string()
    .min(1, "GPS address is required")
    .regex(
      /^[A-Z]{2}-\d{3}-\d{4}$/,
      "GPS address must be in format: GA-123-4567"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface FieldErrors {
  email?: string;
  contact?: string;
  idnumber?: string;
  alt_contact?: string;
}

const OnboardingForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    email: "",
    gender: "" as "Male" | "Female",
    dob: "",
    contact: "",
    nationality: "Ghanaian",
    nationalid: "" as "Ghana Card" | "Passport" | "Driver's License",
    idnumber: "",
    region: "",
    role: "driver" as "driver" | "officer" | "admin",
    gpsaddress: "",
  });

  const regions = [
    "Northern",
    "Savana",
    "Eastern",
    "Western",
    "Central",
    "Greater Accra",
    "Volta",
    "Upper East",
    "Upper West",
    "Western North",
    "Oti",
    "Ahafo",
    "Bono",
    "Bono East",
    "Ashanti",
    "Eastern North",
  ];

  const nationalIds = ["Ghana Card", "Passport", "Driver's License"];

  const roles = [
    { value: "driver", label: "Driver" },
    { value: "officer", label: "Traffic Officer" },
    { value: "admin", label: "Administrator" },
  ];

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Special handling for phone number - only allow digits
    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      setRegisterData((prev) => ({
        ...prev,
        [name]: digitsOnly,
      }));
      return;
    }

    // Special handling for GPS address - format as user types
    if (name === "gpsaddress") {
      let formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

      // Format: GA-123-4567 (2 letters, dash, 3 digits, dash, 4 digits)
      if (formattedValue.length > 2 && formattedValue.length <= 5) {
        formattedValue =
          formattedValue.slice(0, 2) + "-" + formattedValue.slice(2);
      } else if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 2) +
          "-" +
          formattedValue.slice(2, 5) +
          "-" +
          formattedValue.slice(5, 9);
      }

      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(registerData);
      setErrors({});
      setGeneralError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setGeneralError("");
      } else {
        // Handle non-ZodError cases
        setGeneralError("Validation failed. Please check your inputs.");
        console.error("Validation error:", error);
      }
      return false;
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({}); // Clear previous field errors

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Format the phone number for submission (add +233 prefix)
      const formattedContact = `+233${registerData.contact}`;

      const { ...userData } = registerData;
      const payload = {
        ...userData,
        contact: formattedContact, // Use formatted phone number
      };

      console.log("Sending registration data:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}onboarding/user/onboarding/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle structured error responses
        if (response.status === 409 && errorData.detail?.errors) {
          // Handle field-specific validation errors
          const newFieldErrors: FieldErrors = {};
          let hasFieldErrors = false;

          errorData.detail.errors.forEach((error) => {
            hasFieldErrors = true;

            // Map backend field names to frontend field names
            switch (error.field) {
              case "email address":
              case "email":
                newFieldErrors.email = error.message;
                break;
              case "phone number":
              case "phone":
                newFieldErrors.contact = error.message;
                break;
              case "alternative phone number":
              case "alt_phone":
                newFieldErrors.alt_contact = error.message;
                break;
              case "national ID number":
              case "national_id":
                newFieldErrors.idnumber = error.message;
                break;
              default:
                // For unknown fields, show as general error
                setGeneralError(error.message);
            }
          });

          if (hasFieldErrors) {
            setFieldErrors(newFieldErrors);

            // Also set a general error message and show toast
            const generalErrorMsg =
              errorData.detail.message ||
              "Please correct the highlighted fields";
            setGeneralError(generalErrorMsg);

            toast({
              title: "Registration Failed",
              description: generalErrorMsg,
              variant: "destructive",
            });
          }

          return; // Don't throw, we've handled the errors
        }

        // Handle other error responses
        throw new Error(
          errorData.detail?.message ||
            errorData.detail ||
            errorData.message ||
            "Registration failed"
        );
      }

      const result = await response.json();

      // Success handling
      console.log("Registration successful:", result);
      router.push("/");

      // Show success message
      toast({
        title: "Registration Successful",
        description:
          "Welcome to DriveLaw! Your onboarding has been completed successfully.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Registration error:", err);

      let errorMessage = "Registration failed. Please try again.";

      // Handle different types of errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setGeneralError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName];
  };

  const hasError = (fieldName: string) => {
    return !!errors[fieldName];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl flex justify-center items-center gap-4 font-extrabold text-gray-900">
            <Car className="h-10 w-10" />
            DriveLaw
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        {/* General Error Display */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleRegisterSubmit}
          className="mt-8 space-y-6 text-black"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    value={registerData.firstname}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("firstname")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your first name"
                  />
                  {getFieldError("firstname") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("firstname")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    value={registerData.lastname}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("lastname")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your last name"
                  />
                  {getFieldError("lastname") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("lastname")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={registerData.gender}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("gender")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {getFieldError("gender") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("gender")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth *
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    value={registerData.dob}
                    onChange={handleRegisterChange}
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 16)
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("dob")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {getFieldError("dob") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("dob")}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("email")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {getFieldError("email") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <div className="relative flex">
                  <div className="absolute inset-y-0 left-0 flex items-center z-10 pointer-events-none">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-l-md h-full border border-r-0 border-gray-300">
                      <img
                        src="https://flagcdn.com/w20/gh.png"
                        alt="Ghana flag"
                        className="w-5 h-3.5 rounded-sm"
                      />
                      <span className="text-gray-700 text-sm font-medium">
                        +233
                      </span>
                    </div>
                  </div>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    required
                    value={registerData.contact}
                    onChange={handleRegisterChange}
                    className={`w-full pl-50 pr-4 py-2 border rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative z-0 ${
                      hasError("contact")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="24 123 4567"
                    maxLength={11}
                  />
                </div>
                {getFieldError("contact") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("contact")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nationalid"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Type *
                  </label>
                  <select
                    id="nationalid"
                    name="nationalid"
                    required
                    value={registerData.nationalid}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("nationalid")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  >
                    <option value="">Select ID Type</option>
                    {nationalIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                  {getFieldError("nationalid") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("nationalid")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="idnumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Number *
                  </label>
                  <input
                    id="idnumber"
                    name="idnumber"
                    type="text"
                    required
                    value={registerData.idnumber}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("idnumber")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter ID number"
                  />
                  {getFieldError("idnumber") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("idnumber")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Region *
                  </label>
                  <select
                    id="region"
                    name="region"
                    required
                    value={registerData.region}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("region")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {getFieldError("region") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("region")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      hasError("role")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {getFieldError("role") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldError("role")}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="gpsaddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  GPS Address *
                </label>
                <input
                  id="gpsaddress"
                  name="gpsaddress"
                  type="text"
                  required
                  value={registerData.gpsaddress}
                  onChange={handleRegisterChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    hasError("gpsaddress")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="GA-123-4567"
                  maxLength={11}
                />
                {getFieldError("gpsaddress") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("gpsaddress")}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: GA-123-4567 (2 letters, dash, 3 digits, dash, 4
                  digits)
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0052CC] hover:bg-[#003D99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Form validation summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Help text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
