const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ta", label: "TA" },
  { code: "hi", label: "HI" },
  { code: "ml", label: "ML" },
];

function LanguageSwitcher({ activeLang, onChange }) {
  return (
    <div className="lang-switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`lang-tab ${activeLang === lang.code ? "lang-tab-active" : ""}`}
          onClick={() => onChange(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;