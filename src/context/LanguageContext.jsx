import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Remember the user's choice across refreshes (defaults to English).
  const [lang, setLang] = useState(
    () => localStorage.getItem("kalasetu_lang") || "en"
  );

  useEffect(() => {
    localStorage.setItem("kalasetu_lang", lang);
  }, [lang]);

  function toggleLang() {
    setLang((prev) => (prev === "en" ? "te" : "en"));
  }

  // The translator: t("nav_home") -> "Home" or "హోమ్" depending on lang.
  function t(key) {
    return translations[lang][key] || translations.en[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}