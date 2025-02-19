import React from "react";
import { useLanguage } from "./LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  //Dropdown of language selector
  return (
    <select
      className="border p-2 rounded"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
};
export default LanguageSelector;