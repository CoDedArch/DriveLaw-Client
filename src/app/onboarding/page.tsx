import { Car } from "lucide-react";
import OnboardingForm from "../_component/auth/onboarding-form";

export const metadata = {
  title: "Onboarding | DriveLaw",
  description:
    "Complete your registration for Ghana's traffic violation management platform.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row">
      {/* Left: Info / Branding */}
          <div className="hidden md:flex flex-col justify-center items-center bg-[#0A2540] text-white w-1/2 p-12">
              <div>
                  <Car className="h-40 w-40" />
              </div>
        <h1 className="text-6xl font-bold mb-4">Welcome to DriveLaw</h1>
        <p className="text-lg text-gray-300 max-w-md text-center">
          Let’s set up your account so you can securely manage your traffic
          records and stay compliant with Ghana’s road regulations.
        </p>
      </div>

      {/* Right: Onboarding Form */}
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#0A2540] mb-6 text-center">
            Complete Your Registration
          </h2>
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
