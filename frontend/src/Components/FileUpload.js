import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContext";

const FileUpload = () => {
  const { texts } = useLanguage();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setUploadProgress(0); // Reset progress when a new file is selected
  };

  // Function to upload the file
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload!");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
    if (fileSizeMB > 100) {
      setError(`File size too large! (${fileSizeMB.toFixed(2)} MB). Maximum allowed is 100MB.`);
      setFile(""); // Clear the file input
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axios.post("http://localhost:5000/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border-2">
      {/* Display error message */}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* File input */}
      <input type="file" onChange={handleFileChange} accept=".pdf,.txt" className="mb-2" />

      {/* Upload button with integrated progress bar */}
      <div className="relative">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded overflow-hidden ${isUploading ? "cursor-not-allowed" : ""}`}
          onClick={handleFileUpload}
          disabled={isUploading}
        >
          <span className="relative z-10">
            {isUploading ? `Uploading ${uploadProgress}%` : texts.uploadBtn}
          </span>
          
          {/* Progress overlay inside button */}
          {isUploading && (
            <div 
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
