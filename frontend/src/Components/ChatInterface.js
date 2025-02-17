import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatHistory from "./ChatHistory";
import FileUpload from "./FileUpload";
import TextUpload from "./TextUpload";
import DocumentSummarizer from "./DocumentSummarizer";
import ChatInput from "./ChatInput";

const ChatInterface = () => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    //scrolldown the history chat at the bottom
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [qaHistory, loading]);

  useEffect(() => {
    //Get all Previously asked Question-Answer
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/documents/previous");
        setQaHistory(res.data);
      } catch (error) {
        setError("Error fetching history");
      }
    };
    fetchHistory();
  }, []);

  const handleAskQuestion = async () => {
    //if the question is not entered it will show error
    if (!question.trim()) {
      setError("Please enter a question before asking.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      //Api for ask question to the AI
      const res = await axios.post("http://localhost:5000/api/documents/ask", { question });
      setQaHistory([...qaHistory, { question, answer: res.data.answer }]); // add the new Question-Answer in the History array
      setQuestion("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className='flex justify-center text-2xl font-bold my-2'>Document Summarizer & Question Answering</h2>
      <div className="max-w-7xl h-[658px] mx-auto p-4 flex flex-col md:flex-row gap-6">
        {/* Left Section - Chat */}
        <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md flex flex-col border-2">
          {error && <div className="text-red-500 mb-2">{error}</div>}

          {/* Chat History */}
          <ChatHistory qaHistory={qaHistory} loading={loading} chatBoxRef={chatBoxRef} />

          <div className="flex items-center space-x-4 w-full">
            {/* Upload Button */}
            <button onClick={() => setIsModalOpen(true)} className="mt-2  bg-blue-50 text-white px-2 py-2 rounded-full hover:bg-blue-100 text-xl"> &#10133;	</button>

            {/* Chat Input */}
            <ChatInput question={question} setQuestion={setQuestion} handleAskQuestion={handleAskQuestion} />
          </div>
        </div>

        {/* Right Section - Summarizer */}
        <div className="w-full md:w-1/3 bg-white p-2 rounded-lg shadow-md flex flex-col gap-4 border-2"> <DocumentSummarizer /></div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

              {/* Close Button */}
              <button onClick={() => setIsModalOpen(false)} className="text-red absolute right-5 top-3">&#10060;</button>

              <h2 className="text-lg font-bold mb-4">Upload File or Text</h2>
              
              {/* File & Text Upload */}
              <FileUpload />
              <TextUpload />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ChatInterface;