import React, { createContext, useState, useContext } from "react";
import languages from "./Language";

// Create Context
const LanguageContext = createContext();

// Custom Hook
export const useLanguage = () => useContext(LanguageContext);

// Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, texts: languages[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};