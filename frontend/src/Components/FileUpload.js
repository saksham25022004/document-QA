import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  //If the new file is added
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  //Function to upload the file based document
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload!");
      return;
    }
    const formData = new FormData();
    formData.append("document", file);

    try {
      //Api to upload the file based document
      await axios.post("http://localhost:5000/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 border-2">
      {/* If the error occured */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Select the file */}
      <input type="file" onChange={handleFileChange} accept=".pdf,.txt" className="mb-2" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleFileUpload}>
        Upload File
      </button>
      
    </div>
  );
};
export default FileUpload;
