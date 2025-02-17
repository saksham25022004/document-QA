import React, { useState } from "react";
import axios from "axios";

const TextUpload = () => {
  const [textUpload, setTextUpload] = useState("");
  const [error, setError] =useState(null);

  //function to upload the text
  const handleTextUpload = async () => {
    if (!textUpload.trim()){
      setError("Please enter the text to upload!");
      return;
    } 
    try {
      //Api to upload the text
      await axios.post("http://localhost:5000/api/documents/upload-text", { textUpload });
      alert("Text uploaded successfully!");
      setTextUpload("");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="p-4 border-2 mt-1">
      {/* if the error occured */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Enter the Text */}
      <textarea
        className="w-full p-2 border rounded"
        value={textUpload}
        onChange={(e) => setTextUpload(e.target.value)}
        placeholder="Enter text..."
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={handleTextUpload}>
        Upload Text
      </button>
    </div>
  );
};
export default TextUpload;
