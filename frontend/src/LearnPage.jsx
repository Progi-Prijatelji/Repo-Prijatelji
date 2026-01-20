import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './components/Header.jsx';
import ForeignToNative from './components/ForeignToNative.jsx';
import NativeToForeign from './components/NativeToForeign.jsx';
import Writing from './components/Writing.jsx';
import Pronunciation from './components/Pronunciation.jsx';
import './css/LearnPage.css';

function LearnPage() {
  const { dictId, mode } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [allPhrases, setAllPhrases] = useState([]);
  
  const [loading, setLoading] = useState(true);


 

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://fmimage.onrender.com/homeUser/sendWordsInDictForUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ 
              email: localStorage.getItem('email'), 
              dictid: parseInt(dictId), 
              method: mode})
        });

        console.log('sendWordsInDictForUser response status:', response.status);

        const allWords = await fetch('https://fmimage.onrender.com/homeUser/showWords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ dictid: parseInt(dictId) })
        });

        const allWordsData = await allWords.json();
        if (allWordsData && allWordsData.success) {
          setAllWords(allWordsData.words);
          setAllPhrases(allWordsData.phrases);
        }
        
        const data = await response.json();
        console.log('sendWordsInDictForUser response body:', data);
        if (data && data.success) {
          
          setWords(data.words);
          
          
          
        } else {
          console.warn('No words returned or request not successful');
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
        <button className="back-button admin-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Nazad
        </button>
        

        {mode === 'fton' && (
          <ForeignToNative words={words} allWords={allWords} allPhrases={allPhrases} />
        )}

        {mode === 'ntof' && (
          <NativeToForeign words={words} allWords={allWords} allPhrases={allPhrases} />
        )}

        {mode === 'write' && (
          <Writing words={words} />
        )}

        {mode === 'speak' && (
          <Pronunciation words={words} />
        )}
      </div>
    </>
  );
}

export default LearnPage;
