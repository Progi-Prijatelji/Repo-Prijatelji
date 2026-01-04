import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ForeighToNative from './components/ForeignToNative.jsx';
import NativeToForeign from './components/NativeToForeign.jsx';
import Writing from './components/Writing.jsx';
import Pronunciation from './components/Pronunciation.jsx';
import './css/LearnPage.css';

function LearnPage() {
  const { dictId, mode } = useParams();
  const [dictionary, setDictionary] = useState('');
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://fmimage.onrender.com/homeAdmin/showWords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ dictid: parseInt(dictId) })
        });


        const dictRes = await fetch('https://fmimage.onrender.com/homeAdmin/sendDictList', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        const dictData = await dictRes.json();
        if (dictData.success) {
          const foundDict = dictData.dicts.find(d => d.dictid === parseInt(dictId));
          if (foundDict) setDictionary(foundDict.dictName); // Koristi setter
        }

        const data = await response.json();
        if(data.success){
          setWords(data.words);
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [dictId]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  return (
    <>
      <Header />
      <div className="learn-page">
        <button className="back-button" onClick={() => navigate(-1)}>Nazad</button>
        

        {mode === 'foreign-to-native' && (
          <ForeighToNative words={words} />
        )}

        {mode === 'native-to-foreign' && (
          <NativeToForeign words={words} />
        )}

        {mode === 'writing' && (
          <Writing words={words} />
        )}

        {mode === 'pronunciation' && (
          <Pronunciation words={words} />
        )}
      </div>
    </>
  );
}

export default LearnPage;
