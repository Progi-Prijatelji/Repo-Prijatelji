import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import DictionaryCard from './components/DictionaryCard.jsx';
import { Pen, Mic, Languages, BookA} from 'lucide-react';
import './css/homePage.css';

function HomePageUser() {
  const [languages, setLanguages] = useState([]);
  const [dictionaries, setDictionaries] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDict, setSelectedDict] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dictRes = await fetch('https://fmimage.onrender.com/homeAdmin/sendDictList', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const dictData = await dictRes.json();
        if (dictData.success) setDictionaries(dictData.dicts);

        const langRes = await fetch('https://fmimage.onrender.com/homeAdmin/sendLangList', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const langData = await langRes.json();
        if (langData.success && langData.langs.length > 0) {
          setLanguages(langData.langs.filter(lang => lang.langid !== 1));
          setSelectedLanguage(langData.langs[0]);
        }
      } catch (err) {
        console.error('Greška pri dohvaćanju podataka:', err);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleCardClick = (dict) => setSelectedDict(dict);
  const closeModal = () => setSelectedDict(null);
  const handleModeClick = (mode) => {
    if (!selectedDict) return;
    navigate(`/learn/${selectedDict.dictid}/${mode}`);
  };

  return (
    <>
      <Header />
      <div className="homepage-page">
        <div className="homepage-main-container">
          <LanguageSelector
            language={selectedLanguage}
            languages={languages}
            onChange={setSelectedLanguage}
          />
          <div className="dictionary-list">
            {selectedLanguage && dictionaries
              .filter((dict) =>
                !selectedLanguage || Number(dict.langid) === Number(selectedLanguage.langid)
              )
              .map((dict) => (
                <div key={dict.dictid} onClick={() => handleCardClick(dict)}>
                  <DictionaryCard name={dict.dictname} description={dict.description} />
                </div>
              ))}
          </div>

          {selectedDict && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>✕</button>
                <h2>{selectedDict.dictname}</h2>
                <p><strong>Opis:</strong> {selectedDict.description}</p>
                <p><strong>Jezik:</strong> {selectedLanguage?.langname ?? '---'}</p>
                <h2>Odaberi mod:</h2>
                <div className="mods-grid">
                  <div className="mod-card" onClick={() => handleModeClick('fton')}>
                    <BookA color="black" size="30"/><p>Strani u materinji</p>
                  </div>
                  <div className="mod-card" onClick={() => handleModeClick('ntof')}>
                    <Languages color="black" size="30"/><p>Materinji u strani</p>
                  </div>
                  <div className="mod-card" onClick={() => handleModeClick('write')}>
                    <Pen color="black" size="30"/><p>Pisanje</p>
                  </div>
                  <div className="mod-card" onClick={() => handleModeClick('speak')}>
                    <Mic color="black" size="30"/><p>Izgovor</p>
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
