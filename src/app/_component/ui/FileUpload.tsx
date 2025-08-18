import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
}

function FileUpload({ onFileChange, file }: FileUploadProps) {
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation (max 10MB, allowed types)
  const validateFile = (file: File): string | null => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "video/mp4"];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (!allowedTypes.includes(file.type)) {
      return `File ${file.name} has unsupported type. Allowed: PDF, JPG, PNG, MP4`;
    }
    if (file.size > maxSize) {
      return `File ${file.name} exceeds 10MB limit`;
    }
    return null;
  };

  // Handle file selection (click or drop)
  const handleFileChange = (files: FileList) => {
    setFileError(null);
    const selectedFile = files[0]; // Take only the first file
    if (!selectedFile) {
      onFileChange(null);
      return;
    }
    const error = validateFile(selectedFile);
    if (error) {
      setFileError(error);
      onFileChange(null);
      return;
    }
    onFileChange(selectedFile);
  };

  // Trigger file input click
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  // Handle drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileChange(files);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Supporting Evidence
      </label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0052CC] transition-colors cursor-pointer"
        onClick={handleDivClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">
          Drag and drop a file here or click to browse
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Supports: PDF, JPG, PNG, MP4 (max 10MB)
        </p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.mp4"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files!)}
        />
      </div>
      {file && (
        <p className="mt-2 text-sm text-gray-600">{file.name}</p>
      )}
      {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
    </div>
  );
}

export default FileUpload;