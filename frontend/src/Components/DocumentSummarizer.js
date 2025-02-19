import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, CheckCircle, BarChart2, Cpu, BookOpen } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const DocumentSummarizer = () => {
  const { texts, language } = useLanguage();
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  
  //Display Animation when the data is being loaded 
  const animationSteps = [
    { icon: <Cpu className="text-purple-500" />, text: "Processing document..." },
    { icon: <BarChart2 className="text-purple-500" />, text: "Analyzing content..." },
    { icon: <BookOpen className="text-purple-500" />, text: "Generating summary..." }
  ];
  
  useEffect(() => {
    //When the the summary is being generated
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < animationSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
      
      // Complete the animation sequence after 4 seconds
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setShowSummary(true);
        clearInterval(interval);
      }, 4000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isGenerating]);
  
  const handleSummarize = async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    setShowSummary(false);
    
    try {
      //Api for generating the summary
      const res = await axios.post("http://localhost:5000/api/documents/summarize", {language});
      setSummary(res.data.summary);
    } catch (error) {
      setError(error.message);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {error && <div className="text-red-500">{error}</div>}
      <div className="relative flex-1">

        {/* It will render the api is not called */}
        {!isGenerating && !showSummary && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 animate-fade-in">
            <FileText size={48} className="text-purple-400 mb-4" />
            <p className="text-center text-gray-600 mb-6">
              {texts.summaryContent}
            </p>
            <button
              onClick={handleSummarize}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {texts.summarizeButton}
            </button>
          </div>
        )}
        
        {/* It will render when the api is called */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-50 rounded-lg p-6 overflow-hidden animate-fade-in">
            {/* Animated ring background */}
            <div className="absolute w-52 h-52 border-4 border-purple-200 rounded-full animate-ping opacity-25"></div>
            <div className="absolute w-40 h-40 border-4 border-purple-300 rounded-full animate-pulse"></div>
            
            {/* Current step animation */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <div className="animate-bounce">
                  {animationSteps[currentStep].icon}
                </div>
              </div>
              <p key={currentStep} className="text-purple-700 font-medium text-center animate-fade-in">
                {animationSteps[currentStep].text}
              </p>
            </div>
          </div>
        )}
        
        {/* If the summary is generated if will render */}
        {showSummary && (
          <div className="absolute inset-0 flex flex-col bg-white rounded-lg shadow-inner animate-fade-in overflow-auto">
            {/* Summary reveal animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent opacity-0 animate-fade-out"></div>
            
            <div className="p-4 flex-1">
              <div className="flex items-center mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <h3 className="text-md font-medium">Summary Generated</h3>
              </div>
              
              <div className="prose max-w-none p-3 bg-white rounded-md border border-purple-100">
                {summary.split('. ').filter(Boolean).map((sentence, idx) => (
                  <p 
                    key={idx} 
                    className="mb-2 opacity-0 animate-slide-up"
                    style={{ animationDelay: `${idx * 150 + 300}ms` }}
                  >
                    {sentence}.
                  </p>
                ))}
              </div>
              
              {/* Regenerate the Uploaded Document */}
              <div className="mt-4 flex justify-end opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
                <button
                  onClick={handleSummarize}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSummarizer;