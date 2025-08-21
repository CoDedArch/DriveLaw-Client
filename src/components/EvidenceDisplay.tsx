import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

const EvidenceDisplay = () => {
  // Sample data - replace with your actual offenseDetails.evidence
  const evidence = [
    'https://drive-law-uploads.s3.eu-north-1.amazonaws.com/plates/UNKNOWN_20250819_110434.jpg',
  ];

  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  const handleImageLoad = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoadStart = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="mb-8">
      <h4 className="text-gray-600 text-sm mb-4">Evidence</h4>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidence.map((fileUrl, index) => {
          // More robust image detection including S3 URLs
          const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileUrl) || 
                         fileUrl.includes('picsum.photos') || 
                         fileUrl.includes('placeholder') ||
                         fileUrl.includes('amazonaws.com') ||
                         fileUrl.startsWith('data:image/');
          
          const filename = fileUrl.split("/").pop() || "Unknown file";

          return (
            <div
              key={index}
              className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            >
              {isImage ? (
                <div>
                  {/* Image preview placeholder since S3 forces download */}
                  <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border-b">
                    <div className="text-center text-blue-600">
                      <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">Image File</p>
                      <p className="text-xs opacity-75">Click to download & view</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-700 truncate" title={filename}>
                      {filename}
                    </p>
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 block font-medium"
                    >
                      📥 Download & View Image
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-700 truncate block" title={filename}>
                      {filename}
                    </span>
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                    >
                      Open file
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceDisplay;