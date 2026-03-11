import { useLang } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary text-sm font-medium text-foreground hover:border-primary transition-colors"
      title={lang === "en" ? "हिन्दी में बदलें" : "Switch to English"}
    >
      <Globe className="w-4 h-4 text-primary" />
      <span>{lang === "en" ? "हिन्दी" : "English"}</span>
    </button>
  );
};

export default LanguageSelector;
