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
  const [wordIds, setWordIds] = useState([]);
  const [translations, setTranslations] = useState([]);
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
          body: JSON.stringify({ email: localStorage.getItem('email'), dictid: parseInt(dictId), method: mode})
        });

        console.log('sendWordsInDictForUser response status:', response.status);


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
        console.log('sendWordsInDictForUser response body:', data);
        if (data && data.success) {
          
          setWords(data.words);
          
          setWordIds(data.words.map(w => w.wordID));
          setTranslations(data.words.map(w => w.translation));
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
        <button className="back-button" onClick={() => navigate(-1)}>Nazad</button>
        

        {mode === 'foreign-to-native' && (
          <ForeighToNative words={words} translations={translations} />
        )}

        {mode === 'native-to-foreign' && (
          <NativeToForeign words={words} translations={translations} />
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

// router.post('/sendWordsInDictForUser', verifyToken, async (req, res) =>{
//   const {email, dictid, method} = req.body     

//   try {
//     const userResult = await client.query(`SELECT userid FROM users WHERE email = $1`,[email]);
//     const userid = userResult.rows[0].userid;

//     await updateWords(userid);

//     const returnWords = await client.query(`SELECT w.word AS word, w.wordid AS wordID, t.word AS translation
//                                             FROM dictword dw 
//                                             JOIN words w ON w.wordid = dw.wordid
//                                             LEFT JOIN words t ON t.wordid = w.translationid 
//                                             JOIN userword uw on uw.wordid = dw.wordid
//                                             WHERE dw.dictid = $1 and userid = $2 and container <= 5 and method = $3`, [dictid, userid, method]);
  
//   res.json({success: true, words: returnWords.rows});     
//   } catch (err) {
//     res.status(500).json({success: false});
//   }
// });
