import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import DictionaryCard from './components/DictionaryCard.jsx';
import { Pen, Mic, Languages, BookA} from 'lucide-react';
import './css/homePage.css';
import { LANGUAGE, DICTIONARY } from './mockData.js';


function HomePageUser() {
  const [language, setLanguage] = useState(LANGUAGE[0]); 
  const [selectedDict, setSelectedDict] = useState(null);
  const navigate = useNavigate();
  const [dictionaries, setDictionaries] = useState([]);

  useEffect(() => {
    
  })


  const handleCardClick = (dict) => {
    setSelectedDict(dict);
  };

  const closeModal = () => {
    setSelectedDict(null);
  };

  const handleModeClick = (mode) => {
    navigate(`/learn/${selectedDict.dictId}/${mode}`);
  };

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
              <div key={dict.dictName} onClick={() => handleCardClick(dict)}>
                <DictionaryCard 
                  name={dict.dictName} 
                  description={dict.description} 
                />

              </div>
            ))}
          </div>

          {selectedDict && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>✕</button>
                <h2>{selectedDict.dictName}</h2>
                <p><strong>Opis:</strong> {selectedDict.description}</p>
                <p><strong>Jezik:</strong> {language.langName}</p>
                <h2>Odaberi mod:</h2>
                <div className="mods-grid">
                  <div className="mod-card" onClick={() => handleModeClick('foreign-to-native')}>
                    <BookA color="black" size="30"/>
                    <p>Strani u materinji</p>
                  </div>
                  <div className="mod-card" onClick={() => handleModeClick('native-to-foreign')}>
                    <Languages color="black" size="30"/>
                    <p>Materinji u strani</p>
                  </div>
                  <div className="mod-card" onClick={() => handleModeClick('writing')}>
                    <Pen color="black" size="30"/>
                    <p>Pisanje</p>
                  </div>    
                  <div className="mod-card" onClick={() => handleModeClick('pronunciation')}>
                    <Mic color="black" size="30"/>
                    <p>Izgovor</p>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePageUser;
