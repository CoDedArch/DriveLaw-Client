import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Traffic Light Loader */}
        <div className="relative">
          <div className="w-16 h-40 bg-gray-800 rounded-lg flex flex-col items-center justify-around p-2">
            {/* Red Light */}
            <div className="w-10 h-10 rounded-full bg-red-500 animate-pulse animation-delay-0"></div>
            {/* Yellow Light */}
            <div className="w-10 h-10 rounded-full bg-yellow-500 animate-pulse animation-delay-300"></div>
            {/* Green Light */}
            <div className="w-10 h-10 rounded-full bg-green-500 animate-pulse animation-delay-600"></div>
          </div>
        </div>

       

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            DriveLaw
          </h2>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-gray-300 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 border-2 border-gray-300 rounded-full"></div>
      </div>

      <style jsx>{`
        .animation-delay-0 {
          animation-delay: 0s;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.5rem);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;