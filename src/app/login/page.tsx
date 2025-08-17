import { Car } from "lucide-react";
import AuthForm from "../_component/auth/auth-form";

export const metadata = {
  title: "Login | DriveLaw",
  description: "Sign in to Ghana's traffic violation management platform.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col md:flex-row">
      {/* Left: Branding / Info */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#0A2540] border-r-4 text-white w-1/2 p-12">
        <div className="flex items-center space-x-2 mb-4">
          <Car className="h-20 w-20" />
          <span className="text-7xl font-semibold">DriveLaw</span>
        </div>
        <p className="text-lg text-gray-300 max-w-md text-center">
          Trusted access to your traffic records and violation history.
        </p>
      </div>

      {/* Right: Auth Form */}
      <div className="flex flex-1 justify-center items-center p-8">
        <AuthForm />
      </div>
    </div>
  );
}
