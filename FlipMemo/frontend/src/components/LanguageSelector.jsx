import React from 'react';
import '../css/LanguageSelector.css';
import { LANGUAGE } from '../mockData';

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="language-selector-wrapper">
      <select 
        value={language.langId} 
        onChange={(e) => {
          const lang = LANGUAGE.find(l => l.langId === Number(e.target.value));
          onChange(lang);
        }}
        className="language-selector"
      >
        {LANGUAGE.map((lang) => (
          <option key={lang.langId} value={lang.langId}>
            {lang.langName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
