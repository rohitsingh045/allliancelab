import { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/en";
import hi from "@/i18n/hi";

const translations = { en, hi };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app-lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-lang", lang);
  }, [lang]);

  const t = translations[lang] || translations.en;

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};
