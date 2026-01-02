import React from 'react';
import '../css/LanguageSelector.css';

const LanguageSelector = ({ language, languages = [], onChange }) => {
  const langs = languages.length ? languages : [];
  const value = language?.langid ?? '';

  return (
    <div className="language-selector-wrapper">
      <select
        value={value}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const lang = langs.find((l) => l.langid === selectedId);
          onChange(lang || null);
        }}
        className="language-selector"
      >
        <option value="" disabled hidden>Odaberi jezik</option>
        {langs.map((lang) => (
          <option key={lang.langid} value={lang.langid}>
            {lang.langname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
