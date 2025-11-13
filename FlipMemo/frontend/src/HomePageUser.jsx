import { useState } from 'react';
import Header from './components/Header.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import DictionaryCard from './components/DictionaryCard.jsx';
import './css/homePage.css';
import { LANGUAGE, DICTIONARY } from './mockData.js';

function HomePageUser() {
  const [language, setLanguage] = useState(LANGUAGE[0]); 
  const dictionaries = DICTIONARY.filter(d => d.langId === language.langId);

  return (
    <>
      <Header />
      <div className="homepage-page">
        <div className="homepage-main-container">
          <LanguageSelector 
            language={language}
            onChange={setLanguage} 
          />
          *Ovo je testni primjer. Nije primljeno iz baze podataka*

          <div className="dictionary-list">
            {dictionaries.map((dict) => (
              <DictionaryCard 
                key={dict.dictId} 
                name={dict.dictName} 
                description={dict.description} 
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePageUser;
