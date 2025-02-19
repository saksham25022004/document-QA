import React from "react";
import ChatInterface from "./Components/ChatInterface";
import { LanguageProvider } from "./Components/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <ChatInterface />
    </LanguageProvider>
  );
}

export default App;