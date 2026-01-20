import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import DictionaryCard from './components/DictionaryCard.jsx';
import { Pen, Mic, Languages, BookA} from 'lucide-react';
import './css/homePage.css';
import Flag from 'react-flagkit';

function HomePageUser() {
  const [languages, setLanguages] = useState([]);
  const [dictionaries, setDictionaries] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      const s = localStorage.getItem('selectedLanguage');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
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

        const langRes = await fetch('https://fmimage.onrender.com/homeUser/sendLangList', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const langData = await langRes.json();
        if (langData.success && langData.langs.length > 0) {
          
          let filtered = langData.langs.filter(lang => lang.langid !== 1);
          if (filtered.length === 0) filtered = langData.langs;
          setLanguages(filtered);
          
          try {
            const stored = localStorage.getItem('selectedLanguage');
            const parsed = stored ? JSON.parse(stored) : null;
            if (parsed && filtered.find(l => Number(l.langid) === Number(parsed.langid))) {
              setSelectedLanguage(parsed);
            } else {
              setSelectedLanguage(filtered[0] ?? null);
            }
          } catch {
            setSelectedLanguage(filtered[0] ?? null);
          }
        }
      } catch (err) {
        console.error('Greška pri dohvaćanju podataka:', err);
      }
    };

    if (token) fetchData();
  }, [token]);

  
  useEffect(() => {
    try {
      if (selectedLanguage) localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
      else localStorage.removeItem('selectedLanguage');
    } catch {}
  }, [selectedLanguage]);

  const handleCardClick = (dict) => {
    setSelectedDict(dict);
    console.log("Selected dictionary lang img:", languages.find(l => Number(l.langid) === Number(dict.langid))?.langImg);
  }
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
                <h2>{selectedDict.dictname.charAt(0).toUpperCase() + selectedDict.dictname.slice(1)}</h2>
                <p><strong>Opis:</strong> {selectedDict.description.charAt(0).toUpperCase() + selectedDict.description.slice(1)}</p>
                <p>
                  <strong>Jezik:</strong> 
                  <Flag country={languages.find(l => Number(l.langid) === Number(selectedDict.langid))?.langImg} />
                  {selectedLanguage?.langname.charAt(0).toUpperCase() + selectedLanguage?.langname.slice(1) ?? '---'}
                </p>
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
